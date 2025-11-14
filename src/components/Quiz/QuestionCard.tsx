import React from 'react';
import type { Question } from '../../types/quiz.types';
import { SingleChoice } from './QuestionTypes/SingleChoice';
import { MultipleChoice } from './QuestionTypes/MultipleChoice';
import { TrueFalse } from './QuestionTypes/TrueFalse';
import { Scenario } from './QuestionTypes/Scenario';
import { getQuadrantInfo } from '../../data/categories';

interface QuestionCardProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  questionNumber: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  value,
  onChange,
  questionNumber
}) => {
  const quadrantInfo = question.quadrant !== 'mixed' 
    ? getQuadrantInfo(question.quadrant)
    : null;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'single':
        return '單選題';
      case 'multiple':
        return '複選題';
      case 'truefalse':
        return '是非題';
      case 'scenario':
        return '情境題';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-500">
            題目 {questionNumber} / 20
          </span>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {getTypeLabel(question.type)}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {question.maxScore} 分
            </span>
          </div>
        </div>
        
        {quadrantInfo && (
          <div 
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
            style={{ 
              backgroundColor: `${quadrantInfo.color}20`,
              color: quadrantInfo.color 
            }}
          >
            {quadrantInfo.name}
          </div>
        )}
        
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Question Input */}
      <div className="mt-6">
        {question.type === 'single' && question.options && (
          <SingleChoice
            options={question.options}
            value={value as string}
            onChange={onChange}
          />
        )}
        
        {question.type === 'multiple' && question.options && (
          <MultipleChoice
            options={question.options}
            value={(value as string[]) || []}
            onChange={onChange}
          />
        )}
        
        {question.type === 'truefalse' && (
          <TrueFalse
            value={value as string}
            onChange={onChange}
          />
        )}
        
        {question.type === 'scenario' && (
          <Scenario
            value={value as string}
            onChange={onChange}
            rubric={question.rubric}
            maxScore={question.maxScore}
          />
        )}
      </div>
    </div>
  );
};
