// frontend/src/pages/User/NotificationsPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

type NotificationType = 'question_answered' | 'new_follower' | 'mention' | 'upvote' | 'badge_earned' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
  questionId?: string;
  answerId?: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

// Dados mockados para a versão beta
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'question_answered',
    title: 'Sua pergunta foi respondida!',
    message: 'MariaDev respondeu sua pergunta sobre React Hooks.',
    user: {
      id: 'user2',
      name: 'MariaDev',
      avatar: 'https://ui-avatars.com/api/?name=MariaDev&background=3B82F6&color=fff'
    },
    questionId: '123',
    timestamp: '5 minutos atrás',
    isRead: false,
    link: '/question/123'
  },
  {
    id: '2',
    type: 'upvote',
    title: 'Seu answer recebeu upvote!',
    message: 'JoãoBackend curtiu sua resposta sobre Node.js performance.',
    user: {
      id: 'user3',
      name: 'JoãoBackend',
      avatar: 'https://ui-avatars.com/api/?name=JoãoBackend&background=10B981&color=fff'
    },
    answerId: '456',
    timestamp: '1 hora atrás',
    isRead: false,
    link: '/question/789#answer-456'
  },
  {
    id: '3',
    type: 'new_follower',
    title: 'Novo seguidor!',
    message: 'AnaFullStack começou a seguir você.',
    user: {
      id: 'user4',
      name: 'AnaFullStack',
      avatar: 'https://ui-avatars.com/api/?name=AnaFullStack&background=8B5CF6&color=fff'
    },
    timestamp: '2 horas atrás',
    isRead: true
  },
  {
    id: '4',
    type: 'mention',
    title: 'Você foi mencionado',
    message: 'CarlosMobile mencionou você em uma resposta sobre React Native.',
    user: {
      id: 'user5',
      name: 'CarlosMobile',
      avatar: 'https://ui-avatars.com/api/?name=CarlosMobile&background=EF4444&color=fff'
    },
    questionId: '101',
    timestamp: 'Ontem, 14:30',
    isRead: true,
    link: '/question/101'
  },
  {
    id: '5',
    type: 'badge_earned',
    title: 'Nova conquista! 🏆',
    message: 'Você ganhou a badge "Respondedor Ávido" por dar 50+ respostas!',
    timestamp: 'Ontem, 10:15',
    isRead: true
  },
  {
    id: '6',
    type: 'system',
    title: 'Bem-vindo ao AskMe! 🎉',
    message: 'Sua conta foi criada com sucesso. Explore a comunidade e faça sua primeira pergunta!',
    timestamp: '3 dias atrás',
    isRead: true
  }
];

// Ícones para cada tipo de notificação
const notificationIcons = {
  question_answered: '💬',
  new_follower: '👥',
  mention: '📢',
  upvote: '👍',
  badge_earned: '🏆',
  system: '⚙️'
};

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar notificações
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  // Marcar notificação como lida
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Limpar todas as notificações
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Contadores
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalCount = notifications.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🔔 Notificações
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Fique por dentro de tudo que acontece na comunidade
              </p>
            </div>
            
            {/* Contadores e ações */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">{unreadCount}</span> não lidas
                <span className="mx-2">•</span>
                <span className="font-semibold">{totalCount}</span> total
              </div>
              
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    Marcar todas como lidas
                  </button>
                )}
                
                {totalCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-sm rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    Limpar todas
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Não lidas {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </div>

        {/* Lista de Notificações */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all hover:shadow-md ${
                  notification.isRead
                    ? 'border-gray-200 dark:border-gray-700'
                    : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Ícone */}
                    <div className="flex-shrink-0 text-2xl">
                      {notificationIcons[notification.type]}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-semibold ${
                          notification.isRead
                            ? 'text-gray-900 dark:text-white'
                            : 'text-blue-700 dark:text-blue-300'
                        }`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                          {notification.timestamp}
                        </span>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {notification.message}
                      </p>

                      {/* Informações adicionais */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {notification.user && (
                            <div className="flex items-center space-x-2">
                              <img
                                src={notification.user.avatar}
                                alt={notification.user.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {notification.user.name}
                              </span>
                            </div>
                          )}
                          
                          {notification.link && (
                            <Link
                              to={notification.link}
                              onClick={() => markAsRead(notification.id)}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Ver {notification.questionId ? 'pergunta' : 'resposta'}
                            </Link>
                          )}
                        </div>

                        {/* Ações */}
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              Marcar como lida
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setNotifications(prev => 
                                prev.filter(n => n.id !== notification.id)
                              );
                            }}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                            title="Remover notificação"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Estado vazio
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {filter === 'unread' 
                  ? 'Você não tem notificações não lidas no momento.' 
                  : 'Quando você tiver notificações, elas aparecerão aqui.'}
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Explorar a comunidade
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Configurações de notificação (beta básico) */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ⚙️ Configurações de notificação
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Em desenvolvimento para a versão beta completa.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Notificações por email</span>
                  <span className="text-gray-400">Em breve</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notificações push</span>
                  <span className="text-gray-400">Em breve</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};