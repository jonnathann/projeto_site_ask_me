// src/services/api.js - ATUALIZADO PARA OAUTH2
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
  withCredentials: false,
});

// ✅ INTERCEPTOR ATUALIZADO PARA OAUTH2
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // ✅ Para OAuth2: "Bearer <access_token>"
      // O token já é o JWT completo que vem no campo "access_token"
      config.headers.Authorization = `Bearer ${token}`;
      
      console.log(`🔑 Token OAuth2 adicionado: Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log('🔐 Sem token - requisição não autenticada');
    }
    
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// ✅ INTERCEPTOR DE RESPOSTA MELHORADO
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    
    // Log de respostas de autenticação
    if (response.config.url.includes('/login') || response.config.url.includes('/register')) {
      console.log('🔐 Resposta de autenticação:', {
        hasAccessToken: !!response.data?.access_token,
        hasToken: !!response.data?.token,
        tokenType: response.data?.token_type,
        keys: Object.keys(response.data || {})
      });
    }
    
    return response;
  },
  (error) => {
    console.error('❌ Erro Axios:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // ✅ TRATAMENTO ESPECÍFICO PARA OAUTH2
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Não autorizado - token OAuth2 inválido/expirado
          console.warn('🔑 Token OAuth2 inválido ou expirado');
          
          // Verifica se é erro de credenciais ou token
          const errorDetail = error.response.data?.detail;
          if (errorDetail?.includes('credentials') || errorDetail?.includes('Could not validate credentials')) {
            console.log('🔐 Erro de credenciais - login necessário');
          } else {
            console.log('🔐 Token expirado - limpando dados');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            if (!window.location.pathname.includes('/login')) {
              setTimeout(() => window.location.href = '/login', 100);
            }
          }
          break;
          
        case 422:
          // Erro de validação (FastAPI comum)
          console.warn('📝 Erro de validação:', error.response.data?.detail);
          break;
          
        case 403:
          console.warn('🚫 Acesso proibido - sem permissão OAuth2');
          break;
          
        case 404:
          console.warn('🔍 Recurso não encontrado');
          break;
          
        case 500:
          console.error('💥 Erro interno do servidor');
          break;
      }
    } else if (error.request) {
      console.error('📡 Erro de rede - Backend não responde');
    } else {
      console.error('⚙️ Erro na configuração:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ✅ FUNÇÕES UTILITÁRIAS PARA OAUTH2
export const apiUtils = {
  // Testa se o token atual é válido
  async validateToken() {
    try {
      // Tenta fazer uma requisição simples que requer autenticação
      const response = await api.get('/users/me'); // ou endpoint de perfil
      return { 
        valid: true, 
        user: response.data,
        token: localStorage.getItem('token')?.substring(0, 20) + '...'
      };
    } catch (error) {
      return { 
        valid: false, 
        error: error.response?.status === 401 ? 'Token expirado' : 'Erro de validação'
      };
    }
  },
  
  // Decodifica JWT (sem verificar assinatura)
  decodeJWT(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('❌ Formato JWT inválido');
        return null;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      console.log('🔍 JWT decodificado:', {
        userId: payload.user_id || payload.sub,
        email: payload.email,
        exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'N/A',
        expTimestamp: payload.exp
      });
      
      return {
        userId: payload.user_id || payload.sub,
        email: payload.email || payload.sub,
        name: payload.name || payload.given_name,
        expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
        issuedAt: payload.iat ? new Date(payload.iat * 1000) : null
      };
    } catch (error) {
      console.error('❌ Erro ao decodificar JWT:', error);
      return null;
    }
  },
  
  // Verifica se token está expirado
  isTokenExpired(token) {
    try {
      const decoded = this.decodeJWT(token);
      if (!decoded || !decoded.expiresAt) return false;
      
      const now = new Date();
      const isExpired = decoded.expiresAt < now;
      
      if (isExpired) {
        console.warn(`⏰ Token expirou em: ${decoded.expiresAt.toLocaleString()}`);
      } else {
        console.log(`⏰ Token válido até: ${decoded.expiresAt.toLocaleString()}`);
      }
      
      return isExpired;
    } catch {
      return false;
    }
  },
  
  // Teste de conexão
  async testConnection() {
    try {
      const response = await api.get('/');
      return { 
        success: true, 
        data: response.data,
        oauth2: response.config.url.includes('8000') ? 'FastAPI OAuth2' : 'Desconhecido'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        status: error.response?.status 
      };
    }
  }
};

// ✅ Adiciona funções ao objeto global para debug
if (import.meta.env.DEV) {
  window.apiDebug = {
    getToken: () => localStorage.getItem('token'),
    getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
    clearAuth: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('🧹 Dados de autenticação limpos');
    },
    decodeToken: (token) => apiUtils.decodeJWT(token || localStorage.getItem('token')),
    testAuth: () => apiUtils.validateToken()
  };
}

export default api;