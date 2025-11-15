import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { questions } from '../../data/questions';
import { getQuadrantInfo } from '../../data/categories';
import type { Question } from '../../types/quiz.types';

export const AnswerReview: React.FC = () => {
  const { state } = useQuiz();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(questions[0]);
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect'>('all');

  const getQuestionStatus = (question: Question) => {
    const userAnswer = state.answers[question.id];
    const DONT_KNOW_VALUE = 'DONT_KNOW';
    
    // Check if user selected "Don't Know"
    const isDontKnow = userAnswer === DONT_KNOW_VALUE || 
                       (Array.isArray(userAnswer) && userAnswer.includes(DONT_KNOW_VALUE));
    
    if (question.type === 'scenario') {
      const score = state.scenarioScores?.[question.id];
      return {
        isCorrect: score !== undefined && score > 0,
        isAnswered: (userAnswer !== undefined && userAnswer !== '') || isDontKnow,
        isDontKnow: isDontKnow,
        score: score
      };
    }

    if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
      return { isCorrect: false, isAnswered: false, isDontKnow: false };
    }

    if (isDontKnow) {
      return { isCorrect: false, isAnswered: true, isDontKnow: true };
    }

    if (question.type === 'single' || question.type === 'truefalse') {
      return { 
        isCorrect: userAnswer === question.correctAnswer,
        isAnswered: true,
        isDontKnow: false
      };
    }

    if (question.type === 'multiple') {
      const correctAnswers = Array.isArray(question.correctAnswer) 
        ? question.correctAnswer 
        : [question.correctAnswer];
      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      const isCorrect = correctAnswers.length === userAnswers.length &&
        correctAnswers.every(ans => userAnswers.includes(ans));
      
      return { isCorrect, isAnswered: true, isDontKnow: false };
    }

    return { isCorrect: false, isAnswered: false, isDontKnow: false };
  };

  const filteredQuestions = questions.filter(q => {
    if (filterType === 'all') return true;
    const status = getQuestionStatus(q);
    if (filterType === 'correct') return status.isCorrect;
    if (filterType === 'incorrect') return status.isAnswered && !status.isCorrect; // Includes isDontKnow
    return true;
  });

  const correctCount = questions.filter(q => getQuestionStatus(q).isCorrect).length;
  const incorrectCount = questions.filter(q => {
    const status = getQuestionStatus(q);
    return status.isAnswered && !status.isCorrect; // Includes both wrong and don't know
  }).length;
  const dontKnowCount = questions.filter(q => getQuestionStatus(q).isDontKnow).length;

  const renderAnswer = (question: Question) => {
    const userAnswer = state.answers[question.id];
    const status = getQuestionStatus(question);

    if (question.type === 'scenario') {
      const score = state.scenarioScores?.[question.id];
      
      if (status.isDontKnow) {
        return (
          <div className="space-y-3">
            <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
              <div className="font-medium text-gray-700 mb-2">你的答案：</div>
              <div className="flex items-center gap-2 font-medium text-gray-600">
                <span className="text-2xl">❔</span>
                <span>不確定 / 跳過</span>
              </div>
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-sm text-amber-800">
                  💡 你選擇了跳過此題，建議閱讀評分準則來了解此題的考點。
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">得分：</span>
              <span className="text-lg font-bold text-gray-400">0 / {question.maxScore}</span>
            </div>
          </div>
        );
      }
      
      return (
        <div className="space-y-3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-700 mb-2">你的答案：</div>
            <div className="text-gray-900 whitespace-pre-wrap">{userAnswer || '未作答'}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">得分：</span>
            <span className={`text-lg font-bold ${score !== undefined ? 'text-blue-600' : 'text-gray-400'}`}>
              {score !== undefined ? `${score} / ${question.maxScore}` : '未評分'}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {status.isDontKnow ? (
          <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
            <div className="font-medium text-gray-700 mb-2">你的答案：</div>
            <div className="flex items-center gap-2 font-medium text-gray-600">
              <span className="text-2xl">❔</span>
              <span>不確定 / 跳過</span>
            </div>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-sm text-amber-800">
                💡 你選擇了跳過此題，建議閱讀以下解析來學習正確答案。
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="font-medium text-gray-700 mb-2">你的答案：</div>
            <div className={`font-medium ${status.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer || '未作答'}
            </div>
          </div>
        )}
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="font-medium text-green-700 mb-2">正確答案：</div>
          <div className="font-medium text-green-800">
            {Array.isArray(question.correctAnswer) 
              ? question.correctAnswer.join(', ') 
              : question.correctAnswer}
          </div>
        </div>

        {question.explanation && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-700 mb-2">💡 詳細解析：</div>
            <div className="text-blue-900 leading-relaxed">{question.explanation}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">答案解析</h2>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          全部題目 ({questions.length})
        </button>
        <button
          onClick={() => setFilterType('correct')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterType === 'correct'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ✓ 答對 ({correctCount})
        </button>
        <button
          onClick={() => setFilterType('incorrect')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterType === 'incorrect'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ✗ 答錯/跳過 ({incorrectCount})
        </button>
        {dontKnowCount > 0 && (
          <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium">
            ❔ 不確定：{dontKnowCount} 題
          </div>
        )}
      </div>

      {/* Question List */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Left: Question selector */}
        <div className="md:col-span-1 space-y-2">
          <div className="font-semibold text-gray-700 mb-3">選擇題目</div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {filteredQuestions.map((q) => {
              const status = getQuestionStatus(q);
              const isSelected = selectedQuestion?.id === q.id;
              const quadrantInfo = q.quadrant !== 'mixed' ? getQuadrantInfo(q.quadrant) : null;

              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestion(q)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-blue-100 ring-2 ring-blue-400 shadow-md'
                      : status.isCorrect
                        ? 'bg-green-50 hover:bg-green-100'
                        : status.isDontKnow
                          ? 'bg-gray-100 hover:bg-gray-200'
                          : status.isAnswered
                            ? 'bg-red-50 hover:bg-red-100'
                            : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{q.id}</span>
                    {status.isCorrect ? (
                      <span className="text-green-600">✓</span>
                    ) : status.isDontKnow ? (
                      <span className="text-gray-500">❔</span>
                    ) : status.isAnswered ? (
                      <span className="text-red-600">✗</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  {quadrantInfo && (
                    <div 
                      className="text-xs mt-1 font-medium"
                      style={{ color: quadrantInfo.color }}
                    >
                      {quadrantInfo.name}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Question detail */}
        <div className="md:col-span-3">
          {selectedQuestion && (
            <div className="space-y-4">
              {/* Question header */}
              <div className="border-b pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{selectedQuestion.id}</span>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                    {selectedQuestion.type === 'single' ? '單選題' :
                     selectedQuestion.type === 'multiple' ? '複選題' :
                     selectedQuestion.type === 'truefalse' ? '是非題' :
                     '情境題'}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {selectedQuestion.maxScore} 分
                  </span>
                  {getQuestionStatus(selectedQuestion).isCorrect && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      ✓ 答對
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedQuestion.question}
                </h3>
              </div>

              {/* Options (if applicable) */}
              {selectedQuestion.options && (
                <div className="space-y-2">
                  <div className="font-medium text-gray-700">選項：</div>
                  {selectedQuestion.options.map((option, idx) => {
                    const optionLetter = option.charAt(0);
                    const userAnswer = state.answers[selectedQuestion.id];
                    const isUserChoice = Array.isArray(userAnswer) 
                      ? userAnswer.includes(optionLetter)
                      : userAnswer === optionLetter;
                    const correctAnswers = Array.isArray(selectedQuestion.correctAnswer)
                      ? selectedQuestion.correctAnswer
                      : [selectedQuestion.correctAnswer];
                    const isCorrect = correctAnswers.includes(optionLetter);

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border-2 ${
                          isCorrect && isUserChoice
                            ? 'bg-green-50 border-green-400'
                            : isCorrect
                              ? 'bg-green-50 border-green-300'
                              : isUserChoice
                                ? 'bg-red-50 border-red-400'
                                : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{option}</span>
                          {isCorrect && <span className="text-green-600 font-bold">✓ 正確答案</span>}
                          {isUserChoice && !isCorrect && <span className="text-red-600 font-bold">✗ 你的選擇</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Answer and explanation */}
              {renderAnswer(selectedQuestion)}

              {/* Rubric for scenario questions */}
              {selectedQuestion.rubric && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="font-medium text-purple-700 mb-2">評分準則：</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-purple-900">
                    {selectedQuestion.rubric.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
