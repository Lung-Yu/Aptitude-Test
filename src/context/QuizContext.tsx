import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { QuizState, QuizAction } from '../types/quiz.types';
import { TOTAL_QUESTIONS } from '../data/questions';

const STORAGE_KEY = 'backend_assessment_quiz';

const initialState: QuizState = {
  currentStep: 0,
  answers: {},
  isComplete: false
};

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer
        }
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, TOTAL_QUESTIONS - 1)
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0)
      };
    case 'JUMP_TO_STEP':
      return {
        ...state,
        currentStep: Math.max(0, Math.min(action.payload, TOTAL_QUESTIONS - 1))
      };
    case 'COMPLETE_QUIZ':
      return {
        ...state,
        isComplete: true
      };
    case 'RESET_QUIZ':
      return initialState;
    default:
      return state;
  }
};

interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpToStep: (step: number) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try to load saved state from localStorage
  const loadSavedState = (): QuizState => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load saved quiz state:', error);
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(quizReducer, initialState, loadSavedState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save quiz state:', error);
    }
  }, [state]);

  const setAnswer = (questionId: string, answer: string | string[]) => {
    dispatch({ type: 'SET_ANSWER', payload: { questionId, answer } });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const prevStep = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const jumpToStep = (step: number) => {
    dispatch({ type: 'JUMP_TO_STEP', payload: step });
  };

  const completeQuiz = () => {
    dispatch({ type: 'COMPLETE_QUIZ' });
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        setAnswer,
        nextStep,
        prevStep,
        jumpToStep,
        completeQuiz,
        resetQuiz
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};
