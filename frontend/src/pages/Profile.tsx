// src/pages/Profile.tsx
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import Header from '../components/Header';
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
  created_at: string;
  reply_count: number;
  like_count: number;
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
  const [editNickname, setEditNickname] = useState('');
  const [editBio, setEditBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para garantir URL completa
  const ensureFullUrl = (url: string | null): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}/${url}`;
  };

  // Função para obter avatar padrão baseado no gênero
  const getDefaultAvatar = (genderClass: string): string => {
    if (genderClass === 'male') {
      return `${API_BASE_URL}/static/images/avatar-male-default.png`;
    }
    if (genderClass === 'female') {
      return `${API_BASE_URL}/static/images/avatar-female-default.png`;
    }
    return `${API_BASE_URL}/static/images/avatar-default.png`;
  };

  // Obter URL do avatar ou padrão
  const getAvatarUrl = (user: User | null, genderClass: string) => {
    if (user?.avatar_url) {
      return ensureFullUrl(user.avatar_url);
    }
    return getDefaultAvatar(genderClass);
  };

  // Buscar dados do perfil da API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        const targetUserId = userId || currentUser?.id;
        
        if (!targetUserId) {
          navigate('/login');
          return;
        }

        // 1. Buscar perfil do usuário
        const userData = await userService.getUserProfile(targetUserId);
        setProfileUser(userData);
        setEditNickname(userData.nickname || userData.name);
        setEditBio(userData.bio || '');
        
        const genderClass = getGenderClass(userData.gender);
        const avatarUrl = userData.avatar_url 
          ? ensureFullUrl(userData.avatar_url)
          : getDefaultAvatar(genderClass);
        setAvatarPreview(avatarUrl);

        // 2. Buscar posts do usuário
        try {
          const postsData = await userService.getUserPosts(targetUserId);
          setUserPosts(postsData.posts || []);
        } catch (postsError) {
          console.log('Posts não disponíveis:', postsError);
          setUserPosts([]);
        }
        
      } catch (error: any) {
        console.error('Erro ao carregar perfil:', error);
        setError('Erro ao carregar perfil. Tente novamente.');
        
        if (error.response?.status === 404) {
          setError('Usuário não encontrado.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUser || userId) {
      fetchUserProfile();
    }
  }, [userId, currentUser, navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAskClick = () => {
    if (currentUser) navigate('/perguntar');
    else navigate('/login');
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

  // Abrir modal de edição
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

  // Fechar modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setError('');
  };

  // Upload de avatar
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

  // Salvar edições (nickname e bio)
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

  // Abrir seletor de arquivo
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Modo escuro
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

  // Funções auxiliares
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
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

  // Converter gênero para classe CSS
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
          onAskClick={handleAskClick}
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
          onAskClick={handleAskClick}
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
  const isOwnProfile = !userId || userId === currentUser?.id?.toString();
  const displayName = profileUser.nickname || profileUser.name || 'Usuário';

  return (
    <div className="profile-container">
      <Header 
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onAskClick={handleAskClick}
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
                <div className="stat-number">
                  {userPosts.reduce((acc, post) => acc + post.reply_count, 0)}
                </div>
                <div className="stat-label">Respostas</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {userPosts.reduce((acc, post) => acc + post.like_count, 0)}
                </div>
                <div className="stat-label">Curtidas</div>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-questions-section">
          <h2 className="section-title">
            <span className="section-title-icon">❓</span>
            Perguntas de {displayName}
          </h2>

          {userPosts.length === 0 ? (
            <div className="no-questions">
              <div className="no-questions-icon">🤔</div>
              <h3>Nenhuma pergunta ainda</h3>
              <p>{displayName} ainda não fez nenhuma pergunta na comunidade.</p>
              {isOwnProfile && (
                <button 
                  className="ask-button" 
                  onClick={handleAskClick}
                  style={{ marginTop: '20px' }}
                >
                  Faça sua primeira pergunta!
                </button>
              )}
            </div>
          ) : (
            <div className="user-posts-list">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className={`user-post-card ${genderClass}`}
                >
                  <div className="post-meta">
                    <span className="post-date">{formatDate(post.created_at)}</span>
                    <div className="post-stats">
                      <div className="stat">
                        <span>💬</span>
                        <span>{post.reply_count}</span>
                      </div>
                      <div className="stat">
                        <span>👍</span>
                        <span>{post.like_count}</span>
                      </div>
                    </div>
                  </div>

                  <p className="post-question">{post.question}</p>

                  <div className="post-actions">
                    <div className="reply-count">
                      {post.reply_count} {post.reply_count === 1 ? 'resposta' : 'respostas'}
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
              ))}
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
                onClick={handleCloseModal}
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
                onClick={handleCloseModal}
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
    </div>
  );
}

export default Profile;