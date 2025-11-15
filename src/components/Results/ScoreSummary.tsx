import React from 'react';
import type { ScoreResult } from '../../types/results.types';
import { quadrants } from '../../data/categories';

interface ScoreSummaryProps {
  result: ScoreResult;
}

export const ScoreSummary: React.FC<ScoreSummaryProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">評測結果總覽</h2>
      
      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        <div className="text-center">
          <p className="text-gray-600 mb-2">總分</p>
          <p className="text-4xl font-bold text-blue-600">
            {result.totalScore} / {result.totalMaxScore}
          </p>
          <p className="text-xl text-gray-700 mt-2">
            {result.overallPercentage.toFixed(1)}%
          </p>
          {result.totalDontKnow > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-sm text-gray-600">
                ❔ 不確定 / 跳過：<span className="font-semibold text-gray-700">{result.totalDontKnow}</span> 題
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quadrant Scores */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">各象限得分</h3>
        {quadrants.map((quadrant) => {
          const score = result.scores[quadrant.key];
          const maxScore = result.maxScores[quadrant.key];
          const percentage = result.percentages[quadrant.key];
          const dontKnowCount = result.dontKnowCounts[quadrant.key];
          
          return (
            <div key={quadrant.key} className="border-l-4 pl-4 py-2" style={{ borderColor: quadrant.color }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{quadrant.name}</h4>
                  <p className="text-sm text-gray-600">{quadrant.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: quadrant.color }}>
                    {score.toFixed(2)} / {maxScore.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                  {dontKnowCount > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      （不確定：{Math.round(dontKnowCount)} 題）
                    </p>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: quadrant.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Level */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">整體表現</h3>
        <p className="text-gray-700">
          {result.overallPercentage >= 80 && '優秀！你展現了出色的後端工程能力，各個領域都有扎實的理解。'}
          {result.overallPercentage >= 60 && result.overallPercentage < 80 && '良好！你有不錯的基礎知識，但在某些領域還有提升空間。'}
          {result.overallPercentage >= 40 && result.overallPercentage < 60 && '中等。建議加強各個象限的知識，特別關注得分較低的領域。'}
          {result.overallPercentage < 40 && '需要改進。建議系統性地學習後端工程各個領域的知識和最佳實踐。'}
        </p>
      </div>
    </div>
  );
};
