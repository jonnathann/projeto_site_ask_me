// src/pages/Feed.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import './style_css/Feed.css';

interface Post {
  id: number;
  user: string;
  gender: 'male' | 'female';
  avatar_url?: string;
  question: string;
  created_at: string;
}

function Feed() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const posts: Post[] = [
    {
      id: 1,
      user: 'Ana Silva',
      gender: 'female',
      question: 'Como posso melhorar minha produtividade?',
      created_at: '2025-12-13T08:30:00Z',
    },
    {
      id: 2,
      user: 'Carlos M.',
      gender: 'male',
      question: 'Dicas para aprender programação mais rápido?',
      created_at: '2025-12-12T17:15:00Z',
    },
    {
      id: 3,
      user: 'João P.',
      gender: 'male',
      question: 'Como manter hábitos saudáveis diariamente?',
      created_at: '2025-12-12T12:00:00Z',
    },
  ];

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.style.backgroundColor = '#000';
    } else {
      document.body.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#f5f5f5';
    }
  };

  const handleAskClick = () => {
    if (user) navigate('/perguntar');
    else navigate('/login');
  };

  const handleReplyClick = (postId: number) => {
    if (user) navigate(`/responder/${postId}`);
    else navigate('/login');
  };

  // Carregar preferência de modo escuro
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setDarkMode(isDark);
      
      if (isDark) {
        document.body.classList.add('dark-mode');
        document.body.style.backgroundColor = '#000';
      } else {
        document.body.classList.remove('dark-mode');
        document.body.style.backgroundColor = '#f5f5f5';
      }
    }
  }, []);

  return (
    <div className="home-container">
      <Header 
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onAskClick={handleAskClick}
      />

      <main className="feed-section">
        <h2 className="section-title">Últimas Perguntas da Comunidade</h2>

        <div className="posts-list">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`post-card ${post.gender === 'male' ? 'male' : 'female'}`}
            >
              <div className="post-header">
                <div className="post-avatar">
                  {post.avatar_url ? (
                    <img src={post.avatar_url} alt={post.user} className="avatar-image" />
                  ) : (
                    <img
                      src={
                        post.gender === 'male'
                          ? '/images/avatar-male.png'
                          : '/images/avatar-female.png'
                      }
                      alt={post.user}
                      className="avatar-image"
                    />
                  )}
                </div>
                <div className="post-user-info">
                  <span className="post-user">{post.user}</span>
                  <span className="post-date">
                    {new Date(post.created_at).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div className="post-content">
                <p className="post-question">{post.question}</p>
              </div>

              <div className="post-actions">
                <button
                  className="reply-button"
                  onClick={() => handleReplyClick(post.id)}
                >
                  Responder
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Feed;