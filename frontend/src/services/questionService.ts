// src/services/questionService.ts
import api from './api';

export interface QuestionData {
  title: string;
  description: string;
  category: string;
  media_url?: string;  // AGORA É APENAS UM LINK (string)
  is_anonymous: boolean;
}

export interface QuestionResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  media_url?: string;
  media_type?: string; // "image", "video", "gif" ou "other" - VEM DO BACKEND
  is_anonymous: boolean;
  user_id: number;
  author_name: string;  // "Anônimo" ou nome real
  created_at: string;
  reply_count: number;
  like_count: number;
  reactions?: Record<string, number>;  // Reações do backend
  user_reaction?: string;  // Reação do usuário atual
}

export const questionService = {
  // ✅ Postar uma pergunta (APENAS ENVIA O LINK, NÃO FAZ UPLOAD)
  async postQuestion(data: QuestionData): Promise<QuestionResponse> {
    const response = await api.post('/questions', data);
    return response.data;
  },

  // ❌ REMOVIDO: uploadMedia - não é mais necessário
  // async uploadMedia(file: File): Promise<{ media_url: string }> { ... }

  // Buscar perguntas do feed
  async getFeed(page = 1, limit = 20): Promise<{ questions: QuestionResponse[]; total: number }> {
    const response = await api.get('/questions', {
      params: { page, limit }
    });
    return response.data;
  },

  // Buscar perguntas de um usuário
  async getUserQuestions(userId: number): Promise<{ questions: QuestionResponse[] }> {
    const response = await api.get(`/users/${userId}/questions`);
    return response.data;
  },

  // ✅ VALIDAÇÃO DE URL (opcional)
  isValidMediaUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};