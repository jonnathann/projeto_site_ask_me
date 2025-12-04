// pages/ProfilePage/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Friend, UserStats, Badge, ProfileTab } from '../../types/User';

// Dados mockados do usuário atual
const currentUser: User = {
  id: 'current-user',
  name: 'Nuon',
  email: 'nuon@askme.com',
  avatar: 'https://cdn.worldvectorlogo.com/logos/nuon.svg',
  bio: 'Desenvolvedor full-stack apaixonado por tecnologia, games e compartilhar conhecimento. Sempre disposto a ajudar a comunidade! 🚀',
  location: 'São Paulo, Brasil',
  website: 'https://github.com/nuon',
  joinedDate: '2024-01-01',
  reputation: 1245,
  questionsCount: 24,
  answersCount: 156,
  upvotesReceived: 892,
  tags: ['react', 'typescript', 'nodejs', 'games', 'backend', 'frontend'],
  isOnline: true,
  lastSeen: 'Agora mesmo'
};

// Dados mockados de estatísticas
const userStats: UserStats = {
  totalQuestions: 24,
  totalAnswers: 156,
  acceptedAnswers: 42,
  upvotesReceived: 892,
  upvotesGiven: 345,
  daysActive: 45,
  streak: 7,
  badges: [
    { id: '1', name: 'Perguntador Iniciante', description: 'Fez 10+ perguntas', icon: '❓', color: 'bg-blue-500', earnedDate: '2024-01-10' },
    { id: '2', name: 'Respondedor Ávido', description: 'Deu 50+ respostas', icon: '💬', color: 'bg-green-500', earnedDate: '2024-01-15' },
    { id: '3', name: 'Especialista em React', description: '50+ respostas em React', icon: '⚛️', color: 'bg-cyan-500', earnedDate: '2024-01-20' },
    { id: '4', name: 'Melhor Resposta', description: '10+ respostas aceitas', icon: '🏆', color: 'bg-yellow-500', earnedDate: '2024-01-25' },
    { id: '5', name: 'Contribuidor Semanal', description: 'Ativo por 4 semanas', icon: '📅', color: 'bg-purple-500', earnedDate: '2024-02-01' },
    { id: '6', name: 'Popular', description: '500+ upvotes recebidos', icon: '🔥', color: 'bg-red-500', earnedDate: '2024-02-05' },
  ]
};

// Dados mockados de amigos
const mockFriends: Friend[] = [
  {
    id: '1',
    user: {
      id: 'user2',
      name: 'MariaDev',
      email: 'maria@example.com',
      avatar: 'https://ui-avatars.com/api/?name=MariaDev&background=3B82F6&color=fff',
      bio: 'Frontend Developer | React & Vue.js',
      location: 'Rio de Janeiro, Brasil',
      website: 'https://mariadev.com',
      joinedDate: '2024-01-05',
      reputation: 876,
      questionsCount: 12,
      answersCount: 89,
      upvotesReceived: 543,
      tags: ['react', 'vue', 'javascript', 'frontend'],
      isOnline: true,
      lastSeen: 'Agora mesmo'
    },
    friendshipDate: '2024-01-10',
    mutualFriends: 8,
    commonTags: ['react', 'javascript', 'frontend']
  },
  {
    id: '2',
    user: {
      id: 'user3',
      name: 'JoãoBackend',
      email: 'joao@example.com',
      avatar: 'https://ui-avatars.com/api/?name=JoãoBackend&background=10B981&color=fff',
      bio: 'Backend Specialist | Node.js & Python',
      location: 'Porto Alegre, Brasil',
      website: 'https://joaobackend.dev',
      joinedDate: '2024-01-03',
      reputation: 987,
      questionsCount: 8,
      answersCount: 112,
      upvotesReceived: 765,
      tags: ['nodejs', 'python', 'backend', 'api'],
      isOnline: false,
      lastSeen: '2 horas atrás'
    },
    friendshipDate: '2024-01-12',
    mutualFriends: 5,
    commonTags: ['nodejs', 'backend']
  },
  {
    id: '3',
    user: {
      id: 'user4',
      name: 'AnaFullStack',
      email: 'ana@example.com',
      avatar: 'https://ui-avatars.com/api/?name=AnaFullStack&background=8B5CF6&color=fff',
      bio: 'Full Stack Developer | React & Node.js',
      location: 'Belo Horizonte, Brasil',
      website: 'https://anafullstack.com',
      joinedDate: '2024-01-08',
      reputation: 654,
      questionsCount: 15,
      answersCount: 76,
      upvotesReceived: 432,
      tags: ['react', 'nodejs', 'typescript', 'fullstack'],
      isOnline: true,
      lastSeen: 'Agora mesmo'
    },
    friendshipDate: '2024-01-15',
    mutualFriends: 12,
    commonTags: ['react', 'typescript', 'nodejs']
  },
  {
    id: '4',
    user: {
      id: 'user5',
      name: 'CarlosMobile',
      email: 'carlos@example.com',
      avatar: 'https://ui-avatars.com/api/?name=CarlosMobile&background=EF4444&color=fff',
      bio: 'Mobile Developer | React Native & Flutter',
      location: 'Curitiba, Brasil',
      website: 'https://carlosmobile.dev',
      joinedDate: '2024-01-12',
      reputation: 543,
      questionsCount: 9,
      answersCount: 67,
      upvotesReceived: 321,
      tags: ['react-native', 'flutter', 'mobile', 'ios', 'android'],
      isOnline: true,
      lastSeen: '30 minutos atrás'
    },
    friendshipDate: '2024-01-18',
    mutualFriends: 3,
    commonTags: ['react-native']
  },
  {
    id: '5',
    user: {
      id: 'user6',
      name: 'LuizaGames',
      email: 'luiza@example.com',
      avatar: 'https://ui-avatars.com/api/?name=LuizaGames&background=F59E0B&color=fff',
      bio: 'Game Developer & Tech Enthusiast',
      location: 'Florianópolis, Brasil',
      website: 'https://luizagames.com',
      joinedDate: '2024-01-06',
      reputation: 432,
      questionsCount: 18,
      answersCount: 54,
      upvotesReceived: 298,
      tags: ['games', 'unity', 'c#', 'game-dev'],
      isOnline: false,
      lastSeen: '5 horas atrás'
    },
    friendshipDate: '2024-01-20',
    mutualFriends: 6,
    commonTags: ['games']
  },
  {
    id: '6',
    user: {
      id: 'user7',
      name: 'PedroDevOps',
      email: 'pedro@example.com',
      avatar: 'https://ui-avatars.com/api/?name=PedroDevOps&background=6366F1&color=fff',
      bio: 'DevOps Engineer | AWS & Docker',
      location: 'Salvador, Brasil',
      website: 'https://pedrodevops.io',
      joinedDate: '2024-01-04',
      reputation: 765,
      questionsCount: 6,
      answersCount: 92,
      upvotesReceived: 567,
      tags: ['devops', 'aws', 'docker', 'kubernetes', 'ci-cd'],
      isOnline: true,
      lastSeen: 'Agora mesmo'
    },
    friendshipDate: '2024-01-22',
    mutualFriends: 4,
    commonTags: ['devops']
  }
];

// Dados mockados de sugestões de amigos
const suggestedFriends: User[] = [
  {
    id: 'user8',
    name: 'JuliaData',
    email: 'julia@example.com',
    avatar: 'https://ui-avatars.com/api/?name=JuliaData&background=8B5CF6&color=fff',
    bio: 'Data Scientist | Python & Machine Learning',
    location: 'Campinas, Brasil',
    website: 'https://juliadata.ai',
    joinedDate: '2024-01-09',
    reputation: 567,
    questionsCount: 11,
    answersCount: 78,
    upvotesReceived: 345,
    tags: ['python', 'machine-learning', 'data-science', 'ai'],
    isOnline: true,
    lastSeen: 'Agora mesmo'
  },
  {
    id: 'user9',
    name: 'RafaelUX',
    email: 'rafael@example.com',
    avatar: 'https://ui-avatars.com/api/?name=RafaelUX&background=EC4899&color=fff',
    bio: 'UX/UI Designer | Figma & Design Systems',
    location: 'Recife, Brasil',
    website: 'https://rafaelux.design',
    joinedDate: '2024-01-11',
    reputation: 432,
    questionsCount: 7,
    answersCount: 45,
    upvotesReceived: 234,
    tags: ['design', 'figma', 'ui', 'ux', 'web-design'],
    isOnline: false,
    lastSeen: '3 horas atrás'
  }
];

export const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(currentUser);
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [suggestions, setSuggestions] = useState<User[]>(suggestedFriends);
  const [stats, setStats] = useState<UserStats>(userStats);
  const [activeTab, setActiveTab] = useState<ProfileTab>('questions');
  const [isEditing, setIsEditing] = useState(false);
  const [friendSearch, setFriendSearch] = useState('');

  // Verificar se é perfil do usuário atual ou de outro
  const isOwnProfile = !id || id === 'current-user' || id === currentUser.id;

  // Filtrar amigos por busca
  const filteredFriends = friends.filter(friend =>
    friend.user.name.toLowerCase().includes(friendSearch.toLowerCase()) ||
    friend.user.bio.toLowerCase().includes(friendSearch.toLowerCase()) ||
    friend.user.tags.some(tag => tag.toLowerCase().includes(friendSearch.toLowerCase()))
  );

  // Manipuladores
  const handleAddFriend = (userId: string) => {
    // Simular adição de amigo
    const friendToAdd = suggestions.find(u => u.id === userId);
    if (friendToAdd) {
      const newFriend: Friend = {
        id: Date.now().toString(),
        user: friendToAdd,
        friendshipDate: new Date().toISOString().split('T')[0],
        mutualFriends: Math.floor(Math.random() * 5) + 1,
        commonTags: user.tags.filter(tag => friendToAdd.tags.includes(tag))
      };
      
      setFriends(prev => [...prev, newFriend]);
      setSuggestions(prev => prev.filter(u => u.id !== userId));
      
      // Atualizar notificação
      console.log(`Amigo ${friendToAdd.name} adicionado!`);
    }
  };

  const handleRemoveFriend = (friendId: string) => {
    const friendToRemove = friends.find(f => f.id === friendId);
    if (friendToRemove) {
      setFriends(prev => prev.filter(f => f.id !== friendId));
      setSuggestions(prev => [...prev, friendToRemove.user]);
      console.log(`Amigo ${friendToRemove.user.name} removido!`);
    }
  };

  const handleMessageFriend = (friendId: string) => {
    // Navegar para chat ou abrir modal
    console.log(`Abrir chat com amigo ${friendId}`);
    // navigate(`/messages/${friendId}`);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    setIsEditing(false);
    console.log('Perfil atualizado:', updatedUser);
  };

  // Conteúdo das abas
  const renderTabContent = () => {
    switch (activeTab) {
      case 'questions':
        return (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ❓ Minhas Perguntas ({stats.totalQuestions})
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Você fez {stats.totalQuestions} perguntas na comunidade.
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Ver todas as perguntas
              </button>
            </div>
          </div>
        );
      
      case 'answers':
        return (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💬 Minhas Respostas ({stats.totalAnswers})
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Respostas totais:</span>
                  <span className="font-semibold">{stats.totalAnswers}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Respostas aceitas:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {stats.acceptedAnswers} ✅
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Upvotes recebidos:</span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {stats.upvotesReceived} 👍
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'friends':
        return (
          <div className="space-y-6">
            {/* Barra de busca de amigos */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  👥 Meus Amigos ({friends.length})
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    value={friendSearch}
                    onChange={(e) => setFriendSearch(e.target.value)}
                    placeholder="Buscar amigos..."
                    className="w-64 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>
              </div>
              
              {/* Lista de amigos */}
              {filteredFriends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFriends.map((friend) => (
                    <div key={friend.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={friend.user.avatar}
                              alt={friend.user.name}
                              className="w-12 h-12 rounded-full"
                            />
                            {friend.user.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {friend.user.name}
                            </h4>
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                              <span>⭐ {friend.user.reputation}</span>
                              <span>•</span>
                              <span>{friend.user.isOnline ? 'Online' : `Visto ${friend.user.lastSeen}`}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleMessageFriend(friend.id)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            title="Enviar mensagem"
                          >
                            💬
                          </button>
                          {isOwnProfile && (
                            <button
                              onClick={() => handleRemoveFriend(friend.id)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              title="Remover amigo"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {friend.user.bio}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {friend.commonTags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {friend.commonTags.length > 3 && (
                          <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                            +{friend.commonTags.length - 3} mais
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Amigos desde {friend.friendshipDate}</span>
                        <span>{friend.mutualFriends} amigos em comum</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">👥</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {friendSearch ? 'Nenhum amigo encontrado' : 'Você ainda não tem amigos adicionados'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Sugestões de amigos */}
            {isOwnProfile && suggestions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🤝 Sugestões de Amigos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map((suggestedUser) => (
                    <div key={suggestedUser.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={suggestedUser.avatar}
                            alt={suggestedUser.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {suggestedUser.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ⭐ {suggestedUser.reputation} reputação
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddFriend(suggestedUser.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-sm"
                        >
                          Adicionar
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {suggestedUser.bio}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {suggestedUser.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'badges':
        return (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🏆 Minhas Conquistas ({stats.badges.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.badges.map((badge) => (
                  <div key={badge.id} className="text-center">
                    <div className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center mx-auto mb-2 text-2xl`}>
                      {badge.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {badge.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {badge.earnedDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'activity':
        return (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📊 Minha Atividade
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.daysActive}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Dias ativos
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.streak}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Sequência atual
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.upvotesGiven}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Upvotes dados
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.reputation}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Reputação total
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-fit bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho do Perfil */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-8">
          {/* Banner AZUL REMOVIDO - apenas mantemos o botão Editar Perfil */}
          
          {/* Informações do Usuário */}
          <div className="px-8 pb-8 pt-8">
            {/* Botão Editar Perfil movido para cá */}
            {isOwnProfile && (
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  ✏️ Editar Perfil
                </button>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
              {/* Avatar */}
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                />
                {user.isOnline && (
                  <div className="absolute bottom-3 right-3 w-6 h-6 bg-green-500 rounded-full border-3 border-white dark:border-gray-800"></div>
                )}
              </div>
              
              {/* Informações Principais */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </h1>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        🏆 {user.reputation} reputação
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        📅 Membro desde {user.joinedDate}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${user.isOnline ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
                        {user.isOnline ? '🟢 Online' : '⚫ Offline'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Ações */}
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    {!isOwnProfile && (
                      <>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                          👥 Adicionar Amigo
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          💬 Mensagem
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Bio */}
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {user.bio}
                </p>
                
                {/* Links */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {user.location && (
                    <span className="flex items-center">
                      📍 {user.location}
                    </span>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      🌐 {user.website.replace('https://', '')}
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            {/* Tags do Usuário */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                🏷️ Tags que segue
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/search?tags=${tag}`)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Conteúdo Principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Estatísticas */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                📊 Estatísticas
              </h2>
              
              <div className="space-y-6">
                {/* Estatísticas Gerais */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    📈 Atividade
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Perguntas</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {stats.totalQuestions}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Respostas</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {stats.totalAnswers}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Respostas aceitas</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {stats.acceptedAnswers}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Upvotes recebidos</span>
                      <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                        {stats.upvotesReceived}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Amigos */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    👥 Rede
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Amigos</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {friends.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Tags seguidas</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {user.tags.length}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Botão para ver perfil público */}
                {isOwnProfile && (
                  <button
                    onClick={() => console.log('Compartilhar perfil')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors mt-4"
                  >
                    🔗 Compartilhar Perfil
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Conteúdo Principal */}
          <div className="flex-1">
            {/* Abas de Navegação */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-6 overflow-hidden">
              <div className="flex overflow-x-auto">
                {([
                  { id: 'questions' as ProfileTab, label: '❓ Perguntas', icon: '❓' },
                  { id: 'answers' as ProfileTab, label: '💬 Respostas', icon: '💬' },
                  { id: 'friends' as ProfileTab, label: '👥 Amigos', icon: '👥' },
                  { id: 'badges' as ProfileTab, label: '🏆 Conquistas', icon: '🏆' },
                  { id: 'activity' as ProfileTab, label: '📊 Atividade', icon: '📊' }
                ]).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 md:flex-none px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Conteúdo da Aba Selecionada */}
            {renderTabContent()}
          </div>
        </div>
      </main>
      
      {/* Modal de Edição (simplificado) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ✏️ Editar Perfil
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Em desenvolvimento - funcionalidade completa em breve!
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};