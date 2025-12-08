// App.tsx - VERSÃO ATUALIZADA (apenas remover dados mock)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { QuestionFeed } from './components/Question/QuestionFeed';
import { QuestionPage } from './pages/QuestionPage/QuestionPage';
import { CreateQuestionModal } from './components/Modal/CreateQuestionModal';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { TagsPage } from './pages/TagsPage/TagsPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { NotificationsPage } from './pages/User/NotificationsPage';
import { BookmarksPage } from './pages/User/BookmarksPage';
import { FollowingPage } from './pages/User/FollowingPage';
import { UsersPage } from './pages/Community/UsersPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { SignupPage } from './pages/SignupPage/SignupPage';
import { LandingPage } from './pages/LandingPage/LandingPage';
import { BadgesPage } from './pages/Community/BadgesPage';
import { questionService } from './services/questions/questionService'; // ← ADICIONAR

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleCreateQuestion = async (questionData: { 
    title: string; 
    content: string; 
    tags: string[] 
  }) => {
    try {
      // ✅ AGORA USA O SERViÇO LOCAL (persiste no localStorage)
      await questionService.createQuestion(questionData);
      
      // Fecha modal
      setIsModalOpen(false);
      
      // Recarrega a página ou atualiza estado se necessário
      window.location.reload(); // Simples por enquanto
      
    } catch (error) {
      console.error('Erro ao criar pergunta:', error);
      alert('Erro ao criar pergunta: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* HEADER: Mostrar APENAS quando autenticado */}
      {isAuthenticated && <Header onCreateQuestion={() => setIsModalOpen(true)} />}
      
      {/* Modal */}
      {isAuthenticated && (
        <CreateQuestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateQuestion}
        />
      )}
      
      <Routes>
        {/* Rota principal */}
        <Route path="/" element={
          isAuthenticated ? 
            <QuestionFeed onCreateQuestion={() => setIsModalOpen(true)} /> : 
            <LandingPage />
        } />
        
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Rotas protegidas */}
        <Route path="/question/:id" element={<ProtectedRoute><QuestionPage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/tags" element={<ProtectedRoute><TagsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
        <Route path="/following" element={<ProtectedRoute><FollowingPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/badges" element={<ProtectedRoute><BadgesPage /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

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