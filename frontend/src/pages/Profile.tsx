import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './style_css/Profile.css';

interface User {
  id: number;
  name: string;
  gender: 'male' | 'female';
  bio: string;
  avatar_url?: string;
  join_date: string;
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
  const { user: currentUser, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dados mockados do usuário
  useEffect(() => {
    setTimeout(() => {
      const mockUser: User = {
        id: 1,
        name: 'Ana Silva',
        gender: 'female',
        bio: 'Apaixonada por tecnologia e sempre buscando aprender coisas novas. Adoro compartilhar conhecimento e ajudar outras pessoas.',
        avatar_url: '/images/avatar-female.png',
        join_date: '2024-01-15',
      };

      const mockPosts: UserPost[] = [
        {
          id: 1,
          question: 'Como posso melhorar minha produtividade no trabalho remoto?',
          created_at: '2025-12-13T08:30:00Z',
          reply_count: 12,
          like_count: 45,
        },
        {
          id: 2,
          question: 'Quais são as melhores práticas para estudar programação de forma eficiente?',
          created_at: '2025-11-25T14:20:00Z',
          reply_count: 8,
          like_count: 32,
        },
        {
          id: 3,
          question: 'Como manter o equilíbrio entre vida pessoal e profissional?',
          created_at: '2025-10-10T10:15:00Z',
          reply_count: 15,
          like_count: 67,
        },
        {
          id: 4,
          question: 'Dicas para apresentações em público sem nervosismo?',
          created_at: '2025-09-05T16:45:00Z',
          reply_count: 6,
          like_count: 28,
        },
      ];

      setProfileUser(mockUser);
      setEditBio(mockUser.bio);
      setUserPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, [userId]);

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
    setDarkMode(!darkMode);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option: string) => {
    setShowDropdown(false);
    
    if (option === 'feed') {
      navigate('/feed');
    } else if (option === 'logout') {
      logout();
      navigate('/login');
    }
  };

  // Abrir modal de edição
  const handleEditClick = () => {
    if (profileUser) {
      setEditBio(profileUser.bio);
      setAvatarPreview(profileUser.avatar_url || '');
      setShowEditModal(true);
    }
  };

  // Fechar modal
  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  // Salvar edições
  const handleSaveChanges = () => {
    if (profileUser) {
      // Aqui você faria a requisição para a API
      const updatedUser = {
        ...profileUser,
        bio: editBio,
        avatar_url: avatarPreview || profileUser.avatar_url
      };
      
      setProfileUser(updatedUser);
      setShowEditModal(false);
      
      // Simular requisição
      console.log('Salvando alterações:', updatedUser);
      alert('Alterações salvas com sucesso!');
    }
  };

  // Lidar com upload de avatar
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor, selecione uma imagem (JPEG, PNG, GIF ou WebP)');
        return;
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      setUploading(true);
      
      // Simular upload
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
          setUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  // Abrir seletor de arquivo
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Gerenciar modo escuro
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.style.backgroundColor = '#000';
    } else {
      document.body.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#f5f5f5';
    }
  }, [darkMode]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      year: 'numeric' 
    };
    return `Membro desde ${date.toLocaleDateString('pt-BR', options)}`;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-ask">ASK</span>
            <span className="logo-me">ME</span>
          </div>
          <div className="header-actions">
            <button className="dark-mode-button" onClick={toggleDarkMode}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        <div className="profile-content" style={{ textAlign: 'center', padding: '50px' }}>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-ask">ASK</span>
            <span className="logo-me">ME</span>
          </div>
          <button className="back-button" onClick={handleBackClick}>
            ← Voltar
          </button>
        </div>
        <div className="profile-content" style={{ textAlign: 'center', padding: '50px' }}>
          <p>Usuário não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header com Avatar */}
      <header className="profile-header">
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-ask">ASK</span>
          <span className="logo-me">ME</span>
        </div>
        
        <div className="header-actions">
          <button className="ask-button" onClick={handleAskClick}>
            Perguntar ❓
          </button>
          <button className="dark-mode-button" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          {/* Avatar com Dropdown */}
          <div className="avatar-dropdown-container" ref={dropdownRef}>
            <button 
              className="header-avatar-button"
              onClick={toggleDropdown}
            >
              <img
                src={profileUser.avatar_url || 
                     (profileUser.gender === 'male' 
                       ? '/images/avatar-male.png' 
                       : '/images/avatar-female.png')}
                alt={profileUser.name}
                className="header-avatar"
              />
            </button>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className={`dropdown-menu ${darkMode ? 'dark' : ''}`}>
                <div className="dropdown-header">
                  <img
                    src={profileUser.avatar_url || 
                         (profileUser.gender === 'male' 
                           ? '/images/avatar-male.png' 
                           : '/images/avatar-female.png')}
                    alt={profileUser.name}
                    className="dropdown-avatar"
                  />
                  <div className="dropdown-user-info">
                    <div className="dropdown-user-name">{profileUser.name}</div>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <button 
                  className="dropdown-item"
                  onClick={() => handleOptionClick('feed')}
                >
                  <span className="dropdown-icon">🏠</span>
                  <span>Feed</span>
                </button>
                
                <button 
                  className="dropdown-item logout"
                  onClick={() => handleOptionClick('logout')}
                >
                  <span className="dropdown-icon">🚪</span>
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo do Perfil */}
      <main className="profile-content">
        <section className={`profile-header-section ${profileUser.gender}`}>
          <img
            src={profileUser.avatar_url || 
                 (profileUser.gender === 'male' 
                   ? '/images/avatar-male.png' 
                   : '/images/avatar-female.png')}
            alt={profileUser.name}
            className="profile-avatar"
          />
          <div className="profile-info">
            <div className="profile-header-actions">
              <h1 className="profile-name">{profileUser.name}</h1>
              <button 
                className="edit-profile-button"
                onClick={handleEditClick}
                title="Editar perfil"
              >
                ✏️ Editar
              </button>
            </div>
            
            <p className="profile-bio">{profileUser.bio}</p>
            <p style={{ color: darkMode ? '#aaa' : '#666', fontSize: '14px' }}>
              {formatJoinDate(profileUser.join_date)}
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
            Perguntas de {profileUser.name.split(' ')[0]}
          </h2>

          {userPosts.length === 0 ? (
            <div className="no-questions">
              <div className="no-questions-icon">🤔</div>
              <h3>Nenhuma pergunta ainda</h3>
              <p>{profileUser.name.split(' ')[0]} ainda não fez nenhuma pergunta na comunidade.</p>
              <button 
                className="ask-button" 
                onClick={handleAskClick}
                style={{ marginTop: '20px' }}
              >
                Faça sua primeira pergunta!
              </button>
            </div>
          ) : (
            <div className="user-posts-list">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className={`user-post-card ${profileUser.gender}`}
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

      {/* Modal de Edição */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className={`edit-modal ${darkMode ? 'dark' : ''}`}>
            <div className="modal-header">
              <h2>Editar Perfil</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <div className="modal-content">
              {/* Upload de Avatar */}
              <div className="avatar-upload-section">
                <div className="avatar-preview">
                  <img
                    src={avatarPreview || profileUser.avatar_url || 
                         (profileUser.gender === 'male' 
                           ? '/images/avatar-male.png' 
                           : '/images/avatar-female.png')}
                    alt="Preview"
                    className="edit-avatar-preview"
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
              
              {/* Edição da Bio */}
              <div className="bio-edit-section">
                <label htmlFor="bio">Edite sua bio...</label>
                <textarea
                  id="bio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                  maxLength={500}
                  className="bio-textarea"
                />
                <div className="bio-counter">
                  {editBio.length}/500 caracteres
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="modal-cancel" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button 
                className="modal-save"
                onClick={handleSaveChanges}
                disabled={uploading}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;