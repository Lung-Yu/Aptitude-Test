export type QuestionType = 'single' | 'multiple' | 'truefalse' | 'scenario';

export type Quadrant = 'architecture' | 'performance' | 'reliability' | 'data';

export interface QuadrantDistribution {
  architecture: number;
  performance: number;
  reliability: number;
  data: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  quadrant: Quadrant | 'mixed';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  maxScore: number;
  distribution?: QuadrantDistribution;
  rubric?: string[];
}

export interface QuizState {
  currentStep: number;
  answers: Record<string, string | string[]>;
  isComplete: boolean;
}

export type QuizAction =
  | { type: 'SET_ANSWER'; payload: { questionId: string; answer: string | string[] } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'JUMP_TO_STEP'; payload: number }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ' };
