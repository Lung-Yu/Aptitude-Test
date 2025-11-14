import React from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { QuizContainer } from './components/Quiz/QuizContainer';
import { ResultsContainer } from './components/Results/ResultsContainer';

const AppContent: React.FC = () => {
  const { state } = useQuiz();

  return (
    <>
      {!state.isComplete ? <QuizContainer /> : <ResultsContainer />}
    </>
  );
};

function App() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}

export default App;
