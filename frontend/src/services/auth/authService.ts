// services/auth/authService.ts
import { localDataService, User } from '../localDataService';

export interface LoginRequest {
  email: string;
  password?: string; // Não usado agora, mas mantém estrutura
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  username?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // CADASTRO
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const newUser = localDataService.addUser({
      username: userData.username || userData.email.split('@')[0],
      name: userData.name,
      email: userData.email,
      avatar: '👤', // Avatar padrão
      bio: '',
    });
    
    // Salva ID do usuário logado
    localStorage.setItem('currentUserId', newUser.id);
    
    return {
      user: newUser,
      token: 'local-token', // Token fake
    };
  },

  // LOGIN
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const users = localDataService.getUsers();
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Usuário não encontrado. Cadastre-se primeiro.');
    }
    
    // Salva ID do usuário logado
    localStorage.setItem('currentUserId', user.id);
    
    return {
      user,
      token: 'local-token',
    };
  },

  // LOGOUT
  async logout(): Promise<void> {
    localStorage.removeItem('currentUserId');
  },

  // VERIFICA SE ESTÁ AUTENTICADO
  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUserId');
  },

  // OBTÉM USUÁRIO ATUAL
  getCurrentUser(): User | null {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) return null;
    
    return localDataService.getUser(userId) || null;
  },

  // OBTÉM TOKEN (FAKE)
  getStoredToken(): string | null {
    return this.isAuthenticated() ? 'local-token' : null;
  },
};