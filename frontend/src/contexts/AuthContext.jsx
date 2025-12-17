// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário via token ou /users/me
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Configurar token no header
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Buscar dados completos do usuário
        const response = await api.get("/users/me");
        const userData = response.data;
        
        // Garantir que temos os campos necessários
        if (!userData.nickname) {
          userData.nickname = userData.name || 'Usuário';
        }
        
        setUser(userData);
        
        // Salvar usuário atualizado no localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // LOGIN - ATUALIZADO
  const login = async (email, password) => {
    if (!email || !password) {
      return { 
        success: false, 
        error: "Email ou senha ausentes" 
      };
    }

    try {
      const data = await authService.login(email, password);
      
      if (!data.access_token) {
        return { 
          success: false, 
          error: "Token não recebido do servidor" 
        };
      }

      // Salvar token
      authService.setAuthData(data.access_token, { email });
      
      // Configurar header automaticamente
      api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;

      // Buscar dados completos do usuário
      const meResponse = await api.get("/users/me");
      const userData = meResponse.data;
      
      // Garantir campos necessários
      if (!userData.nickname) {
        userData.nickname = userData.name || 'Usuário';
      }
      
      setUser(userData);
      
      // Salvar usuário completo no localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      return { 
        success: true, 
        user: userData,
        token: data.access_token 
      };
      
    } catch (error) {
      console.error('Erro no login:', error);
      
      let errorMessage = "Falha no login";
      
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  // REGISTRO - ATUALIZADO
  const register = async (userData) => {
    if (!userData) {
      return { 
        success: false, 
        error: "Dados do usuário ausentes" 
      };
    }

    // Garantir valores padrão para o backend
    const registrationData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      nickname: userData.nickname || userData.name,
      gender: userData.gender || 'prefiro_nao_dizer',
      bio: userData.bio || '',
      avatar_url: null // O backend vai definir avatar padrão
    };

    try {
      const data = await authService.register(registrationData);
      
      return { 
        success: true, 
        user: data, 
        needsLogin: true 
      };
      
    } catch (error) {
      console.error('Erro no registro:', error);
      
      let errorMessage = "Falha no registro";
      
      if (error.response && error.response.data) {
        const backendData = error.response.data;
        
        if (backendData.detail) {
          // Pode ser string ou array
          if (Array.isArray(backendData.detail)) {
            const fieldErrors = backendData.detail.map(
              (err) => `${err.loc ? err.loc[1] : 'campo'}: ${err.msg}`
            );
            errorMessage = fieldErrors.join(", ");
          } else {
            errorMessage = backendData.detail;
          }
        } else if (backendData.message) {
          errorMessage = backendData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  // LOGOUT
  const logout = () => {
    authService.logout();
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  // Função para atualizar dados do usuário localmente
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const contextValue = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user && !!localStorage.getItem('token')
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para consumir o AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}