import React from 'react';

interface SingleChoiceProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const SingleChoice: React.FC<SingleChoiceProps> = ({ options, value, onChange }) => {
  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const optionKey = option.charAt(0); // Extract A, B, C, D
        return (
          <label
            key={index}
            className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50"
            style={{
              borderColor: value === optionKey ? '#3b82f6' : '#e5e7eb',
              backgroundColor: value === optionKey ? '#eff6ff' : 'white'
            }}
          >
            <input
              type="radio"
              name="single-choice"
              value={optionKey}
              checked={value === optionKey}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 mr-3 w-4 h-4 text-blue-600"
            />
            <span className="flex-1 text-gray-700">{option}</span>
          </label>
        );
      })}
    </div>
  );
};
