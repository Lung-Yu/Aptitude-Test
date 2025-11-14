import type { Quadrant } from '../data/categories';

export type QuestionType = 'single' | 'multiple' | 'truefalse' | 'scenario';

export type { Quadrant };

// Dynamic distribution - can contain any quadrant keys
export type QuadrantDistribution = Record<string, number>;

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
  scenarioScores: Record<string, number>;
  isComplete: boolean;
}

export type QuizAction =
  | { type: 'SET_ANSWER'; payload: { questionId: string; answer: string | string[] } }
  | { type: 'SET_SCENARIO_SCORE'; payload: { questionId: string; score: number } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'JUMP_TO_STEP'; payload: number }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ' };
