import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { questions } from '../../data/questions';
import type { Question } from '../../types/quiz.types';

export const ScenarioGrading: React.FC = () => {
  const { state, setScenarioScore } = useQuiz();
  const scenarioQuestions = questions.filter(q => q.type === 'scenario');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    scenarioQuestions[0] || null
  );

  const handleScoreChange = (questionId: string, score: string) => {
    const numScore = parseFloat(score);
    if (!isNaN(numScore)) {
      setScenarioScore(questionId, numScore);
    }
  };

  if (scenarioQuestions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <p className="text-gray-600">沒有需要評分的情境題</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">情境題評分</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          請根據考生的答案和評分準則，為每道情境題給予 0-{selectedQuestion?.maxScore || 5} 分的評分。
        </p>
      </div>

      {/* Question Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {scenarioQuestions.map((q) => {
          const isGraded = state.scenarioScores && state.scenarioScores[q.id] !== undefined;
          const isSelected = selectedQuestion?.id === q.id;
          
          return (
            <button
              key={q.id}
              onClick={() => setSelectedQuestion(q)}
              className={`
                px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
                ${isSelected 
                  ? 'bg-amber-600 text-white ring-2 ring-amber-300' 
                  : isGraded
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {q.id}
              {isGraded && state.scenarioScores && ` (${state.scenarioScores[q.id]}分)`}
            </button>
          );
        })}
      </div>

      {/* Question Details */}
      {selectedQuestion && (
        <div className="space-y-6">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <h3 className="font-semibold text-amber-900 mb-2">題目</h3>
            <p className="text-amber-800">{selectedQuestion.question}</p>
          </div>

          {/* Rubric */}
          {selectedQuestion.rubric && selectedQuestion.rubric.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">
                評分準則（每項 1 分，滿分 {selectedQuestion.maxScore} 分）
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                {selectedQuestion.rubric.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Student Answer */}
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">考生答案</h3>
            <div className="text-gray-700 whitespace-pre-wrap">
              {typeof state.answers[selectedQuestion.id] === 'string' 
                ? state.answers[selectedQuestion.id] || '（尚未作答）'
                : '（尚未作答）'}
            </div>
          </div>

          {/* Score Input */}
          <div className="bg-white border-2 border-amber-300 p-6 rounded-lg">
            <label className="block mb-3">
              <span className="text-lg font-semibold text-gray-900 mb-2 block">
                評分（0-{selectedQuestion.maxScore} 分）
              </span>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  max={selectedQuestion.maxScore}
                  step="0.5"
                  value={
                    state.scenarioScores && state.scenarioScores[selectedQuestion.id] !== undefined
                      ? state.scenarioScores[selectedQuestion.id]
                      : ''
                  }
                  onChange={(e) => handleScoreChange(selectedQuestion.id, e.target.value)}
                  className="w-32 px-4 py-3 text-2xl font-bold text-center border-2 border-amber-400 rounded-lg focus:border-amber-600 focus:outline-none"
                  placeholder="0"
                />
                <span className="text-gray-600">/ {selectedQuestion.maxScore} 分</span>
              </div>
            </label>

            {/* Quick Score Buttons */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">快速給分：</p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: selectedQuestion.maxScore + 1 }, (_, i) => i).map(
                  (score) => (
                    <button
                      key={score}
                      onClick={() => handleScoreChange(selectedQuestion.id, score.toString())}
                      className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium"
                    >
                      {score}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Score Distribution Info */}
          {selectedQuestion.distribution && (
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
              <h3 className="font-semibold text-indigo-900 mb-2">分數分配</h3>
              <p className="text-sm text-indigo-800 mb-2">
                此題分數會按以下比例分配到各象限：
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {selectedQuestion.distribution.architecture > 0 && (
                  <div className="text-indigo-700">
                    Architecture: {(selectedQuestion.distribution.architecture * 100).toFixed(0)}%
                  </div>
                )}
                {selectedQuestion.distribution.performance > 0 && (
                  <div className="text-indigo-700">
                    Performance: {(selectedQuestion.distribution.performance * 100).toFixed(0)}%
                  </div>
                )}
                {selectedQuestion.distribution.reliability > 0 && (
                  <div className="text-indigo-700">
                    Reliability: {(selectedQuestion.distribution.reliability * 100).toFixed(0)}%
                  </div>
                )}
                {selectedQuestion.distribution.data > 0 && (
                  <div className="text-indigo-700">
                    Data: {(selectedQuestion.distribution.data * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grading Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">評分進度</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {scenarioQuestions.map((q) => {
            const score = state.scenarioScores ? state.scenarioScores[q.id] : undefined;
            const isGraded = score !== undefined;
            
            return (
              <div
                key={q.id}
                className={`p-3 rounded-lg ${
                  isGraded ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'
                } border-2`}
              >
                <div className="font-semibold text-gray-900">{q.id}</div>
                <div className="text-sm text-gray-600">
                  {isGraded ? `${score} / ${q.maxScore}` : '未評分'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
