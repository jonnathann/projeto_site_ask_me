// src/services/auth.js
import api from './api';

export const authService = {
  // LOGIN OAuth2
  async login(email, password) {
    if (!email || !password) throw new Error("Email ou senha ausentes");
    const response = await api.post('/users/login', { email, password });
    return response.data; // { access_token, token_type }
  },

  // REGISTRO
  async register(userData) {
    if (!userData || !userData.email || !userData.password || !userData.name) {
      throw new Error("Dados obrigatórios ausentes");
    }

    const response = await api.post('/users/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      nickname: userData.nickname || userData.name,
      avatar_url: userData.avatar_url || '',
      bio: userData.bio || '',
      gender: userData.gender || 'prefiro_nao_dizer'
    });

    return response.data; // usuário criado, sem token
  },

  // LOGOUT
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Retorna usuário salvo no localStorage
  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  // Verifica se usuário está logado
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token && token !== 'undefined';
  },

  // Salva token e usuário no localStorage
  setAuthData(token, user) {
    if (!token || !user) return;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Decodifica JWT
  decodeJWT(token) {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const decoded = JSON.parse(atob(payload));
      return {
        id: decoded.user_id || decoded.sub || decoded.id,
        email: decoded.email || decoded.sub,
        name: decoded.name || decoded.given_name || 'Usuário'
      };
    } catch {
      return null;
    }
  }
};
