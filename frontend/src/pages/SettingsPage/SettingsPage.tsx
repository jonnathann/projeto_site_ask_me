// frontend/src/pages/SettingsPage/SettingsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true,
    theme: 'system'
  });
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Carregar dados do usuário quando o componente montar
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || ''
      }));
    }
  }, [user]);

  // Manipular mudanças nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Salvar alterações do perfil
  const handleSaveProfile = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Validações básicas
      if (!formData.name.trim()) {
        throw new Error('O nome é obrigatório');
      }

      if (!formData.email.trim()) {
        throw new Error('O email é obrigatório');
      }

      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Atualizar usuário no contexto
      updateUser({
        name: formData.name,
        email: formData.email,
        bio: formData.bio
      });

      setSuccessMessage('Perfil atualizado com sucesso! ✅');
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar senha
  const handleUpdatePassword = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Validações
      if (!formData.currentPassword) {
        throw new Error('Digite sua senha atual');
      }

      if (!formData.newPassword) {
        throw new Error('Digite a nova senha');
      }

      if (formData.newPassword.length < 6) {
        throw new Error('A nova senha deve ter pelo menos 6 caracteres');
      }

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Limpar campos de senha
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setSuccessMessage('Senha atualizada com sucesso! ✅');
      
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao atualizar senha');
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar configurações de notificação
  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccessMessage('Configurações de notificação salvas! ✅');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setErrorMessage('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir conta
  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível!')) {
      console.log('Conta excluída (simulação)');
      logout();
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie suas preferências e informações da conta
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sticky top-8">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">👤</span>
                  <span>Perfil</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeTab === 'security'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">🔒</span>
                  <span>Segurança</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">🔔</span>
                  <span>Notificações</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    activeTab === 'privacy'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">👁️</span>
                  <span>Privacidade</span>
                </button>
              </nav>

              {/* Avatar e info do usuário */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1">
            {/* Mensagens de sucesso/erro */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center">
                  <span className="text-green-600 dark:text-green-400 mr-2">✅</span>
                  <p className="text-green-700 dark:text-green-300">{successMessage}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <span className="text-red-600 dark:text-red-400 mr-2">❌</span>
                  <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Tab: Perfil */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">👤 Informações do Perfil</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Conte um pouco sobre você..."
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Esta informação aparecerá no seu perfil público
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Segurança */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">🔒 Segurança da Conta</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Alterar Senha</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Senha atual
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Digite sua senha atual"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nova senha
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirmar nova senha
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Digite a senha novamente"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleUpdatePassword}
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Atualizando...' : 'Atualizar Senha'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Notificações */}
            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">🔔 Preferências de Notificação</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Email</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 dark:text-white">Respostas às minhas perguntas</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Receba notificações quando alguém responder suas perguntas</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={formData.emailNotifications}
                            onChange={handleChange}
                            className="sr-only"
                            id="email-notifications"
                          />
                          <label
                            htmlFor="email-notifications"
                            className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                              formData.emailNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                              formData.emailNotifications ? 'transform translate-x-6' : ''
                            }`}></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Notificações Push</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 dark:text-white">Mensagens diretas</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Receba notificações quando receber mensagens</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="pushNotifications"
                            checked={formData.pushNotifications}
                            onChange={handleChange}
                            className="sr-only"
                            id="push-notifications"
                          />
                          <label
                            htmlFor="push-notifications"
                            className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                              formData.pushNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                              formData.pushNotifications ? 'transform translate-x-6' : ''
                            }`}></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNotifications}
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Salvando...' : 'Salvar Configurações'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Privacidade */}
            {activeTab === 'privacy' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">👁️ Privacidade</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Configurações de Visibilidade</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 dark:text-white">Perfil público</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Permitir que outros usuários vejam seu perfil</p>
                        </div>
                        <select
                          name="theme"
                          value={formData.theme}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="system">Público</option>
                          <option value="light">Apenas amigos</option>
                          <option value="dark">Privado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4 text-red-600 dark:text-red-400">
                      Zona de Perigo
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-900 dark:text-white mb-2">Excluir minha conta</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Esta ação é irreversível. Todas as suas perguntas, respostas e dados serão permanentemente removidos.
                        </p>
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Excluir Conta Permanentemente
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};