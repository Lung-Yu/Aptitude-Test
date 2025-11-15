import React from 'react';

interface ScenarioProps {
  value: string;
  onChange: (value: string) => void;
  rubric?: string[];
  maxScore: number;
}

export const Scenario: React.FC<ScenarioProps> = ({ value, onChange, rubric, maxScore }) => {
  const DONT_KNOW_VALUE = 'DONT_KNOW';
  const isDontKnow = value === DONT_KNOW_VALUE;
  
  const handleDontKnowToggle = () => {
    if (isDontKnow) {
      onChange('');
    } else {
      onChange(DONT_KNOW_VALUE);
    }
  };

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
          value={isDontKnow ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDontKnow}
          className={`w-full p-4 border-2 rounded-lg focus:border-amber-500 focus:outline-none transition-colors ${
            isDontKnow ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : 'border-gray-300'
          }`}
          rows={8}
          placeholder={isDontKnow ? '你已選擇「不確定 / 跳過」此題' : '請在此輸入你的答案，盡可能詳細描述你的思路和方法...'}
        />
        <p className="text-sm text-gray-500 mt-2">
          提示：情境題需要考官根據評分準則手動評分。請盡可能涵蓋準則中的要點。
        </p>
      </div>

      {/* Don't Know Option */}
      <div className="pt-2 border-t border-dashed border-gray-300">
        <label
          className="flex items-start p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50"
          style={{
            borderColor: isDontKnow ? '#6b7280' : '#d1d5db',
            backgroundColor: isDontKnow ? '#f3f4f6' : '#fafafa'
          }}
        >
          <input
            type="checkbox"
            checked={isDontKnow}
            onChange={handleDontKnowToggle}
            className="mt-1 mr-3 w-4 h-4 text-gray-500 rounded"
          />
          <div className="flex-1">
            <span className="text-gray-600 font-medium">❔ 不確定 / 跳過此題</span>
            <p className="text-xs text-gray-500 mt-1">
              勾選此選項將不需填寫答案，此題將計為 0 分
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
