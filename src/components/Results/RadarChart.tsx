import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { ScoreResult } from '../../types/results.types';
import { quadrants } from '../../data/categories';

interface RadarChartProps {
  result: ScoreResult;
}

export const RadarChart: React.FC<RadarChartProps> = ({ result }) => {
  const data = quadrants.map((quadrant) => ({
    quadrant: quadrant.name,
    score: result.percentages[quadrant.key],
    fullMark: 100
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">能力雷達圖</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <RechartsRadar data={data}>
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis 
            dataKey="quadrant" 
            tick={{ fill: '#475569', fontSize: 12 }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <Radar
            name="得分百分比"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            strokeWidth={2}
          />
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(1)}%`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '1rem'
            }}
          />
        </RechartsRadar>
      </ResponsiveContainer>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>雷達圖顯示你在四個技術象限的相對表現</p>
        <p className="mt-1">面積越大表示整體能力越強</p>
      </div>
    </div>
  );
};
