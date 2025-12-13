// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Carregar usuário via token ou /users/me
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await api.get("/users/me");
        setUser(response.data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    loadUser();
  }, []);

  // LOGIN
  const login = async (email, password) => {
    if (!email || !password) return { success: false, error: "Email ou senha ausentes" };

    try {
      const data = await authService.login(email, password);
      if (!data.access_token) return { success: false, error: "Token não recebido" };

      authService.setAuthData(data.access_token, { email });
      api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;

      const meResponse = await api.get("/users/me");
      setUser(meResponse.data);

      return { success: true, user: meResponse.data };
    } catch (error) {
      return { success: false, error: error.message || "Falha no login" };
    }
  };

  // REGISTRO
  const register = async (userData) => {
    if (!userData) return { success: false, error: "Dados do usuário ausentes" };

    // Garante valores padrão
    userData.avatar_url = userData.avatar_url || null;
    userData.gender = userData.gender || "prefiro_nao_dizer";

    try {
      const data = await authService.register(userData);
      return { success: true, user: data, needsLogin: true };
    } catch (error) {
      if (error.response && error.response.data) {
        const backendData = error.response.data;
        const fieldErrors = (backendData.detail || []).map(
          (err) => `${err.loc[1]}: ${err.msg}`
        );
        return { success: false, error: fieldErrors.join(", ") || JSON.stringify(backendData) };
      } else {
        return { success: false, error: error.message || "Falha no registro" };
      }
    }
  };

  // LOGOUT
  const logout = () => {
    authService.logout();
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para consumir o AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
