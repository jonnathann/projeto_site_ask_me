// src/pages/Profile.tsx - VERSÃO COMPLETA SEM REDUNDÂNCIA DO 🎭
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { questionService } from '../services/questionService';
import Header from '../components/Header';
import AskModal from '../components/AskModal';
import { getTimeAgo } from '../utils/timeUtils';
import './style_css/Profile.css';

const API_BASE_URL = 'http://localhost:8000';

interface User {
  id: number;
  name: string;
  nickname: string;
  gender: 'masculino' | 'feminino' | 'outro' | 'prefiro_nao_dizer';
  bio: string | null;
  avatar_url: string | null;
  level: number;
  xp: number;
  created_at: string;
  email?: string;
}

interface UserPost {
  id: number;
  question: string;
  description?: string;
  category?: string;
  created_at: string;
  reply_count: number;
  like_count: number;
  is_anonymous?: boolean;
}

interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, logout, updateUser } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editBio, setEditBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [postingQuestion, setPostingQuestion] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeNumber = (value: any): number => {
    if (value === null || value === undefined || isNaN(value)) {
      return 0;
    }
    return Number(value);
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const ensureFullUrl = (url: string | null): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}/${url}`;
  };

  const getDefaultAvatar = (genderClass: string): string => {
    if (genderClass === 'male') {
      return `${API_BASE_URL}/static/images/avatar-male-default.png`;
    }
    if (genderClass === 'female') {
      return `${API_BASE_URL}/static/images/avatar-female-default.png`;
    }
    return `${API_BASE_URL}/static/images/avatar-default.png`;
  };

  const getAvatarUrl = (user: User | null, genderClass: string) => {
    if (user?.avatar_url) {
      return ensureFullUrl(user.avatar_url);
    }
    return getDefaultAvatar(genderClass);
  };

  const fetchQuestionsFromBackend = async (targetUserId: number, viewerId?: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/questions/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const allQuestions = await response.json();
        
        const userQuestions = allQuestions.filter((q: any) => {
          if (q.user_id !== targetUserId) return false;
          
          if (viewerId === targetUserId) return true;
          
          return !q.is_anonymous;
        });
        
        return userQuestions.map((q: any) => ({
          id: q.id,
          question: q.title || 'Sem título',
          description: q.description || '',
          category: q.category || 'outros',
          created_at: q.created_at || new Date().toISOString(),
          reply_count: safeNumber(q.reply_count),
          like_count: safeNumber(q.like_count),
          is_anonymous: q.is_anonymous || false
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar perguntas do backend:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        let targetUserId: number;
        
        if (userId) {
          targetUserId = parseInt(userId, 10);
          if (isNaN(targetUserId)) {
            throw new Error('ID de usuário inválido');
          }
        } else if (currentUser?.id) {
          targetUserId = currentUser.id;
        } else {
          navigate('/login');
          return;
        }

        const userData = await userService.getUserProfile(targetUserId);
        setProfileUser(userData);
        setEditNickname(userData.nickname || userData.name);
        setEditBio(userData.bio || '');
        
        const genderClass = getGenderClass(userData.gender);
        const avatarUrl = userData.avatar_url 
          ? ensureFullUrl(userData.avatar_url)
          : getDefaultAvatar(genderClass);
        setAvatarPreview(avatarUrl);

        const viewerId = currentUser?.id;
        const backendPosts = await fetchQuestionsFromBackend(targetUserId, viewerId);
        
        if (backendPosts.length > 0) {
          setUserPosts(backendPosts);
        } else {
          setUserPosts([]);
        }
        
      } catch (error: any) {
        console.error('❌ Erro ao carregar perfil:', error);
        setError(error.response?.data?.detail || error.message || 'Erro ao carregar perfil.');
      } finally {
        setLoading(false);
      }
    };

    if (userId || currentUser) {
      fetchUserProfile();
    }
  }, [userId, currentUser, navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleOpenAskModal = () => {
    if (currentUser) {
      setShowAskModal(true);
    } else {
      navigate('/login');
    }
  };

  const handleCloseAskModal = () => {
    setShowAskModal(false);
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
      const newQuestion = await questionService.postQuestion({
        title: questionData.title,
        description: questionData.description,
        category: questionData.category,
        media_url: questionData.media_url || undefined,
        is_anonymous: questionData.anonymous
      });
      
      alert(`✅ Pergunta "${newQuestion.title.substring(0, 50)}..." publicada!`);
      setShowAskModal(false);
      
      if (profileUser?.id === currentUser?.id) {
        const newPost: UserPost = {
          id: newQuestion.id,
          question: newQuestion.title,
          description: newQuestion.description,
          category: newQuestion.category,
          created_at: newQuestion.created_at,
          reply_count: safeNumber(newQuestion.reply_count),
          like_count: safeNumber(newQuestion.like_count),
          is_anonymous: newQuestion.is_anonymous
        };
        setUserPosts(prev => [newPost, ...prev]);
      }
      
    } catch (error: any) {
      console.error('❌ Erro ao publicar pergunta:', error);
      alert(error.response?.data?.detail || 'Erro ao publicar pergunta');
    } finally {
      setPostingQuestion(false);
    }
  };

  const handleReplyClick = (postId: number) => {
    if (currentUser) navigate(`/responder/${postId}`);
    else navigate('/login');
  };

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

  const handleEditClick = () => {
    if (profileUser) {
      setEditNickname(profileUser.nickname || profileUser.name);
      setEditBio(profileUser.bio || '');
      
      const genderClass = getGenderClass(profileUser.gender);
      const avatarUrl = profileUser.avatar_url 
        ? ensureFullUrl(profileUser.avatar_url)
        : getDefaultAvatar(genderClass);
      
      setAvatarPreview(avatarUrl);
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setError('');
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profileUser) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor, selecione uma imagem (JPEG, PNG, GIF ou WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      const result = await userService.uploadAvatar(profileUser.id, file);
      
      const fullAvatarUrl = ensureFullUrl(result.avatar_url);
      setAvatarPreview(fullAvatarUrl);
      
      if (profileUser) {
        const updatedUser = { ...profileUser, avatar_url: result.avatar_url };
        setProfileUser(updatedUser);
        
        if (currentUser?.id === profileUser.id) {
          updateUser(updatedUser);
        }
      }
      
      alert('Foto atualizada com sucesso!');
      
    } catch (error: any) {
      console.error('Erro no upload:', error);
      setError(error.response?.data?.detail || 'Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!profileUser || !editNickname.trim()) {
      alert('Por favor, insira um nickname válido');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      const updatedProfile = await userService.updateProfile(profileUser.id, {
        nickname: editNickname,
        bio: editBio || null
      });
      
      const updatedUser = { ...profileUser, ...updatedProfile };
      setProfileUser(updatedUser);
      
      if (currentUser?.id === profileUser.id) {
        updateUser(updatedUser);
      }
      
      setShowEditModal(false);
      alert('Perfil atualizado com sucesso!');
      
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      setError(error.response?.data?.detail || 'Erro ao atualizar perfil');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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

  const calculateStats = () => {
    const totalReplies = userPosts.reduce((acc, post) => {
      return acc + safeNumber(post.reply_count);
    }, 0);
    
    const totalLikes = userPosts.reduce((acc, post) => {
      return acc + safeNumber(post.like_count);
    }, 0);
    
    return { totalReplies, totalLikes };
  };

  const formatJoinDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        month: 'long', 
        year: 'numeric' 
      };
      return `Membro desde ${date.toLocaleDateString('pt-BR', options)}`;
    } catch {
      return 'Data de registro não disponível';
    }
  };

  const getGenderClass = (gender: string): string => {
    const genderMap: Record<string, string> = {
      'masculino': 'male',
      'feminino': 'female',
      'outro': 'other',
      'prefiro_nao_dizer': 'other'
    };
    return genderMap[gender?.toLowerCase()] || 'other';
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Header 
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onAskClick={handleOpenAskModal}
        />
        <div className="profile-content" style={{ textAlign: 'center', padding: '50px' }}>
          <div className="loading-spinner"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="profile-container">
        <Header 
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onAskClick={handleOpenAskModal}
        />
        <div className="profile-content" style={{ textAlign: 'center', padding: '50px' }}>
          <div className="error-icon">⚠️</div>
          <h3>{error || 'Usuário não encontrado'}</h3>
          <p>O perfil que você está tentando acessar não está disponível.</p>
          <button className="ask-button" onClick={() => navigate('/')}>
            Voltar para o início
          </button>
        </div>
      </div>
    );
  }

  const genderClass = getGenderClass(profileUser.gender);
  const isOwnProfile = !userId || (currentUser && parseInt(userId, 10) === currentUser.id);
  const displayName = profileUser.nickname || profileUser.name || 'Usuário';
  const { totalReplies, totalLikes } = calculateStats();

  return (
    <div className="profile-container">
      <Header 
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onAskClick={handleOpenAskModal}
      />

      <main className="profile-content">
        <section className={`profile-header-section ${genderClass}`}>
          <img
            src={getAvatarUrl(profileUser, genderClass)}
            alt={displayName}
            className="profile-avatar"
            onError={(e) => {
              e.currentTarget.src = getDefaultAvatar(genderClass);
            }}
          />
          <div className="profile-info">
            <div className="profile-header-actions">
              <h1 className="profile-name">{displayName}</h1>
              {isOwnProfile && (
                <button 
                  className="edit-profile-button"
                  onClick={handleEditClick}
                  title="Editar perfil"
                >
                  ✏️ Editar
                </button>
              )}
            </div>
            
            <p className="profile-bio">
              {profileUser.bio || 'Este usuário ainda não adicionou uma bio.'}
            </p>
            
            <p style={{ color: darkMode ? '#aaa' : '#666', fontSize: '14px', marginTop: '8px' }}>
              {formatJoinDate(profileUser.created_at)}
            </p>
            
            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-number">{userPosts.length}</div>
                <div className="stat-label">Perguntas</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{totalReplies}</div>
                <div className="stat-label">Respostas</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{totalLikes}</div>
                <div className="stat-label">Curtidas</div>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-questions-section">
          <h2 className="section-title">
            <span className="section-title-icon">❓</span>
            Perguntas de {displayName}
            {!isOwnProfile && (
              <span className="privacy-note" style={{ fontSize: '14px', color: '#666', marginLeft: '10px' }}>
                (apenas perguntas públicas)
              </span>
            )}
          </h2>

          {userPosts.length === 0 ? (
            <div className="no-questions">
              <div className="no-questions-icon">
                {isOwnProfile ? '🤔' : '🔒'}
              </div>
              <h3>
                {isOwnProfile 
                  ? 'Nenhuma pergunta ainda' 
                  : 'Nenhuma pergunta pública disponível'}
              </h3>
              <p>
                {isOwnProfile 
                  ? 'Você ainda não fez nenhuma pergunta na comunidade.' 
                  : `${displayName} não tem perguntas públicas ou todas são anônimas.`}
              </p>
              {isOwnProfile && (
                <button 
                  className="ask-button" 
                  onClick={handleOpenAskModal}
                  style={{ marginTop: '20px' }}
                >
                  Faça sua primeira pergunta!
                </button>
              )}
            </div>
          ) : (
            <div className="user-posts-list">
              {userPosts.map((post) => {
                const timeInfo = getTimeAgo(post.created_at);
                const replyCount = safeNumber(post.reply_count);
                const likeCount = safeNumber(post.like_count);
                
                return (
                  <div
                    key={`${post.id}-${currentTime.getMinutes()}`}
                    className={`user-post-card ${genderClass} ${post.is_anonymous ? 'anonymous-post' : ''}`}
                  >
                    <div className="post-meta">
                      <span className="post-time" title={timeInfo.fullDate}>
                        {timeInfo.text}
                      </span>
                      
                      {/* ✅ BADGE PARA PERGUNTAS ANÔNIMAS - APENAS NO TOPO */}
                      {post.is_anonymous && isOwnProfile && (
                        <span 
                          className="anonymous-badge" 
                          title="Pergunta anônima (só você pode ver no seu perfil)"
                        >
                          🎭 Anônimo
                        </span>
                      )}
                      
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
                          <span>{replyCount}</span>
                        </div>
                        <div className="stat">
                          <span>👍</span>
                          <span>{likeCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* ✅ TÍTULO DA PERGUNTA SEM O SÍMBOLO 🎭 REDUNDANTE */}
                    <h3 className="post-question-title">
                      {post.question}
                    </h3>
                    
                    {post.description && (
                      <p className="post-question-description">{post.description}</p>
                    )}

                    <div className="post-actions">
                      <div className="reply-count">
                        {replyCount} {replyCount === 1 ? 'resposta' : 'respostas'}
                      </div>
                      <button
                        className="reply-button"
                        onClick={() => handleReplyClick(post.id)}
                      >
                        <span>💬</span>
                        Ver Respostas
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {showEditModal && (
        <div className="modal-overlay">
          <div className={`edit-modal ${darkMode ? 'dark' : ''}`}>
            <div className="modal-header">
              <h2>Editar Perfil</h2>
              <button 
                className="modal-close" 
                onClick={handleCloseEditModal}
                disabled={uploading}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              {error && (
                <div className="modal-error">
                  ⚠️ {error}
                </div>
              )}
              
              <div className="avatar-upload-section">
                <div className="avatar-preview">
                  <img
                    src={avatarPreview || getAvatarUrl(profileUser, genderClass)}
                    alt="Preview"
                    className="edit-avatar-preview"
                    onError={(e) => {
                      console.error('Erro ao carregar avatar no modal:', e.currentTarget.src);
                      e.currentTarget.src = getDefaultAvatar(genderClass);
                    }}
                  />
                  {uploading && (
                    <div className="uploading-overlay">
                      <div className="uploading-spinner"></div>
                      <p>Carregando...</p>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                <button 
                  className="upload-avatar-button"
                  onClick={handleUploadClick}
                  disabled={uploading}
                >
                  📷 {uploading ? 'Carregando...' : 'Alterar Foto'}
                </button>
                <p className="upload-hint">JPEG, PNG, GIF ou WebP. Máx. 5MB</p>
              </div>
              
              <div className="name-edit-section">
                <label htmlFor="nickname">Nome de usuário (nickname)</label>
                <input
                  type="text"
                  id="nickname"
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  placeholder="Seu nome de usuário"
                  maxLength={30}
                  className="name-input"
                  disabled={uploading}
                />
                <div className="name-counter">
                  {editNickname.length}/30 caracteres
                </div>
              </div>
              
              <div className="bio-edit-section">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                  maxLength={500}
                  className="bio-textarea"
                  disabled={uploading}
                />
                <div className="bio-counter">
                  {editBio.length}/500 caracteres
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="modal-cancel" 
                onClick={handleCloseEditModal}
                disabled={uploading}
              >
                Cancelar
              </button>
              <button 
                className="modal-save"
                onClick={handleSaveChanges}
                disabled={uploading || !editNickname.trim()}
              >
                {uploading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Profile;