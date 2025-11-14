import type { Question } from '../types/quiz.types';
import type { ScoreResult, QuadrantScores, QuadrantMaxScores } from '../types/results.types';

export const calculateScore = (
  questions: Question[],
  answers: Record<string, string | string[]>,
  scenarioScores?: Record<string, number>
): ScoreResult => {
  const scores: QuadrantScores = {
    architecture: 0,
    performance: 0,
    reliability: 0,
    data: 0
  };

  const maxScores: QuadrantMaxScores = {
    architecture: 0,
    performance: 0,
    reliability: 0,
    data: 0
  };

  questions.forEach((question) => {
    const userAnswer = answers[question.id];
    let questionScore = 0;

    // Calculate question score based on type
    if (question.type === 'single' || question.type === 'truefalse') {
      if (userAnswer === question.correctAnswer) {
        questionScore = question.maxScore;
      }
    } else if (question.type === 'multiple') {
      // Multiple choice: must select all correct answers and no wrong ones
      const correctAnswers = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [question.correctAnswer];
      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];

      const isCorrect =
        correctAnswers.length === userAnswers.length &&
        correctAnswers.every((ans) => userAnswers.includes(ans));

      if (isCorrect) {
        questionScore = question.maxScore;
      }
    } else if (question.type === 'scenario') {
      // Scenario questions use manual scoring from scenarioScores
      if (scenarioScores && scenarioScores[question.id] !== undefined) {
        questionScore = scenarioScores[question.id];
      }
    }

    // Distribute score to quadrants
    if (question.quadrant === 'mixed' && question.distribution) {
      scores.architecture += questionScore * question.distribution.architecture;
      scores.performance += questionScore * question.distribution.performance;
      scores.reliability += questionScore * question.distribution.reliability;
      scores.data += questionScore * question.distribution.data;

      maxScores.architecture += question.maxScore * question.distribution.architecture;
      maxScores.performance += question.maxScore * question.distribution.performance;
      maxScores.reliability += question.maxScore * question.distribution.reliability;
      maxScores.data += question.maxScore * question.distribution.data;
    } else if (question.quadrant !== 'mixed') {
      scores[question.quadrant] += questionScore;
      maxScores[question.quadrant] += question.maxScore;
    }
  });

  // Calculate percentages
  const percentages: QuadrantScores = {
    architecture: maxScores.architecture > 0 ? (scores.architecture / maxScores.architecture) * 100 : 0,
    performance: maxScores.performance > 0 ? (scores.performance / maxScores.performance) * 100 : 0,
    reliability: maxScores.reliability > 0 ? (scores.reliability / maxScores.reliability) * 100 : 0,
    data: maxScores.data > 0 ? (scores.data / maxScores.data) * 100 : 0
  };

  const totalScore = scores.architecture + scores.performance + scores.reliability + scores.data;
  const totalMaxScore =
    maxScores.architecture + maxScores.performance + maxScores.reliability + maxScores.data;
  const overallPercentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

  return {
    scores,
    maxScores,
    percentages,
    totalScore: Math.round(totalScore * 100) / 100,
    totalMaxScore: Math.round(totalMaxScore * 100) / 100,
    overallPercentage: Math.round(overallPercentage * 100) / 100
  };
};
