import type { QuadrantScores, QuadrantMaxScores } from './results.types';

export interface ParticipantProfile {
  name: string;
  email: string;
  organization?: string;
  role?: string;
  experience?: string;
  notes?: string;
  consent: boolean;
}

export interface ScenarioSummary {
  graded: number;
  pending: number;
}

export interface AssessmentRecord {
  profile: ParticipantProfile;
  totalScore: number;
  totalMaxScore: number;
  overallPercentage: number;
  quadrantScores: QuadrantScores;
  quadrantMaxScores: QuadrantMaxScores;
  dontKnowCounts: QuadrantScores;
  totalDontKnow: number;
  answers: Record<string, string | string[]>;
  scenarioScores: Record<string, number>;
  scenarioSummary: ScenarioSummary;
  submittedAt: string;
}

export interface RecordSaveResult {
  success: boolean;
  message?: string;
  sheetUrl?: string;
}

export interface RecordManager {
  save(record: AssessmentRecord): Promise<RecordSaveResult>;
}
