import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { QuestionFeed } from './components/Question/QuestionFeed';
import { QuestionPage } from './pages/QuestionPage/QuestionPage';
import { CreateQuestionModal } from './components/Modal/CreateQuestionModal';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { TagsPage } from './pages/TagsPage/TagsPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { Question } from './types/Question';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

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

    // Adiciona a nova pergunta (na prática, enviaria para API)
    setQuestions(prev => [newQuestion, ...prev]);
    setIsModalOpen(false);
    
    console.log('Nova pergunta criada:', newQuestion);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header onCreateQuestion={() => setIsModalOpen(true)} />
        
        {/* Modal de Criar Pergunta (global) */}
        <CreateQuestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateQuestion}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <QuestionFeed 
                onCreateQuestion={() => setIsModalOpen(true)} 
                questions={questions}
              />
            } 
          />
          <Route path="/question/:id" element={<QuestionPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;