export interface QuadrantScores {
  architecture: number;
  performance: number;
  reliability: number;
  data: number;
}

export interface QuadrantMaxScores {
  architecture: number;
  performance: number;
  reliability: number;
  data: number;
}

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
