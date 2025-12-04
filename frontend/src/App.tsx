// App.tsx - VERSÃO COMPLETA E CORRIGIDA
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { QuestionFeed } from './components/Question/QuestionFeed';
import { QuestionPage } from './pages/QuestionPage/QuestionPage';
import { CreateQuestionModal } from './components/Modal/CreateQuestionModal';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { TagsPage } from './pages/TagsPage/TagsPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { SignupPage } from './pages/SignupPage/SignupPage';
import { Question } from './types/Question';

// Componente para rotas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Componente principal com lógica das rotas
function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Definir quais páginas NÃO devem ter Header
  const noHeaderPages = ['/login', '/signup', '/forgot-password'];
  const shouldShowHeader = isAuthenticated && !noHeaderPages.includes(location.pathname);

  const handleCreateQuestion = async (questionData: { 
    title: string; 
    content: string; 
    tags: string[] 
  }) => {
    // Simula criação de pergunta
    const newQuestion: Question = {
      id: (questions.length + 1).toString(),
      title: questionData.title,
      content: questionData.content,
      author: { 
        id: 'current-user', 
        name: 'Você',
        avatar: 'https://cdn.worldvectorlogo.com/logos/nuon.svg'
      },
      createdAt: new Date().toISOString().split('T')[0],
      answersCount: 0,
      upvotes: 0,
      tags: questionData.tags,
      isAnswered: false
    };

    setQuestions(prev => [newQuestion, ...prev]);
    setIsModalOpen(false);
    console.log('Nova pergunta criada:', newQuestion);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header só aparece quando autenticado e NÃO está em página de auth */}
      {shouldShowHeader && <Header onCreateQuestion={() => setIsModalOpen(true)} />}
      
      {/* Modal de Criar Pergunta (só para autenticados) */}
      {isAuthenticated && (
        <CreateQuestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateQuestion}
        />
      )}
      
      <Routes>
        {/* Rotas públicas - SEM HEADER */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Rotas protegidas - COM HEADER */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <QuestionFeed 
                onCreateQuestion={() => setIsModalOpen(true)} 
                questions={questions}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/question/:id" 
          element={
            <ProtectedRoute>
              <QuestionPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/tags" 
          element={
            <ProtectedRoute>
              <TagsPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile/:id" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rota padrão */}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated ? "/" : "/login"} replace />
          } 
        />
      </Routes>
    </div>
  );
}

// Componente principal com providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;