// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔄 Carregar usuário via token ou /users/me
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Adiciona token ao header para requisição /me
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await api.get("/users/me");
        setUser(response.data);
        console.log("👤 Usuário via /me:", response.data);
      } catch (error) {
        console.error("❌ Falha ao carregar usuário:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    loadUser();
  }, []);

  // 🔐 LOGIN
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);

      if (!data.access_token) {
        return { success: false, error: "Token não recebido" };
      }

      // Salva token
      authService.setAuthData(data.access_token, { email });
      api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;

      // Busca usuário completo
      const meResponse = await api.get("/users/me");
      setUser(meResponse.data);

      return { success: true, user: meResponse.data };
    } catch (error) {
      console.error("❌ Erro no login:", error);
      return { success: false, error: error.message || "Falha no login" };
    }
  };

  // 📝 REGISTRO
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      console.log("📦 Dados retornados do registro:", data);
      return { success: true, user: data, needsLogin: true };
    } catch (error) {
      console.error("❌ Erro no registro:", error);
      return { success: false, error: error.message || "Falha no registro" };
    }
  };

  // 🚪 LOGOUT
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
