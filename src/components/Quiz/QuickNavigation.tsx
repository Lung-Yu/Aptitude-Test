import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import type { Question } from '../../types/quiz.types';

interface QuickNavigationProps {
  currentStep: number;
  answers: Record<string, string | string[]>;
  questions: Question[];
}

export const QuickNavigation: React.FC<QuickNavigationProps> = ({
  currentStep,
  answers,
  questions
}) => {
  const { jumpToStep } = useQuiz();

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">快速導航</h3>
      <div className="grid grid-cols-10 gap-2">
        {questions.map((q, index) => {
          const isAnswered = answers[q.id] && (
            Array.isArray(answers[q.id]) 
              ? (answers[q.id] as string[]).length > 0
              : answers[q.id] !== ''
          );
          const isCurrent = index === currentStep;
          
          return (
            <button
              key={q.id}
              onClick={() => jumpToStep(index)}
              className={`
                w-10 h-10 rounded-lg font-medium text-sm transition-all
                ${isCurrent 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                  : isAnswered
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};
