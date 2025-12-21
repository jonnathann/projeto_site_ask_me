// src/pages/Feed.tsx - VERSÃO FINAL
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import AskModal from '../components/AskModal';
import { getTimeAgo } from '../utils/timeUtils';
import './style_css/Feed.css';

interface Post {
  id: number;
  user: string;
  user_id: number;
  gender: 'male' | 'female' | 'other';
  avatar_url?: string;
  question: string;
  description?: string;
  category?: string;
  created_at: string;
  reply_count?: number;
  like_count?: number;
  is_anonymous?: boolean;
}

interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

const ensureFullUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `http://localhost:8000${url}`;
  return url;
};

const mapGenderToCss = (backendGender: string | null | undefined, isAnonymous: boolean = false): 'male' | 'female' | 'other' => {
  if (!backendGender) return 'other';
  const gender = backendGender.toLowerCase();
  if (gender === 'feminino') return 'female';
  if (gender === 'masculino') return 'male';
  return 'other';
};

const getAvatarUrl = (avatarUrl: string | null | undefined, gender: 'male' | 'female' | 'other'): string => {
  if (avatarUrl) {
    const fullUrl = ensureFullUrl(avatarUrl);
    return fullUrl;
  }
  if (gender === 'female') return '/images/avatar-female.png';
  return '/images/avatar-male.png';
};

const getDisplayName = (userName: string, gender: 'male' | 'female' | 'other', isAnonymous: boolean = false): string => {
  if (isAnonymous) return gender === 'female' ? 'Anônima' : 'Anônimo';
  return userName || 'Usuário';
};

function Feed() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [postingQuestion, setPostingQuestion] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const categories: Category[] = [
    { id: 'relacionamentos', name: 'Relacionamentos', emoji: '💖', color: '#ff6b8b', description: 'Amor, namoro, casamento, família' },
    { id: 'paquera', name: 'Paquera', emoji: '💘', color: '#ff4081', description: 'Flerte, conquista, encontros' },
    { id: 'sexo', name: 'Sexo', emoji: '🔞', color: '#e91e63', description: 'Sexualidade, intimidade, dúvidas íntimas' },
    { id: 'entretenimento', name: 'Entretenimento', emoji: '🎬', color: '#3f51b5', description: 'TV, séries, shows, celebridades' },
    { id: 'filmes', name: 'Filmes', emoji: '🎞️', color: '#2196f3', description: 'Cinema, crítica, recomendações' },
    { id: 'games', name: 'Games', emoji: '🎮', color: '#4caf50', description: 'Video games, jogos, e-sports' },
    { id: 'livros', name: 'Livros', emoji: '📚', color: '#795548', description: 'Literatura, autores, leitura' },
    { id: 'saude', name: 'Saúde', emoji: '⚕️', color: '#00bcd4', description: 'Bem-estar, doenças, cuidados' },
    { id: 'vida-cotidiana', name: 'Vida Cotidiana', emoji: '🍔', color: '#ff9800', description: 'Rotina, problemas do dia a dia' },
    { id: 'carreira', name: 'Carreira', emoji: '💼', color: '#607d8b', description: 'Trabalho, profissão, negócios' },
    { id: 'educacao', name: 'Educação', emoji: '🎓', color: '#9c27b0', description: 'Estudos, escolas, faculdades' },
    { id: 'comidas', name: 'Comidas', emoji: '🍕', color: '#f44336', description: 'Receitas, restaurantes, culinária' },
    { id: 'tecnologia', name: 'Tecnologia', emoji: '💻', color: '#009688', description: 'Apps, gadgets, programação' },
    { id: 'viagens', name: 'Viagens', emoji: '✈️', color: '#8bc34a', description: 'Turismo, destinos, hospedagem' },
    { id: 'esportes', name: 'Esportes', emoji: '⚽', color: '#ff5722', description: 'Futebol, basquete, atividades' },
    { id: 'musica', name: 'Música', emoji: '🎵', color: '#673ab7', description: 'Artistas, bandas, instrumentos' },
  ];

  const fetchQuestionsFromBackend = async () => {
    if (!user) return;
    
    setLoadingPosts(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/questions/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const allQuestions = await response.json();
        
        const backendPosts: Post[] = allQuestions.map((q: any) => ({
          id: q.id,
          user: q.author_name || 'Usuário',
          user_id: q.user_id,
          gender: mapGenderToCss(q.author_gender),
          avatar_url: q.author_avatar_url,
          question: q.title,
          description: q.description,
          category: q.category,
          created_at: q.created_at,
          reply_count: q.reply_count || 0,
          like_count: q.like_count || 0,
          is_anonymous: q.is_anonymous || false
        }));
        
        setPosts(backendPosts);
      }
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      fetchQuestionsFromBackend();
    }
  }, [user]);

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

  const handleOpenAskModal = () => {
    if (user) setShowAskModal(true);
    else navigate('/login');
  };

  const handleCloseAskModal = () => setShowAskModal(false);

  const handleViewProfile = (post: Post) => {
    if (post.is_anonymous) {
      alert('Esta é uma pergunta anônima. Perfil não disponível.');
      return;
    }
    
    if (!post.user_id) {
      console.error('❌ Post sem user_id:', post);
      alert('Erro: Não foi possível identificar o usuário.');
      return;
    }
    
    navigate(`/profile/${post.user_id}`);
  };

  const handlePostQuestion = async (questionData: {
    title: string;
    description: string;
    category: string;
    anonymous: boolean;
    media_url?: string;
  }) => {
    setPostingQuestion(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/questions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: questionData.title,
          description: questionData.description,
          category: questionData.category,
          media_url: questionData.media_url || null,
          is_anonymous: questionData.anonymous
        })
      });
      
      if (response.ok) {
        const newQuestion = await response.json();
        const newPost: Post = {
          id: newQuestion.id,
          user: newQuestion.author_name || 'Você',
          user_id: newQuestion.user_id,
          gender: mapGenderToCss(newQuestion.author_gender),
          avatar_url: newQuestion.author_avatar_url,
          question: newQuestion.title,
          description: newQuestion.description,
          category: newQuestion.category,
          created_at: newQuestion.created_at,
          reply_count: newQuestion.reply_count || 0,
          like_count: newQuestion.like_count || 0,
          is_anonymous: newQuestion.is_anonymous || false
        };
        setPosts(prev => [newPost, ...prev]);
        alert(`✅ Pergunta "${newQuestion.title.substring(0, 50)}..." publicada!`);
        setShowAskModal(false);
        fetchQuestionsFromBackend();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao publicar pergunta');
      }
    } catch (error: any) {
      console.error('❌ Erro:', error);
      alert(error.message || 'Erro ao publicar pergunta');
    } finally {
      setPostingQuestion(false);
    }
  };

  const handleReplyClick = (postId: number) => {
    if (user) navigate(`/responder/${postId}`);
    else navigate('/login');
  };

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
        onAskClick={handleOpenAskModal}
      />

      <main className="feed-section">
        <h2 className="section-title">
          <span className="section-title-icon">💬</span>
          Últimas Perguntas da Comunidade
        </h2>

        {loadingPosts ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div className="loading-spinner"></div>
            <p>Carregando perguntas...</p>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => {
              const avatarUrl = getAvatarUrl(post.avatar_url, post.gender);
              const displayName = getDisplayName(post.user, post.gender, post.is_anonymous);
              const timeInfo = getTimeAgo(post.created_at);
              
              return (
                <div
                  key={`${post.id}-${currentTime.getMinutes()}`}
                  className={`post-card ${post.gender}`}
                >
                  <div className="post-meta">
                    <span className="post-time" title={timeInfo.fullDate}>
                      {timeInfo.text}
                    </span>
                    {post.category && (
                      <span className="post-category"
                        style={{
                          backgroundColor: categories.find(c => c.id === post.category)?.color + '20',
                          color: categories.find(c => c.id === post.category)?.color,
                          borderColor: categories.find(c => c.id === post.category)?.color
                        }}
                      >
                        {categories.find(c => c.id === post.category)?.emoji} 
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                    )}
                    <div className="post-stats">
                      <div className="stat">
                        <span>💬</span>
                        <span>{post.reply_count || 0}</span>
                      </div>
                      <div className="stat">
                        <span>👍</span>
                        <span>{post.like_count || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="post-header">
                    {/* ✅ Avatar - APENAS adiciona classe para hover, sem mudar estilo */}
                    <div 
                      className={`post-avatar ${post.is_anonymous ? '' : 'clickable'}`}
                      onClick={() => !post.is_anonymous && handleViewProfile(post)}
                      title={post.is_anonymous ? "Pergunta anônima" : `Ver perfil de ${displayName}`}
                    >
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="avatar-image"
                        onError={(e) => {
                          e.currentTarget.src = post.gender === 'female' 
                            ? '/images/avatar-female.png' 
                            : '/images/avatar-male.png';
                        }}
                      />
                    </div>
                    
                    <div className="post-user-info">
                      {/* ✅ Nickname - VOLTA AO ESTILO ORIGINAL (preto), apenas adiciona classe para hover */}
                      <span 
                        className={`post-user ${post.is_anonymous ? '' : 'clickable'}`}
                        onClick={() => !post.is_anonymous && handleViewProfile(post)}
                        title={post.is_anonymous ? "Pergunta anônima - perfil não disponível" : `Ver perfil de ${displayName}`}
                        style={{
                          cursor: post.is_anonymous ? 'default' : 'pointer'
                        }}
                      >
                        {displayName}
                      </span>
                    </div>
                  </div>

                  <div className="post-content">
                    <h3 className="post-question-title">{post.question}</h3>
                    {post.description && (
                      <p className="post-question-description">{post.description}</p>
                    )}
                  </div>

                  <div className="post-actions">
                    <button
                      className="reply-button"
                      onClick={() => handleReplyClick(post.id)}
                    >
                      <span>💬</span>
                      Responder
                    </button>
                    
                    {/* ✅ Botão opcional */}
                    {!post.is_anonymous && (
                      <button
                        className="profile-button"
                        onClick={() => handleViewProfile(post)}
                      >
                        👤 Ver Perfil
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AskModal
        darkMode={darkMode}
        isOpen={showAskModal}
        onClose={handleCloseAskModal}
        onSubmit={handlePostQuestion}
        loading={postingQuestion}
      />
    </div>
  );
}

export default Feed;