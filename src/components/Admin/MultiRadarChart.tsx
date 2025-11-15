import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import type { ParticipantRecord } from '../../types/admin.types';
import { quadrants } from '../../data/categories';

interface MultiRadarChartProps {
  records: ParticipantRecord[];
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'
];

export const MultiRadarChart: React.FC<MultiRadarChartProps> = ({ records }) => {
  // Build data structure: each quadrant with all participants' percentages
  const chartData = quadrants.map((quadrant) => {
    const dataPoint: Record<string, string | number> = {
      quadrant: quadrant.name
    };
    
    records.forEach((record) => {
      const score = record.quadrantScores[quadrant.key] || 0;
      const maxScore = record.quadrantMaxScores[quadrant.key] || 1;
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
      dataPoint[record.name] = Math.round(percentage);
    });
    
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height={500}>
      <RadarChart data={chartData}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="quadrant" tick={{ fill: '#6b7280', fontSize: 12 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
        
        {records.map((record, index) => (
          <Radar
            key={record.email}
            name={record.name}
            dataKey={record.name}
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        ))}
        
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
};
