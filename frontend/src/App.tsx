// App.tsx - VERSÃO ATUALIZADA COM USERS PAGE
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
import { Question } from './types/Question';
import { BadgesPage } from './pages/Community/BadgesPage';


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const { isAuthenticated } = useAuth();

  const handleCreateQuestion = async (questionData: { 
    title: string; 
    content: string; 
    tags: string[] 
  }) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
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
            <QuestionFeed onCreateQuestion={() => setIsModalOpen(true)} questions={questions} /> : 
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