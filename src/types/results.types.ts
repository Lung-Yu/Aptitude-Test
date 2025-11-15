// Dynamic quadrant scores - supports any number of quadrants
export type QuadrantScores = Record<string, number>;

export type QuadrantMaxScores = Record<string, number>;

// Level assessment types
export type Level = 'Entry' | 'Junior' | 'Mid' | 'Senior' | 'Staff';

export type DimensionLevels = Record<string, Level>;

export interface ScoreResult {
  scores: QuadrantScores;
  maxScores: QuadrantMaxScores;
  percentages: QuadrantScores;
  totalScore: number;
  totalMaxScore: number;
  overallPercentage: number;
  dontKnowCounts: QuadrantScores;
  totalDontKnow: number;
  dimensionLevels?: DimensionLevels;  // Level for each dimension
  overallLevel?: Level;  // Overall level assessment
}

export interface RadarChartData {
  quadrant: string;
  score: number;
  maxScore: number;
  percentage: number;
}
