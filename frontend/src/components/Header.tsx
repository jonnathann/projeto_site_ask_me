// src/components/Header.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onAskClick: () => void;
}

function Header({ darkMode, onToggleDarkMode, onAskClick }: HeaderProps) {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option: string) => {
    setShowDropdown(false);
    
    if (option === 'feed') {
      navigate('/feed');
    } else if (option === 'profile') {
      // CORREÇÃO: Navegar para /profile sem ID
      navigate('/profile');
    } else if (option === 'logout') {
      logout();
      navigate('/login');
    }
  };

  // Funções auxiliares
  const getGenderClass = (gender: string): string => {
    const genderMap: Record<string, string> = {
      'masculino': 'male',
      'feminino': 'female',
      'outro': 'other',
      'prefiro_nao_dizer': 'other'
    };
    return genderMap[gender?.toLowerCase()] || 'other';
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

  const ensureFullUrl = (url: string | null): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}/${url}`;
  };

  const getAvatarUrl = (user: any, genderClass: string) => {
    if (user?.avatar_url) {
      return ensureFullUrl(user.avatar_url);
    }
    return getDefaultAvatar(genderClass);
  };

  if (!currentUser) {
    // Se não estiver logado, mostrar header simplificado
    return (
      <header className="profile-header">
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-ask">ASK</span>
          <span className="logo-me">ME</span>
        </div>
        
        <div className="header-actions">
          <button className="ask-button" onClick={() => navigate('/login')}>
            Perguntar ❓
          </button>
          <button className="dark-mode-button" onClick={onToggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button 
            className="login-button"
            onClick={() => navigate('/login')}
          >
            Entrar
          </button>
        </div>
      </header>
    );
  }

  const genderClass = getGenderClass(currentUser.gender);
  const displayName = currentUser.nickname || currentUser.name || 'Usuário';

  return (
    <header className="profile-header">
      <div className="logo" onClick={() => navigate('/')}>
        <span className="logo-ask">ASK</span>
        <span className="logo-me">ME</span>
      </div>
      
      <div className="header-actions">
        <button className="ask-button" onClick={onAskClick}>
          Perguntar ❓
        </button>
        <button className="dark-mode-button" onClick={onToggleDarkMode}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        
        {/* Avatar com Dropdown */}
        <div className="avatar-dropdown-container" ref={dropdownRef}>
          <button 
            className="header-avatar-button"
            onClick={toggleDropdown}
          >
            <img
              src={getAvatarUrl(currentUser, genderClass)}
              alt={displayName}
              className="header-avatar"
              onError={(e) => {
                e.currentTarget.src = getDefaultAvatar(genderClass);
              }}
            />
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className={`dropdown-menu ${darkMode ? 'dark' : ''}`}>
              <div className="dropdown-header">
                <img
                  src={getAvatarUrl(currentUser, genderClass)}
                  alt={displayName}
                  className="dropdown-avatar"
                />
                <div className="dropdown-user-info">
                  <div className="dropdown-user-name">{displayName}</div>
                  <div className="dropdown-user-email">{currentUser.email || ''}</div>
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
                className="dropdown-item"
                onClick={() => handleOptionClick('profile')}
              >
                <span className="dropdown-icon">👤</span>
                <span>Meu Perfil</span>
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
  );
}

export default Header;