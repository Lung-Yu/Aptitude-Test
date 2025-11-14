import type { Question } from '../types/quiz.types';
import questionsData from './questions.json';

export const questions: Question[] = questionsData as Question[];

export const TOTAL_QUESTIONS = questions.length;
