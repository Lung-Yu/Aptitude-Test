import React from 'react';
import { useQuiz } from '../../context/QuizContext';
import { questions } from '../../data/questions';
import { calculateScore } from '../../utils/scoreCalculator';
import { RadarChart } from './RadarChart';
import { ScoreSummary } from './ScoreSummary';

export const ResultsContainer: React.FC = () => {
  const { state, resetQuiz } = useQuiz();
  const result = calculateScore(questions, state.answers);

  const handleRestart = () => {
    if (confirm('確定要重新開始評測嗎？所有答案將會被清除。')) {
      resetQuiz();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            評測完成！
          </h1>
          <p className="text-gray-600">以下是你的後端工程能力分析結果</p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-8 print:hidden">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            🔄 重新評測
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            🖨️ 列印結果
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Summary */}
          <ScoreSummary result={result} />

          {/* Radar Chart */}
          <RadarChart result={result} />
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">詳細分析</h2>
          
          <div className="space-y-6">
            {/* Architecture & Design */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Architecture & Design ({result.scores.architecture.toFixed(2)}/{result.maxScores.architecture.toFixed(2)})
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                系統設計、一致性模型、API 設計等核心架構能力
              </p>
              <div className="text-sm text-gray-600">
                {result.percentages.architecture >= 80 && '✅ 優秀：對系統架構有深入理解，能設計可擴展的解決方案。'}
                {result.percentages.architecture >= 60 && result.percentages.architecture < 80 && '✔️ 良好：具備架構基礎，建議深入學習分散式系統設計模式。'}
                {result.percentages.architecture < 60 && '⚠️ 需加強：建議系統學習架構設計模式、一致性模型和 API 設計最佳實踐。'}
              </div>
            </div>

            {/* Performance & Observability */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Performance & Observability ({result.scores.performance.toFixed(2)}/{result.maxScores.performance.toFixed(2)})
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                效能優化、快取策略、分散式追蹤、監控指標等
              </p>
              <div className="text-sm text-gray-600">
                {result.percentages.performance >= 80 && '✅ 優秀：具備專業的效能調校和可觀測性實踐能力。'}
                {result.percentages.performance >= 60 && result.percentages.performance < 80 && '✔️ 良好：理解效能基礎，建議深入學習分散式追蹤和 SLO 監控。'}
                {result.percentages.performance < 60 && '⚠️ 需加強：建議學習效能分析工具、快取策略和可觀測性最佳實踐。'}
              </div>
            </div>

            {/* Reliability & Delivery */}
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                Reliability & Delivery ({result.scores.reliability.toFixed(2)}/{result.maxScores.reliability.toFixed(2)})
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                發布策略、韌性設計、併發控制、品質閘門等
              </p>
              <div className="text-sm text-gray-600">
                {result.percentages.reliability >= 80 && '✅ 優秀：精通可靠性工程和持續交付實踐。'}
                {result.percentages.reliability >= 60 && result.percentages.reliability < 80 && '✔️ 良好：具備基本可靠性知識，建議學習混沌工程和自動化回滾。'}
                {result.percentages.reliability < 60 && '⚠️ 需加強：建議學習發布策略、韌性模式和併發控制機制。'}
              </div>
            </div>

            {/* Data & Storage */}
            <div className="border-l-4 border-violet-500 pl-4">
              <h3 className="text-lg font-semibold text-violet-900 mb-2">
                Data & Storage ({result.scores.data.toFixed(2)}/{result.maxScores.data.toFixed(2)})
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                索引策略、查詢優化、Schema 設計、資料安全等
              </p>
              <div className="text-sm text-gray-600">
                {result.percentages.data >= 80 && '✅ 優秀：對資料庫和儲存系統有深入理解。'}
                {result.percentages.data >= 60 && result.percentages.data < 80 && '✔️ 良好：具備資料庫基礎，建議深入學習索引優化和 NoSQL 設計。'}
                {result.percentages.data < 60 && '⚠️ 需加強：建議學習索引原理、查詢優化和不同儲存模型的適用場景。'}
              </div>
            </div>
          </div>
        </div>

        {/* Note about Scenario Questions */}
        <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <h3 className="font-semibold text-amber-900 mb-2">📋 關於情境題評分</h3>
          <p className="text-sm text-amber-800">
            情境題（Q17-Q20）需要人工根據評分準則進行評分。目前系統假設情境題未評分或已手動評分。
            如需完整評測，請由考官審閱情境題答案並根據準則給分。
          </p>
        </div>
      </div>
    </div>
  );
};
