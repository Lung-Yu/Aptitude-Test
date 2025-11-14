import React from 'react';

interface MultipleChoiceProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({ options, value, onChange }) => {
  const handleToggle = (optionKey: string) => {
    if (value.includes(optionKey)) {
      onChange(value.filter((v) => v !== optionKey));
    } else {
      onChange([...value, optionKey]);
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
    </div>
  );
};
