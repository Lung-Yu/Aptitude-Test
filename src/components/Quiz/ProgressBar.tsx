import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  answeredCount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, answeredCount }) => {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          進度：{current + 1} / {total}
        </span>
        <span className="text-sm text-gray-600">
          已回答：{answeredCount} 題
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
