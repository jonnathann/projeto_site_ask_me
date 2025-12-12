// src/services/auth.js
import api from './api';

export const authService = {
  // LOGIN OAuth2
  async login(email, password) {
    console.log('📤 Login OAuth2:', email);
    const response = await api.post('/users/login', { email, password });
    console.log('📥 Resposta OAuth2:', response.data);
    return response.data; // { access_token, token_type }
  },

  // REGISTRO
  async register(userData) {
    console.log('📤 Registro:', userData.email);
    const response = await api.post('/users/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      nickname: userData.nickname || userData.name,
      avatar_url: userData.avatar_url || '',
      bio: userData.bio || ''
    });
    console.log('📥 Resposta do registro:', response.data);
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
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Decodifica JWT
  decodeJWT(token) {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      console.log('🔍 JWT decodificado:', decoded);
      return {
        id: decoded.user_id || decoded.sub || decoded.id,
        email: decoded.email || decoded.sub,
        name: decoded.name || decoded.given_name || 'Usuário'
      };
    } catch (error) {
      console.log('⚠️ Não foi possível decodificar JWT:', error.message);
      return null;
    }
  }
};
