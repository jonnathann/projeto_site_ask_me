// src/services/api.js - ATUALIZADO PARA OAUTH2 COM UPLOAD
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

// ✅ INTERCEPTOR ATUALIZADO PARA OAUTH2 COM MULTIPART SUPPORT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // ✅ Para OAuth2: "Bearer <access_token>"
      config.headers.Authorization = `Bearer ${token}`;
      
      // Log detalhado apenas em desenvolvimento
      if (import.meta.env.DEV) {
        console.log(`🔑 Token OAuth2 adicionado: Bearer ${token.substring(0, 20)}...`);
      }
    } else if (import.meta.env.DEV) {
      console.log('🔐 Sem token - requisição não autenticada');
    }
    
    // Não adiciona Content-Type para FormData (upload de arquivos)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']; // Deixa o navegador definir
      delete config.headers['Accept'];
      
      if (import.meta.env.DEV) {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url} (FormData)`);
        // Log do que está sendo enviado no FormData
        if (config.data.entries) {
          for (let pair of config.data.entries()) {
            console.log(`   📎 ${pair[0]}:`, pair[1] instanceof File ? 
              `File(${pair[1].name}, ${pair[1].type}, ${Math.round(pair[1].size/1024)}KB)` : 
              pair[1]
            );
          }
        }
      }
    } else {
      if (import.meta.env.DEV) {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// ✅ INTERCEPTOR DE RESPOSTA MELHORADO COM TRATAMENTO DE MÍDIA
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
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
      
      // Log de uploads de mídia
      if (response.config.url.includes('/upload') || response.config.url.includes('/media')) {
        console.log('📸 Resposta de upload:', {
          hasMediaUrl: !!response.data?.media_url,
          hasUrl: !!response.data?.url,
          data: response.data
        });
      }
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
            
            // Não redireciona automaticamente se estiver em upload
            if (!window.location.pathname.includes('/login') && 
                !error.config?.url?.includes('/upload')) {
              setTimeout(() => window.location.href = '/login', 100);
            }
          }
          break;
          
        case 422:
          // Erro de validação (FastAPI comum)
          console.warn('📝 Erro de validação:', error.response.data?.detail);
          break;
          
        case 413:
          // Payload Too Large (arquivo muito grande)
          console.warn('📦 Arquivo muito grande:', error.response.data?.detail || 'Limite de tamanho excedido');
          break;
          
        case 415:
          // Unsupported Media Type
          console.warn('🎞️ Tipo de mídia não suportado:', error.response.data?.detail || 'Formato de arquivo inválido');
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

// ✅ FUNÇÕES UTILITÁRIAS PARA OAUTH2 E MÍDIA
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
        issuedAt: payload.iat ? new Date(payload.iat * 1000) : null,
        scopes: payload.scope ? payload.scope.split(' ') : []
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
  },
  
  // Upload de arquivo (genérico)
  async uploadFile(file, endpoint = '/upload/media', fieldName = 'file') {
    if (!file || !(file instanceof File)) {
      throw new Error('Arquivo inválido');
    }
    
    // Validação básica
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      throw new Error(`Arquivo muito grande. Máximo: ${Math.round(maxSize/1024/1024)}MB`);
    }
    
    // Tipos de mídia permitidos
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de arquivo não suportado: ${file.type}`);
    }
    
    const formData = new FormData();
    formData.append(fieldName, file);
    
    // Adiciona metadados opcionais
    formData.append('filename', file.name);
    formData.append('content_type', file.type);
    formData.append('size', file.size.toString());
    
    console.log(`📤 Uploading ${file.name} (${Math.round(file.size/1024)}KB) to ${endpoint}`);
    
    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          // Content-Type será automaticamente definido para multipart/form-data
        },
        timeout: 60000, // 60 segundos para uploads grandes
        onUploadProgress: (progressEvent) => {
          if (import.meta.env.DEV) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`📤 Upload progress: ${percentCompleted}%`);
          }
        }
      });
      
      console.log(`✅ Upload concluído:`, response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erro no upload:', error.response?.data || error.message);
      
      // Tratamento específico de erros de upload
      if (error.response?.status === 413) {
        throw new Error('Arquivo muito grande para o servidor');
      } else if (error.response?.status === 415) {
        throw new Error('Formato de arquivo não suportado pelo servidor');
      } else if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      
      throw new Error('Falha no upload do arquivo');
    }
  },
  
  // Processa URL de mídia para exibição
  processMediaUrl(url) {
    if (!url) return null;
    
    // Se já for URL completa
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Se for caminho relativo, adiciona base URL
    if (url.startsWith('/')) {
      return `${API_URL}${url}`;
    }
    
    // Assume que é caminho relativo sem barra inicial
    return `${API_URL}/${url}`;
  },
  
  // Detecta tipo de mídia pela URL ou tipo de arquivo
  detectMediaType(urlOrFile) {
    if (!urlOrFile) return null;
    
    let url = '';
    let mimeType = '';
    
    if (typeof urlOrFile === 'string') {
      url = urlOrFile;
    } else if (urlOrFile instanceof File) {
      mimeType = urlOrFile.type;
      url = urlOrFile.name;
    }
    
    // Por tipo MIME
    if (mimeType) {
      if (mimeType.startsWith('image/')) {
        return mimeType === 'image/gif' ? 'gif' : 'image';
      }
      if (mimeType.startsWith('video/')) {
        return 'video';
      }
    }
    
    // Por extensão do arquivo
    const extension = url.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
    
    if (imageExtensions.includes(extension || '')) {
      return extension === 'gif' ? 'gif' : 'image';
    }
    if (videoExtensions.includes(extension || '')) {
      return 'video';
    }
    
    return null; // Tipo desconhecido
  }
};

// ✅ API ESPECÍFICA PARA MÍDIA
export const mediaApi = {
  // Upload de mídia para perguntas
  async uploadQuestionMedia(file) {
    return await apiUtils.uploadFile(file, '/questions/upload', 'file');
  },
  
  // Upload de avatar
  async uploadAvatar(file, userId) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/users/${userId}/avatar`, formData);
    return response.data;
  },
  
  // Remove mídia
  async deleteMedia(mediaId) {
    const response = await api.delete(`/media/${mediaId}`);
    return response.data;
  },
  
  // Lista mídias do usuário
  async getUserMedia(userId) {
    const response = await api.get(`/users/${userId}/media`);
    return response.data;
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
    testAuth: () => apiUtils.validateToken(),
    testUpload: async (file) => {
      console.log('🧪 Testando upload...');
      try {
        const result = await apiUtils.uploadFile(file);
        console.log('✅ Upload testado com sucesso:', result);
        return result;
      } catch (error) {
        console.error('❌ Erro no teste de upload:', error);
        throw error;
      }
    },
    mediaInfo: (url) => ({
      url,
      processedUrl: apiUtils.processMediaUrl(url),
      type: apiUtils.detectMediaType(url),
      isImage: apiUtils.detectMediaType(url) === 'image',
      isVideo: apiUtils.detectMediaType(url) === 'video',
      isGif: apiUtils.detectMediaType(url) === 'gif'
    })
  };
}

export default api;