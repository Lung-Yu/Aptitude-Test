import React from 'react';

interface ScenarioProps {
  value: string;
  onChange: (value: string) => void;
  rubric?: string[];
  maxScore: number;
}

export const Scenario: React.FC<ScenarioProps> = ({ value, onChange, rubric, maxScore }) => {
  return (
    <div className="space-y-4">
      {rubric && rubric.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <h4 className="font-semibold text-amber-900 mb-2">評分準則（每項 1 分）：</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
            {rubric.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="text-sm text-amber-700 mt-2">滿分：{maxScore} 分</p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          請詳細描述你的答案：
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
          rows={8}
          placeholder="請在此輸入你的答案，盡可能詳細描述你的思路和方法..."
        />
        <p className="text-sm text-gray-500 mt-2">
          提示：情境題需要考官根據評分準則手動評分。請盡可能涵蓋準則中的要點。
        </p>
      </div>
    </div>
  );
};
