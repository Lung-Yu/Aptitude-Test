import React from 'react';

interface TrueFalseProps {
  value: string;
  onChange: (value: string) => void;
}

export const TrueFalse: React.FC<TrueFalseProps> = ({ value, onChange }) => {
  const DONT_KNOW_VALUE = 'DONT_KNOW';
  const options = [
    { key: 'true', label: '正確 (True)' },
    { key: 'false', label: '錯誤 (False)' }
  ];

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.key}
          className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-purple-300 hover:bg-purple-50"
          style={{
            borderColor: value === option.key ? '#8b5cf6' : '#e5e7eb',
            backgroundColor: value === option.key ? '#f5f3ff' : 'white'
          }}
        >
          <input
            type="radio"
            name="true-false"
            value={option.key}
            checked={value === option.key}
            onChange={(e) => onChange(e.target.value)}
            className="mr-3 w-4 h-4 text-purple-600"
          />
          <span className="flex-1 text-gray-700 font-medium">{option.label}</span>
        </label>
      ))}
      
      {/* Don't Know Option */}
      <div className="pt-2 mt-2 border-t border-dashed border-gray-300">
        <label
          className="flex items-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50"
          style={{
            borderColor: value === DONT_KNOW_VALUE ? '#6b7280' : '#d1d5db',
            backgroundColor: value === DONT_KNOW_VALUE ? '#f3f4f6' : '#fafafa'
          }}
        >
          <input
            type="radio"
            name="true-false"
            value={DONT_KNOW_VALUE}
            checked={value === DONT_KNOW_VALUE}
            onChange={(e) => onChange(e.target.value)}
            className="mr-3 w-4 h-4 text-gray-500"
          />
          <span className="flex-1 text-gray-500 font-medium">❔ 不確定 / 跳過</span>
        </label>
      </div>
    </div>
  );
};
