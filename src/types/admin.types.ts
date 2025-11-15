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
  answers: string;
  scenarioScores: string;
  notes: string;
}

export interface SheetFetchResult {
  success: boolean;
  records: ParticipantRecord[];
  error?: string;
}
