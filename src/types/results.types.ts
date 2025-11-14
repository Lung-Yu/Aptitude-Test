// Dynamic quadrant scores - supports any number of quadrants
export type QuadrantScores = Record<string, number>;

export type QuadrantMaxScores = Record<string, number>;

export interface ScoreResult {
  scores: QuadrantScores;
  maxScores: QuadrantMaxScores;
  percentages: QuadrantScores;
  totalScore: number;
  totalMaxScore: number;
  overallPercentage: number;
}

export interface RadarChartData {
  quadrant: string;
  score: number;
  maxScore: number;
  percentage: number;
}
