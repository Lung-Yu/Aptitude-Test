import type { Question } from '../types/quiz.types';
import type { ScoreResult, QuadrantScores, QuadrantMaxScores } from '../types/results.types';
import { getQuadrantKeys } from '../data/categories';

const DONT_KNOW_VALUE = 'DONT_KNOW';

export const calculateScore = (
  questions: Question[],
  answers: Record<string, string | string[]>,
  scenarioScores?: Record<string, number>
): ScoreResult => {
  // Initialize scores, maxScores, and dontKnowCounts dynamically for all quadrants
  const quadrantKeys = getQuadrantKeys();
  const scores: QuadrantScores = {};
  const maxScores: QuadrantMaxScores = {};
  const dontKnowCounts: QuadrantScores = {};
  
  quadrantKeys.forEach(key => {
    scores[key] = 0;
    maxScores[key] = 0;
    dontKnowCounts[key] = 0;
  });

  let totalDontKnow = 0;

  questions.forEach((question) => {
    const userAnswer = answers[question.id];
    let questionScore = 0;
    let isDontKnow = false;

    // Check if user selected "Don't Know"
    if (userAnswer === DONT_KNOW_VALUE || 
        (Array.isArray(userAnswer) && userAnswer.includes(DONT_KNOW_VALUE))) {
      isDontKnow = true;
      totalDontKnow++;
    }

    // Calculate question score based on type (DONT_KNOW counts as 0)
    if (!isDontKnow) {
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
    }

    // Distribute score and don't know count to quadrants
    if (question.quadrant === 'mixed' && question.distribution) {
      // Dynamically distribute across all quadrants in distribution
      Object.entries(question.distribution).forEach(([quadrant, ratio]) => {
        if (scores[quadrant] !== undefined) {
          scores[quadrant] += questionScore * ratio;
          maxScores[quadrant] += question.maxScore * ratio;
          if (isDontKnow) {
            dontKnowCounts[quadrant] += ratio; // Fractional count for mixed questions
          }
        }
      });
    } else if (question.quadrant !== 'mixed' && scores[question.quadrant] !== undefined) {
      scores[question.quadrant] += questionScore;
      maxScores[question.quadrant] += question.maxScore;
      if (isDontKnow) {
        dontKnowCounts[question.quadrant] += 1;
      }
    }
  });

  // Calculate percentages dynamically
  const percentages: QuadrantScores = {};
  quadrantKeys.forEach(key => {
    percentages[key] = maxScores[key] > 0 ? (scores[key] / maxScores[key]) * 100 : 0;
  });

  // Calculate totals dynamically
  const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);
  const totalMaxScore = Object.values(maxScores).reduce((sum, val) => sum + val, 0);
  const overallPercentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;

  return {
    scores,
    maxScores,
    percentages,
    totalScore: Math.round(totalScore * 100) / 100,
    totalMaxScore: Math.round(totalMaxScore * 100) / 100,
    overallPercentage: Math.round(overallPercentage * 100) / 100,
    dontKnowCounts,
    totalDontKnow
  };
};
