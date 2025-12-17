// src/services/userService.js
import api from './api';

export const userService = {
  // Buscar perfil de qualquer usuário por ID
  async getUserProfile(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  },

  // Buscar posts do usuário
  async getUserPosts(userId) {
    try {
      const response = await api.get(`/users/${userId}/posts`);
      return response.data;
    } catch (error) {
      console.log('Posts não disponíveis, retornando array vazio:', error);
      return { posts: [] }; // Retorna estrutura padrão
    }
  },

  // Atualizar perfil (nickname e bio)
  async updateProfile(userId, profileData) {
    try {
      const response = await api.put(`/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  // Upload de avatar
  async uploadAvatar(userId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.put(`/users/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro no upload de avatar:', error);
      throw error;
    }
  }
};