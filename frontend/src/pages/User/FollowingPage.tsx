// frontend/src/pages/User/FollowingPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type TabType = 'following' | 'followers';
type UserStatus = 'online' | 'offline' | 'away';

interface FollowUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location?: string;
  reputation: number;
  questionsCount: number;
  answersCount: number;
  tags: string[];
  isFollowing: boolean;
  status: UserStatus;
  lastSeen: string;
  followDate: string;
  mutualFollowers: number;
  commonTags: string[];
}

// Dados mockados - Pessoas que VOCÊ segue
const mockFollowing: FollowUser[] = [
  {
    id: 'user2',
    name: 'MariaDev',
    email: 'maria@example.com',
    avatar: 'https://ui-avatars.com/api/?name=MariaDev&background=3B82F6&color=fff',
    bio: 'Frontend Developer | React & Vue.js | Criadora de conteúdo tech',
    location: 'Rio de Janeiro, Brasil',
    reputation: 876,
    questionsCount: 12,
    answersCount: 89,
    tags: ['react', 'vue', 'javascript', 'frontend', 'web'],
    isFollowing: true,
    status: 'online',
    lastSeen: 'Agora mesmo',
    followDate: '2024-01-10',
    mutualFollowers: 8,
    commonTags: ['react', 'javascript', 'frontend']
  },
  {
    id: 'user3',
    name: 'JoãoBackend',
    email: 'joao@example.com',
    avatar: 'https://ui-avatars.com/api/?name=JoãoBackend&background=10B981&color=fff',
    bio: 'Backend Specialist | Node.js & Python | Arquitetura de sistemas escaláveis',
    location: 'Porto Alegre, Brasil',
    reputation: 987,
    questionsCount: 8,
    answersCount: 112,
    tags: ['nodejs', 'python', 'backend', 'api', 'database'],
    isFollowing: true,
    status: 'away',
    lastSeen: '30 minutos atrás',
    followDate: '2024-01-12',
    mutualFollowers: 5,
    commonTags: ['nodejs', 'backend']
  },
  {
    id: 'user4',
    name: 'AnaFullStack',
    email: 'ana@example.com',
    avatar: 'https://ui-avatars.com/api/?name=AnaFullStack&background=8B5CF6&color=fff',
    bio: 'Full Stack Developer | React & Node.js | Entusiasta de open source',
    location: 'Belo Horizonte, Brasil',
    reputation: 654,
    questionsCount: 15,
    answersCount: 76,
    tags: ['react', 'nodejs', 'typescript', 'fullstack', 'aws'],
    isFollowing: true,
    status: 'online',
    lastSeen: 'Agora mesmo',
    followDate: '2024-01-15',
    mutualFollowers: 12,
    commonTags: ['react', 'typescript', 'nodejs']
  },
  {
    id: 'user5',
    name: 'CarlosMobile',
    email: 'carlos@example.com',
    avatar: 'https://ui-avatars.com/api/?name=CarlosMobile&background=EF4444&color=fff',
    bio: 'Mobile Developer | React Native & Flutter | Especialista em performance mobile',
    location: 'Curitiba, Brasil',
    reputation: 543,
    questionsCount: 9,
    answersCount: 67,
    tags: ['react-native', 'flutter', 'mobile', 'ios', 'android'],
    isFollowing: true,
    status: 'offline',
    lastSeen: '5 horas atrás',
    followDate: '2024-01-18',
    mutualFollowers: 3,
    commonTags: ['react-native']
  }
];

// Dados mockados - Pessoas que seguem VOCÊ
const mockFollowers: FollowUser[] = [
  {
    id: 'user6',
    name: 'LuizaGames',
    email: 'luiza@example.com',
    avatar: 'https://ui-avatars.com/api/?name=LuizaGames&background=F59E0B&color=fff',
    bio: 'Game Developer & Tech Enthusiast | Unity & C# | Criadora de jogos indie',
    location: 'Florianópolis, Brasil',
    reputation: 432,
    questionsCount: 18,
    answersCount: 54,
    tags: ['games', 'unity', 'c#', 'game-dev', 'design'],
    isFollowing: false,
    status: 'offline',
    lastSeen: 'Ontem',
    followDate: '2024-01-20',
    mutualFollowers: 6,
    commonTags: ['games']
  },
  {
    id: 'user7',
    name: 'PedroDevOps',
    email: 'pedro@example.com',
    avatar: 'https://ui-avatars.com/api/?name=PedroDevOps&background=6366F1&color=fff',
    bio: 'DevOps Engineer | AWS & Docker | Especialista em infraestrutura cloud',
    location: 'Salvador, Brasil',
    reputation: 765,
    questionsCount: 6,
    answersCount: 92,
    tags: ['devops', 'aws', 'docker', 'kubernetes', 'ci-cd'],
    isFollowing: false,
    status: 'online',
    lastSeen: 'Agora mesmo',
    followDate: '2024-01-22',
    mutualFollowers: 4,
    commonTags: ['devops']
  },
  {
    id: 'user8',
    name: 'JuliaData',
    email: 'julia@example.com',
    avatar: 'https://ui-avatars.com/api/?name=JuliaData&background=8B5CF6&color=fff',
    bio: 'Data Scientist | Python & Machine Learning | Analista de dados',
    location: 'Campinas, Brasil',
    reputation: 567,
    questionsCount: 11,
    answersCount: 78,
    tags: ['python', 'machine-learning', 'data-science', 'ai', 'analytics'],
    isFollowing: false,
    status: 'online',
    lastSeen: '15 minutos atrás',
    followDate: '2024-01-25',
    mutualFollowers: 2,
    commonTags: ['python']
  }
];

// Sugestões de pessoas para seguir
const suggestions: FollowUser[] = [
  {
    id: 'user9',
    name: 'RafaelUX',
    email: 'rafael@example.com',
    avatar: 'https://ui-avatars.com/api/?name=RafaelUX&background=EC4899&color=fff',
    bio: 'UX/UI Designer | Figma & Design Systems | Especialista em experiência do usuário',
    location: 'Recife, Brasil',
    reputation: 432,
    questionsCount: 7,
    answersCount: 45,
    tags: ['design', 'figma', 'ui', 'ux', 'web-design'],
    isFollowing: false,
    status: 'away',
    lastSeen: '1 hora atrás',
    followDate: '',
    mutualFollowers: 3,
    commonTags: ['design']
  },
  {
    id: 'user10',
    name: 'FernandaAI',
    email: 'fernanda@example.com',
    avatar: 'https://ui-avatars.com/api/?name=FernandaAI&background=10B981&color=fff',
    bio: 'AI Researcher | TensorFlow & PyTorch | PhD em Inteligência Artificial',
    location: 'São Paulo, Brasil',
    reputation: 789,
    questionsCount: 5,
    answersCount: 34,
    tags: ['ai', 'machine-learning', 'tensorflow', 'pytorch', 'research'],
    isFollowing: false,
    status: 'online',
    lastSeen: 'Agora mesmo',
    followDate: '',
    mutualFollowers: 1,
    commonTags: ['machine-learning']
  }
];

export const FollowingPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('following');
  const [following, setFollowing] = useState<FollowUser[]>(mockFollowing);
  const [followers, setFollowers] = useState<FollowUser[]>(mockFollowers);
  const [suggestedUsers, setSuggestedUsers] = useState<FollowUser[]>(suggestions);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Usuários atuais baseados na aba
  const currentUsers = activeTab === 'following' ? following : followers;
  
  // Filtrar usuários por busca
  const filteredUsers = currentUsers.filter(user =>
    searchQuery === '' ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Estatísticas
  const followingCount = following.length;
  const followersCount = followers.length;
  const onlineFollowing = following.filter(u => u.status === 'online').length;
  const mutualFollowersCount = followers.filter(f => f.mutualFollowers > 0).length;

  // Seguir usuário
  const followUser = (userId: string) => {
    // Se está na aba "seguidores", mover para "seguindo"
    if (activeTab === 'followers') {
      const userToFollow = followers.find(u => u.id === userId);
      if (userToFollow) {
        const updatedUser = { ...userToFollow, isFollowing: true, followDate: new Date().toISOString().split('T')[0] };
        setFollowing(prev => [...prev, updatedUser]);
        setFollowers(prev => prev.filter(u => u.id !== userId));
      }
    } 
    // Se está nas sugestões
    else {
      const userToFollow = suggestedUsers.find(u => u.id === userId);
      if (userToFollow) {
        const updatedUser = { ...userToFollow, isFollowing: true, followDate: new Date().toISOString().split('T')[0] };
        setFollowing(prev => [...prev, updatedUser]);
        setSuggestedUsers(prev => prev.filter(u => u.id !== userId));
      }
    }
  };

  // Deixar de seguir usuário
  const unfollowUser = (userId: string) => {
    if (activeTab === 'following') {
      const userToUnfollow = following.find(u => u.id === userId);
      if (userToUnfollow) {
        const updatedUser = { ...userToUnfollow, isFollowing: false };
        setFollowers(prev => [...prev, updatedUser]);
        setFollowing(prev => prev.filter(u => u.id !== userId));
      }
    }
  };

  // Remover seguidor
  const removeFollower = (userId: string) => {
    setFollowers(prev => prev.filter(u => u.id !== userId));
  };

  // Navegar para perfil do usuário
  const navigateToProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  // Status color
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  // Status text
  const getStatusText = (status: UserStatus, lastSeen: string) => {
    switch (status) {
      case 'online': return '🟢 Online';
      case 'away': return '🟡 Ausente';
      case 'offline': return `⚫ Visto ${lastSeen}`;
      default: return `⚫ ${lastSeen}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                👥 Sua Rede
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Conecte-se com outros desenvolvedores e expanda sua rede
              </p>
            </div>

            {/* Estatísticas */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {followingCount}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Seguindo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {followersCount}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Seguidores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {mutualFollowersCount}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Amigos mútuos</div>
              </div>
            </div>
          </div>

          {/* Abas e busca */}
          <div className="space-y-4">
            {/* Abas */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('following')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'following'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                👥 Seguindo ({followingCount})
              </button>
              <button
                onClick={() => setActiveTab('followers')}
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  activeTab === 'followers'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                👤 Seguidores ({followersCount})
              </button>
            </div>

            {/* Busca */}
            <div className="relative max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Buscar em ${activeTab === 'following' ? 'pessoas que você segue' : 'seus seguidores'}...`}
                className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de Usuários */}
          <div className="flex-1">
            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      {/* Avatar e Info */}
                      <div 
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => navigateToProfile(user.id)}
                      >
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                            {user.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>⭐ {user.reputation}</span>
                            <span>•</span>
                            <span>{getStatusText(user.status, user.lastSeen)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigateToProfile(user.id)}
                          className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                          title="Ver perfil"
                        >
                          👁️
                        </button>
                        {activeTab === 'following' ? (
                          <button
                            onClick={() => unfollowUser(user.id)}
                            className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-sm rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                          >
                            Deixar de seguir
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => followUser(user.id)}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                            >
                              Seguir de volta
                            </button>
                            <button
                              onClick={() => removeFollower(user.id)}
                              className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                              title="Remover seguidor"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {user.bio}
                    </p>

                    {/* Tags em comum */}
                    {user.commonTags.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Tags em comum:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {user.commonTags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Estatísticas e Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-3">
                        <span>
                          ❓ {user.questionsCount} perguntas
                        </span>
                        <span>
                          💬 {user.answersCount} respostas
                        </span>
                      </div>
                      <div className="text-right">
                        <div>
                          {activeTab === 'following' 
                            ? `Seguindo desde ${user.followDate}`
                            : `Segue você desde ${user.followDate}`}
                        </div>
                        {user.mutualFollowers > 0 && (
                          <div className="text-green-600 dark:text-green-400">
                            {user.mutualFollowers} amigos em comum
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Estado vazio
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                <div className="text-6xl mb-4">
                  {activeTab === 'following' ? '👥' : '👤'}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery 
                    ? 'Nenhum usuário encontrado'
                    : activeTab === 'following'
                      ? 'Você ainda não segue ninguém'
                      : 'Você ainda não tem seguidores'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                  {searchQuery
                    ? 'Tente buscar com outros termos ou limpar a busca.'
                    : activeTab === 'following'
                      ? 'Encontre desenvolvedores interessantes para seguir e expandir sua rede!'
                      : 'Participe da comunidade respondendo perguntas para ganhar seguidores!'}
                </p>
                <div className="space-x-4">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Limpar busca
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Explorar comunidade
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Sugestões e Estatísticas */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Sugestões para seguir */}
            {suggestedUsers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  🤝 Sugestões para seguir
                </h3>
                <div className="space-y-4">
                  {suggestedUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div 
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => navigateToProfile(user.id)}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.mutualFollowers} amigos em comum
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => followUser(user.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-xs rounded-lg font-medium transition-colors"
                      >
                        Seguir
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => console.log('Carregar mais sugestões')}
                  className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Mostrar mais sugestões
                </button>
              </div>
            )}

            {/* Estatísticas da Rede */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                📊 Estatísticas da sua rede
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total de conexões:</span>
                  <span className="font-semibold">{followingCount + followersCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Amigos online:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {onlineFollowing} online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Amigos mútuos:</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {mutualFollowersCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Taxa de reciprocidade:</span>
                  <span className="font-semibold">
                    {followersCount > 0 ? Math.round((mutualFollowersCount / followersCount) * 100) : 0}%
                  </span>
                </div>
              </div>

              {/* Dica */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">💡 Dica:</span> Interaja com a comunidade respondendo perguntas para aumentar sua rede!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};