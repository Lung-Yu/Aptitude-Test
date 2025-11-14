import type { Quadrant } from '../types/quiz.types';

export interface QuadrantInfo {
  key: Quadrant;
  name: string;
  description: string;
  color: string;
}

export const quadrants: QuadrantInfo[] = [
  {
    key: 'architecture',
    name: 'Architecture & Design',
    description: '系統設計/一致性/邊界',
    color: '#3b82f6' // blue-500
  },
  {
    key: 'performance',
    name: 'Performance & Observability',
    description: '效能/快取/追蹤/指標',
    color: '#10b981' // green-500
  },
  {
    key: 'reliability',
    name: 'Reliability & Delivery',
    description: '釋出/韌性/併發',
    color: '#f59e0b' // amber-500
  },
  {
    key: 'data',
    name: 'Data & Storage',
    description: '索引/查詢/Schema/安全',
    color: '#8b5cf6' // violet-500
  }
];

export const getQuadrantInfo = (key: Quadrant): QuadrantInfo => {
  return quadrants.find(q => q.key === key) || quadrants[0];
};
