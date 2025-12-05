// frontend/src/pages/Community/UsersPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type UserStatus = 'online' | 'offline' | 'away';
type SortOption = 'reputation' | 'recent' | 'questions' | 'answers' | 'name';

interface CommunityUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  reputation: number;
  questionsCount: number;
  answersCount: number;
  acceptedAnswers: number;
  upvotesReceived: number;
  tags: string[];
  isFollowing: boolean;
  status: UserStatus;
  lastSeen: string;
  joinedDate: string;
  isVerified: boolean;
  badges: string[];
}

// Dados mockados - TODOS os usuários da comunidade
const mockCommunityUsers: CommunityUser[] = [
  {
    id: 'user1',
    name: 'Nuon',
    email: 'nuon@askme.com',
    avatar: 'https://cdn.worldvectorlogo.com/logos/nuon.svg',
    bio: 'Desenvolvedor full-stack apaixonado por tecnologia, games e compartilhar conhecimento.',
    location: 'São Paulo, Brasil',
    reputation: 1245,
    questionsCount: 24,
    answersCount: 156,
    acceptedAnswers: 42,
    upvotesReceived: 892,
    tags: ['react', 'typescript', 'nodejs', 'games', 'backend', 'frontend'],
    isFollowing: true,
    status: 'online',
    lastSeen: 'Agora mesmo',
    joinedDate: '2024-01-01',
    isVerified: true,
    badges: ['gold', 'silver', 'contributor']
  },
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
    acceptedAnswers: 23,
    upvotesReceived: 543,
    tags: ['react', 'vue', 'javascript', 'frontend', 'web'],
    isFollowing: true,
    status: 'online',
    lastSeen: 'Agora mesmo',
    joinedDate: '2024-01-05',
    isVerified: true,
    badges: ['gold', 'expert']
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
    acceptedAnswers: 45,
    upvotesReceived: 765,
    tags: ['nodejs', 'python', 'backend', 'api', 'database'],
    isFollowing: true,
    status: 'away',
    lastSeen: '30 minutos atrás',
    joinedDate: '2024-01-03',
    isVerified: true,
    badges: ['platinum', 'expert']
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
    acceptedAnswers: 28,
    upvotesReceived: 432,
    tags: ['react', 'nodejs', 'typescript', 'fullstack', 'aws'],
    isFollowing: true,
    status: 'online',
    lastSeen: 'Agora mesmo',
    joinedDate: '2024-01-08',
    isVerified: false,
    badges: ['silver', 'contributor']
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
    acceptedAnswers: 19,
    upvotesReceived: 321,
    tags: ['react-native', 'flutter', 'mobile', 'ios', 'android'],
    isFollowing: true,
    status: 'offline',
    lastSeen: '5 horas atrás',
    joinedDate: '2024-01-12',
    isVerified: false,
    badges: ['bronze']
  },
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
    acceptedAnswers: 12,
    upvotesReceived: 298,
    tags: ['games', 'unity', 'c#', 'game-dev', 'design'],
    isFollowing: false,
    status: 'offline',
    lastSeen: 'Ontem',
    joinedDate: '2024-01-06',
    isVerified: false,
    badges: ['bronze']
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
    acceptedAnswers: 34,
    upvotesReceived: 567,
    tags: ['devops', 'aws', 'docker', 'kubernetes', 'ci-cd'],
    isFollowing: false,
    status: 'online',
    lastSeen: 'Agora mesmo',
    joinedDate: '2024-01-04',
    isVerified: true,
    badges: ['gold', 'expert']
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
    acceptedAnswers: 21,
    upvotesReceived: 345,
    tags: ['python', 'machine-learning', 'data-science', 'ai', 'analytics'],
    isFollowing: false,
    status: 'online',
    lastSeen: '15 minutos atrás',
    joinedDate: '2024-01-09',
    isVerified: false,
    badges: ['silver']
  },
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
    acceptedAnswers: 8,
    upvotesReceived: 234,
    tags: ['design', 'figma', 'ui', 'ux', 'web-design'],
    isFollowing: false,
    status: 'away',
    lastSeen: '1 hora atrás',
    joinedDate: '2024-01-11',
    isVerified: false,
    badges: []
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
    acceptedAnswers: 15,
    upvotesReceived: 456,
    tags: ['ai', 'machine-learning', 'tensorflow', 'pytorch', 'research'],
    isFollowing: false,
    status: 'online',
    lastSeen: 'Agora mesmo',
    joinedDate: '2024-01-07',
    isVerified: true,
    badges: ['platinum', 'expert']
  },
  {
    id: 'user11',
    name: 'MarcosSecurity',
    email: 'marcos@example.com',
    avatar: 'https://ui-avatars.com/api/?name=MarcosSecurity&background=000000&color=fff',
    bio: 'Security Engineer | Ethical Hacking | Especialista em segurança da informação',
    location: 'Brasília, Brasil',
    reputation: 654,
    questionsCount: 9,
    answersCount: 56,
    acceptedAnswers: 22,
    upvotesReceived: 389,
    tags: ['security', 'cybersecurity', 'ethical-hacking', 'pentest', 'infosec'],
    isFollowing: false,
    status: 'offline',
    lastSeen: '2 dias atrás',
    joinedDate: '2024-01-10',
    isVerified: true,
    badges: ['gold']
  },
  {
    id: 'user12',
    name: 'CamilaCloud',
    email: 'camila@example.com',
    avatar: 'https://ui-avatars.com/api/?name=CamilaCloud&background=3B82F6&color=fff',
    bio: 'Cloud Architect | AWS & Azure | Especialista em soluções cloud',
    location: 'Joinville, Brasil',
    reputation: 723,
    questionsCount: 7,
    answersCount: 68,
    acceptedAnswers: 27,
    upvotesReceived: 512,
    tags: ['cloud', 'aws', 'azure', 'devops', 'architecture'],
    isFollowing: false,
    status: 'online',
    lastSeen: 'Agora mesmo',
    joinedDate: '2024-01-13',
    isVerified: true,
    badges: ['platinum']
  }
];

// Opções de filtro
const tagOptions = ['react', 'nodejs', 'python', 'javascript', 'typescript', 'frontend', 'backend', 'mobile', 'devops', 'design', 'ai', 'security', 'cloud', 'games'];
const locationOptions = ['São Paulo', 'Rio de Janeiro', 'Porto Alegre', 'Belo Horizonte', 'Curitiba', 'Florianópolis', 'Salvador', 'Campinas', 'Recife', 'Brasília', 'Joinville'];

export const UsersPage = () => {
  const [users, setUsers] = useState<CommunityUser[]>(mockCommunityUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('reputation');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'following'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    // Filtro de busca
    const matchesSearch = searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filtro de tags
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => user.tags.includes(tag));

    // Filtro de localização
    const matchesLocation = selectedLocation === '' ||
      user.location.includes(selectedLocation);

    // Filtro de status
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'online' && user.status === 'online') ||
      (statusFilter === 'following' && user.isFollowing);

    return matchesSearch && matchesTags && matchesLocation && matchesStatus;
  });

  // Ordenar usuários
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'reputation':
        return b.reputation - a.reputation;
      case 'questions':
        return b.questionsCount - a.questionsCount;
      case 'answers':
        return b.answersCount - a.answersCount;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'recent':
      default:
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
    }
  });

  // Seguir/deixar de seguir
  const toggleFollow = (userId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, isFollowing: !user.isFollowing }
        : user
    ));
  };

  // Estatísticas
  const totalUsers = users.length;
  const onlineUsers = users.filter(u => u.status === 'online').length;
  const verifiedUsers = users.filter(u => u.isVerified).length;
  const followingCount = users.filter(u => u.isFollowing).length;

  // Status color
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  // Badge color
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'platinum': return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
      case 'silver': return 'bg-gradient-to-r from-gray-200 to-gray-300';
      case 'bronze': return 'bg-gradient-to-r from-orange-700 to-orange-800';
      case 'expert': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'contributor': return 'bg-gradient-to-r from-green-500 to-green-600';
      default: return 'bg-gray-200';
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
                👥 Explorar Usuários
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Conheça a comunidade de desenvolvedores ({totalUsers} membros)
              </p>
            </div>

            {/* Estatísticas */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {onlineUsers}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Online agora</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {verifiedUsers}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Verificados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {followingCount}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Seguindo</div>
              </div>
            </div>
          </div>

          {/* Busca e Filtros */}
          <div className="space-y-4">
            {/* Barra de busca */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar usuários por nome, bio ou tags..."
                className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Controles */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Botões de filtro rápido */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-blue-600 dark:bg-blue-700 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFilter('online')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === 'online'
                      ? 'bg-green-600 dark:bg-green-700 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  🟢 Online
                </button>
                <button
                  onClick={() => setStatusFilter('following')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === 'following'
                      ? 'bg-purple-600 dark:bg-purple-700 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  👥 Seguindo
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {showFilters ? '▲' : '▼'} Filtros avançados
                </button>
              </div>

              {/* Ordenação */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
                <option value="reputation">Maior reputação</option>
                <option value="recent">Mais recentes</option>
                <option value="questions">Mais perguntas</option>
                <option value="answers">Mais respostas</option>
                <option value="name">Ordem A-Z</option>
              </select>
            </div>

            {/* Filtros avançados */}
            {showFilters && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tags */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      🏷️ Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tagOptions.map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          )}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-blue-600 dark:bg-blue-700 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <button
                        onClick={() => setSelectedTags([])}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Limpar tags selecionadas
                      </button>
                    )}
                  </div>

                  {/* Localização */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      📍 Localização
                    </h3>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    >
                      <option value="">Todas as localizações</option>
                      {locationOptions.map(location => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Usuários */}
        <div>
          {sortedUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedUsers.map(user => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="flex items-center space-x-3 cursor-pointer"
                      onClick={() => navigate(`/profile/${user.id}`)}
                    >
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-600"
                        />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                            {user.name}
                          </h3>
                          {user.isVerified && (
                            <span className="text-blue-500" title="Usuário verificado">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>⭐ {user.reputation}</span>
                          <span>•</span>
                          <span>{user.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botão Seguir */}
                    <button
                      onClick={() => toggleFollow(user.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        user.isFollowing
                          ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                      }`}
                    >
                      {user.isFollowing ? 'Deixar de seguir' : 'Seguir'}
                    </button>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {user.bio}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {user.tags.slice(0, 4).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {user.tags.length > 4 && (
                      <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                        +{user.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Estatísticas */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {user.questionsCount}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Perguntas
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {user.answersCount}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Respostas
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {user.acceptedAnswers}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Aceitas
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                        {user.upvotesReceived}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Upvotes
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <span>Membro desde {user.joinedDate}</span>
                    </div>
                    <div className="flex space-x-1">
                      {user.badges.slice(0, 2).map(badge => (
                        <span
                          key={badge}
                          className={`w-2 h-2 ${getBadgeColor(badge)} rounded-full`}
                          title={badge.charAt(0).toUpperCase() + badge.slice(1)}
                        ></span>
                      ))}
                      {user.badges.length > 2 && (
                        <span className="text-xs">+{user.badges.length - 2}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Estado vazio
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum usuário encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                Tente ajustar seus filtros ou termos de busca para encontrar membros da comunidade.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTags([]);
                    setSelectedLocation('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Limpar todos os filtros
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Voltar para o feed
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Paginação (mock) */}
        {sortedUsers.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                ← Anterior
              </button>
              <button className="px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                2
              </button>
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                3
              </button>
              <span className="px-2 text-gray-500">...</span>
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                10
              </button>
              <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};