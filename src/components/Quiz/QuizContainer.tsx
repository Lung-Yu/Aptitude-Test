import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { questions } from '../../data/questions';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from './ProgressBar';
import { QuickNavigation } from './QuickNavigation';

export const QuizContainer: React.FC = () => {
  const { state, setAnswer, nextStep, prevStep, completeQuiz } = useQuiz();
  const currentQuestion = questions[state.currentStep];
  const currentAnswer = state.answers[currentQuestion.id] || (currentQuestion.type === 'multiple' ? [] : '');
  
  const answeredCount = Object.keys(state.answers).filter(
    key => {
      const answer = state.answers[key];
      return Array.isArray(answer) ? answer.length > 0 : answer !== '';
    }
  ).length;

  const isLastQuestion = state.currentStep === questions.length - 1;
  const canGoNext = state.currentStep < questions.length - 1;

  const handleChange = (value: string | string[]) => {
    setAnswer(currentQuestion.id, value);
  };

  const handleNext = () => {
    if (canGoNext) {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (state.currentStep > 0) {
      prevStep();
    }
  };

  const handleComplete = () => {
    completeQuiz();
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            後端工程師能力評測
          </h1>
          <p className="text-gray-600">Backend Engineer Assessment</p>
        </div>

        {/* Progress */}
        <ProgressBar
          current={state.currentStep}
          total={questions.length}
          answeredCount={answeredCount}
        />

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          value={currentAnswer}
          onChange={handleChange}
          questionNumber={state.currentStep + 1}
        />

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={state.currentStep === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← 上一題
          </button>

          <div className="flex gap-3">
            {!isLastQuestion && (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                下一題 →
              </button>
            )}
            
            {isLastQuestion && (
              <button
                onClick={handleComplete}
                disabled={answeredCount < questions.length}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {answeredCount < questions.length 
                  ? `還有 ${questions.length - answeredCount} 題未作答`
                  : '完成評測 ✓'}
              </button>
            )}
          </div>
        </div>

        {/* Quick Navigation */}
        <QuickNavigation 
          currentStep={state.currentStep}
          answers={state.answers}
          questions={questions}
        />
      </div>
    </div>
  );
};
