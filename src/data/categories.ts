import categoriesData from './categories.json';

export interface QuadrantInfo {
  key: string;
  name: string;
  description: string;
  color: string;
}

// Import quadrants from JSON - can be extended by editing categories.json
export const quadrants = categoriesData as QuadrantInfo[];

// Derive the Quadrant type from the actual categories
export type Quadrant = typeof categoriesData[number]['key'];

export const getQuadrantInfo = (key: string): QuadrantInfo | undefined => {
  return quadrants.find(q => q.key === key);
};

// Helper to get all quadrant keys
export const getQuadrantKeys = (): string[] => {
  return quadrants.map(q => q.key);
};
