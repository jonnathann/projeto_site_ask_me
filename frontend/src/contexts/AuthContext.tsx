// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth/authService'; // ← ADICIONAR

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  reputation?: number;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ AGORA USA O authService para verificar autenticação
    if (authService.isAuthenticated()) {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Converte do tipo User do localDataService para User do contexto
        setUser({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          avatar: currentUser.avatar,
          bio: currentUser.bio,
        });
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // ✅ USA O authService REAL
    const response = await authService.login({ email, password });
    
    // Converte para o tipo do contexto
    setUser({
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      avatar: response.user.avatar,
      bio: response.user.bio,
    });
  };

  const logout = async () => {
    // ✅ USA O authService REAL
    await authService.logout();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // Aqui poderia salvar no localDataService também
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      updateUser
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};