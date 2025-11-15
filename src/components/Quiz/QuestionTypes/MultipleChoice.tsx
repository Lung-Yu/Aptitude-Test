import React from 'react';

interface MultipleChoiceProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({ options, value, onChange }) => {
  const DONT_KNOW_VALUE = 'DONT_KNOW';

  const handleToggle = (optionKey: string) => {
    if (optionKey === DONT_KNOW_VALUE) {
      // If selecting "Don't Know", clear all other selections
      if (value.includes(DONT_KNOW_VALUE)) {
        onChange([]);
      } else {
        onChange([DONT_KNOW_VALUE]);
      }
    } else {
      // If selecting a regular option, remove "Don't Know" and toggle the option
      const filteredValue = value.filter(v => v !== DONT_KNOW_VALUE);
      if (filteredValue.includes(optionKey)) {
        onChange(filteredValue.filter((v) => v !== optionKey));
      } else {
        onChange([...filteredValue, optionKey]);
      }
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 mb-4">（可複選，需全選正確才得分）</p>
      {options.map((option, index) => {
        const optionKey = option.charAt(0); // Extract A, B, C, D
        const isSelected = value.includes(optionKey);
        return (
          <label
            key={index}
            className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-green-300 hover:bg-green-50"
            style={{
              borderColor: isSelected ? '#10b981' : '#e5e7eb',
              backgroundColor: isSelected ? '#f0fdf4' : 'white'
            }}
          >
            <input
              type="checkbox"
              value={optionKey}
              checked={isSelected}
              onChange={() => handleToggle(optionKey)}
              className="mt-1 mr-3 w-4 h-4 text-green-600 rounded"
            />
            <span className="flex-1 text-gray-700">{option}</span>
          </label>
        );
      })}
      
      {/* Don't Know Option */}
      <div className="pt-2 mt-2 border-t border-dashed border-gray-300">
        <label
          className="flex items-start p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50"
          style={{
            borderColor: value.includes(DONT_KNOW_VALUE) ? '#6b7280' : '#d1d5db',
            backgroundColor: value.includes(DONT_KNOW_VALUE) ? '#f3f4f6' : '#fafafa'
          }}
        >
          <input
            type="checkbox"
            value={DONT_KNOW_VALUE}
            checked={value.includes(DONT_KNOW_VALUE)}
            onChange={() => handleToggle(DONT_KNOW_VALUE)}
            className="mt-1 mr-3 w-4 h-4 text-gray-500 rounded"
          />
          <span className="flex-1 text-gray-500 font-medium">❔ 不確定 / 跳過</span>
        </label>
      </div>
    </div>
  );
};
