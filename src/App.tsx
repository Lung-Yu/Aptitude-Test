import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { QuizContainer } from './components/Quiz/QuizContainer';
import { ResultsContainer } from './components/Results/ResultsContainer';
import { AdminDashboard } from './components/Admin/AdminDashboard';

const QuizFlow: React.FC = () => {
  const { state } = useQuiz();
  return !state.isComplete ? <QuizContainer /> : <ResultsContainer />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <QuizProvider>
            <QuizFlow />
          </QuizProvider>
        } />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
