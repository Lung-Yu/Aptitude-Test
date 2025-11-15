import type { Level, DimensionLevels } from './results.types';

export interface ParticipantRecord {
  timestamp: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  experience: string;
  totalScore: number;
  totalMaxScore: number;
  percentage: number;
  gradedScenarios: number;
  pendingScenarios: number;
  quadrantScores: Record<string, number>;
  quadrantMaxScores: Record<string, number>;
  quadrantPercentages: Record<string, number>;
  answers: string;
  scenarioScores: string;
  notes: string;
  dimensionLevels: DimensionLevels;  // Level for each dimension
  overallLevel: Level;  // Overall level assessment
}

export interface SheetFetchResult {
  success: boolean;
  records: ParticipantRecord[];
  error?: string;
}
