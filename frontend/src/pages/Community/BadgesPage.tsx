// frontend/src/pages/Community/BadgesPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type BadgeType = 'gold' | 'silver' | 'bronze' | 'special';
type BadgeCategory = 'questions' | 'answers' | 'community' | 'expertise' | 'achievement';

interface Badge {
  id: string;
  name: string;
  description: string;
  type: BadgeType;
  category: BadgeCategory;
  icon: string;
  color: string;
  requirements: string[];
  earnedBy: number; // Quantos usuários têm
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockDate?: string; // Se o usuário atual tem
  progress?: number; // Progresso atual (0-100)
}

interface BadgeCategoryInfo {
  id: BadgeCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  badgeCount: number;
}

// Dados mockados - TODAS as badges do sistema
const mockBadges: Badge[] = [
  // BADGES DE OURO 🥇
  {
    id: 'gold-1',
    name: 'Mestre das Perguntas',
    description: 'Fez 100+ perguntas de alta qualidade',
    type: 'gold',
    category: 'questions',
    icon: '👑',
    color: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
    requirements: ['Fazer 100 perguntas', '80% das perguntas com respostas', 'Média de 5+ upvotes por pergunta'],
    earnedBy: 12,
    rarity: 'epic',
    points: 1000
  },
  {
    id: 'gold-2',
    name: 'Sábio Resolvedor',
    description: 'Deu 500+ respostas aceitas',
    type: 'gold',
    category: 'answers',
    icon: '💎',
    color: 'bg-gradient-to-r from-yellow-300 to-yellow-400',
    requirements: ['Dar 500 respostas', '300+ respostas aceitas', 'Média de 10+ upvotes por resposta'],
    earnedBy: 8,
    rarity: 'legendary',
    points: 1500
  },
  {
    id: 'gold-3',
    name: 'Lenda da Comunidade',
    description: 'Contribuições excepcionais por 2+ anos',
    type: 'gold',
    category: 'community',
    icon: '🏆',
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    requirements: ['Membro por 2+ anos', '5000+ reputação', 'Ajudou 1000+ usuários'],
    earnedBy: 5,
    rarity: 'legendary',
    points: 2000
  },
  
  // BADGES DE PRATA 🥈
  {
    id: 'silver-1',
    name: 'Perguntador Ávido',
    description: 'Feito 50+ perguntas',
    type: 'silver',
    category: 'questions',
    icon: '❓',
    color: 'bg-gradient-to-r from-gray-300 to-gray-400',
    requirements: ['Fazer 50 perguntas', '60% com respostas', 'Média de 3+ upvotes'],
    earnedBy: 45,
    rarity: 'rare',
    points: 500,
    unlockDate: '2024-01-20',
    progress: 85
  },
  {
    id: 'silver-2',
    name: 'Respondedor Confiável',
    description: 'Deu 100+ respostas aceitas',
    type: 'silver',
    category: 'answers',
    icon: '💬',
    color: 'bg-gradient-to-r from-gray-200 to-gray-300',
    requirements: ['Dar 100 respostas', '50+ respostas aceitas', 'Média de 5+ upvotes'],
    earnedBy: 67,
    rarity: 'rare',
    points: 600
  },
  {
    id: 'silver-3',
    name: 'Especialista em React',
    description: 'Autoridade em perguntas sobre React',
    type: 'silver',
    category: 'expertise',
    icon: '⚛️',
    color: 'bg-gradient-to-r from-blue-300 to-cyan-300',
    requirements: ['50+ respostas em React', 'Média 8+ upvotes', '25+ respostas aceitas em React'],
    earnedBy: 32,
    rarity: 'uncommon',
    points: 400,
    unlockDate: '2024-01-25',
    progress: 100
  },
  {
    id: 'silver-4',
    name: 'Guardião da Qualidade',
    description: 'Moderou conteúdo com excelência',
    type: 'silver',
    category: 'community',
    icon: '🛡️',
    color: 'bg-gradient-to-r from-green-300 to-teal-300',
    requirements: ['100+ flags úteis', '50+ revisões', 'Membro por 6+ meses'],
    earnedBy: 28,
    rarity: 'rare',
    points: 450
  },
  
  // BADGES DE BRONZE 🥉
  {
    id: 'bronze-1',
    name: 'Curioso Inicial',
    description: 'Primeiras 10 perguntas',
    type: 'bronze',
    category: 'questions',
    icon: '🧐',
    color: 'bg-gradient-to-r from-orange-700 to-orange-800',
    requirements: ['Fazer 10 perguntas', '5+ com respostas'],
    earnedBy: 256,
    rarity: 'common',
    points: 100,
    unlockDate: '2024-01-15',
    progress: 100
  },
  {
    id: 'bronze-2',
    name: 'Ajudante Iniciante',
    description: 'Primeiras 25 respostas',
    type: 'bronze',
    category: 'answers',
    icon: '🙋',
    color: 'bg-gradient-to-r from-orange-600 to-orange-700',
    requirements: ['Dar 25 respostas', '5+ respostas aceitas'],
    earnedBy: 189,
    rarity: 'common',
    points: 150,
    unlockDate: '2024-01-18',
    progress: 100
  },
  {
    id: 'bronze-3',
    name: 'Popular',
    description: 'Primeiros 100 upvotes recebidos',
    type: 'bronze',
    category: 'achievement',
    icon: '⭐',
    color: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
    requirements: ['Receber 100 upvotes', 'Em perguntas ou respostas'],
    earnedBy: 143,
    rarity: 'common',
    points: 200,
    unlockDate: '2024-01-22',
    progress: 100
  },
  {
    id: 'bronze-4',
    name: 'Veterano de 1 Mês',
    description: 'Membro ativo por 1 mês',
    type: 'bronze',
    category: 'community',
    icon: '📅',
    color: 'bg-gradient-to-r from-purple-600 to-purple-700',
    requirements: ['Membro por 30 dias', 'Ativo em 20+ dias'],
    earnedBy: 321,
    rarity: 'common',
    points: 50
  },
  
  // BADGES ESPECIAIS ✨
  {
    id: 'special-1',
    name: 'Melhor Resposta do Ano',
    description: 'Resposta mais votada do ano',
    type: 'special',
    category: 'achievement',
    icon: '🚀',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    requirements: ['Resposta com 1000+ upvotes', 'Escolhida como destaque anual'],
    earnedBy: 1,
    rarity: 'legendary',
    points: 3000
  },
  {
    id: 'special-2',
    name: 'Bug Hunter',
    description: 'Encontrou e reportou bugs críticos',
    type: 'special',
    category: 'community',
    icon: '🐛',
    color: 'bg-gradient-to-r from-green-500 to-emerald-500',
    requirements: ['Reportar 5+ bugs', '3+ bugs críticos resolvidos'],
    earnedBy: 7,
    rarity: 'epic',
    points: 800
  },
  {
    id: 'special-3',
    name: 'Contribuidor Open Source',
    description: 'Contribuiu para o código do AskMe',
    type: 'special',
    category: 'community',
    icon: '💻',
    color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    requirements: ['Pull request aceito', 'Contribuição significativa'],
    earnedBy: 3,
    rarity: 'epic',
    points: 1200
  },
  {
    id: 'special-4',
    name: 'Mentor do Mês',
    description: 'Melhor mentor do mês',
    type: 'special',
    category: 'community',
    icon: '👨‍🏫',
    color: 'bg-gradient-to-r from-red-500 to-orange-500',
    requirements: ['Escolhido pela comunidade', '50+ ajudas no mês', 'Avaliação 5 estrelas'],
    earnedBy: 12,
    rarity: 'rare',
    points: 700
  }
];

// Categorias de badges
const badgeCategories: BadgeCategoryInfo[] = [
  {
    id: 'questions',
    name: 'Perguntas',
    description: 'Conquistas por fazer perguntas',
    icon: '❓',
    color: 'bg-blue-100 dark:bg-blue-900',
    badgeCount: 3
  },
  {
    id: 'answers',
    name: 'Respostas',
    description: 'Conquistas por responder',
    icon: '💬',
    color: 'bg-green-100 dark:bg-green-900',
    badgeCount: 3
  },
  {
    id: 'expertise',
    name: 'Especialização',
    description: 'Domínio em tecnologias',
    icon: '⚡',
    color: 'bg-purple-100 dark:bg-purple-900',
    badgeCount: 1
  },
  {
    id: 'community',
    name: 'Comunidade',
    description: 'Contribuições para a comunidade',
    icon: '👥',
    color: 'bg-yellow-100 dark:bg-yellow-900',
    badgeCount: 4
  },
  {
    id: 'achievement',
    name: 'Conquistas',
    description: 'Marcos e reconhecimentos',
    icon: '🏆',
    color: 'bg-red-100 dark:bg-red-900',
    badgeCount: 2
  }
];

export const BadgesPage = () => {
  const [badges] = useState<Badge[]>(mockBadges);
  const [selectedType, setSelectedType] = useState<BadgeType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rarity' | 'points' | 'name' | 'earned'>('rarity');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filtrar badges
  const filteredBadges = badges.filter(badge => {
    const matchesType = selectedType === 'all' || badge.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.requirements.some(req => req.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesCategory && matchesSearch;
  });

  // Ordenar badges
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    switch (sortBy) {
      case 'points':
        return b.points - a.points;
      case 'earned':
        return b.earnedBy - a.earnedBy;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rarity':
      default:
        const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    }
  });

  // Estatísticas
  const totalBadges = badges.length;
  const earnedBadges = badges.filter(b => b.unlockDate).length;
  const goldBadges = badges.filter(b => b.type === 'gold').length;
  const totalPoints = badges.filter(b => b.unlockDate).reduce((sum, b) => sum + b.points, 0);

  // Usuários com mais badges (mock)
  const topUsers = [
    { id: 'user1', name: 'Nuon', badges: 8, points: 2150 },
    { id: 'user3', name: 'JoãoBackend', badges: 7, points: 1800 },
    { id: 'user2', name: 'MariaDev', badges: 6, points: 1500 },
    { id: 'user10', name: 'FernandaAI', badges: 5, points: 1200 },
    { id: 'user7', name: 'PedroDevOps', badges: 4, points: 900 }
  ];

  // Rarity color
  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-600 dark:text-purple-400';
      case 'epic': return 'text-pink-600 dark:text-pink-400';
      case 'rare': return 'text-blue-600 dark:text-blue-400';
      case 'uncommon': return 'text-green-600 dark:text-green-400';
      case 'common': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600';
    }
  };

  // Type label
  const getTypeLabel = (type: BadgeType) => {
    switch (type) {
      case 'gold': return '🥇 Ouro';
      case 'silver': return '🥈 Prata';
      case 'bronze': return '🥉 Bronze';
      case 'special': return '✨ Especial';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🏆 Hall da Fama
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Conquiste badges por contribuir com a comunidade. Cada badge conta uma história de aprendizado e colaboração.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {totalBadges}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Badges Disponíveis</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {earnedBadges}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Seus Badges</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-300">
              {goldBadges}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Badges de Ouro</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {totalPoints}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Pontos Totais</div>
          </div>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="space-y-4">
            {/* Barra de busca */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar badges por nome, descrição ou requisitos..."
                className="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
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

            {/* Filtros */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Tipo */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedType === 'all'
                      ? 'bg-blue-600 dark:bg-blue-700 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Todos
                </button>
                {(['gold', 'silver', 'bronze', 'special'] as BadgeType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedType === type
                        ? type === 'gold' ? 'bg-yellow-600 dark:bg-yellow-700 text-white' :
                          type === 'silver' ? 'bg-gray-600 dark:bg-gray-700 text-white' :
                          type === 'bronze' ? 'bg-orange-600 dark:bg-orange-700 text-white' :
                          'bg-purple-600 dark:bg-purple-700 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {getTypeLabel(type)}
                  </button>
                ))}
              </div>

              {/* Ordenação */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
                <option value="rarity">Mais raras primeiro</option>
                <option value="points">Mais pontos</option>
                <option value="earned">Mais conquistadas</option>
                <option value="name">Ordem A-Z</option>
              </select>
            </div>

            {/* Categorias */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Categorias:
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 dark:bg-blue-700 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Todas
                </button>
                {badgeCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
                      selectedCategory === category.id
                        ? `${category.color.replace('100', '600').replace('900', '700')} text-white`
                        : `${category.color} text-gray-700 dark:text-gray-300 hover:opacity-80`
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-xs opacity-75">({category.badgeCount})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de Badges */}
          <div className="flex-1">
            {sortedBadges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedBadges.map(badge => (
                  <div
                    key={badge.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all hover:shadow-lg ${
                      badge.unlockDate
                        ? 'border-yellow-300 dark:border-yellow-700'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="p-6">
                      {/* Cabeçalho do Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-16 h-16 ${badge.color} rounded-xl flex items-center justify-center text-3xl`}>
                            {badge.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                              {badge.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs font-semibold ${getRarityColor(badge.rarity)}`}>
                                {badge.rarity.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                • {getTypeLabel(badge.type)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {badge.points}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">pontos</div>
                        </div>
                      </div>

                      {/* Descrição */}
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {badge.description}
                      </p>

                      {/* Progresso (se desbloqueado ou em progresso) */}
                      {(badge.unlockDate || badge.progress) && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>
                              {badge.unlockDate ? `🏆 Conquistado em ${badge.unlockDate}` : 'Progresso'}
                            </span>
                            {badge.progress && (
                              <span>{badge.progress}%</span>
                            )}
                          </div>
                          {badge.progress && (
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${badge.progress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Requisitos */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          📋 Requisitos:
                        </h4>
                        <ul className="space-y-1">
                          {badge.requirements.map((req, index) => (
                            <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                              <span className="mr-2">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div>
                          <span className="font-semibold">{badge.earnedBy}</span> usuários têm
                        </div>
                        <div className={`px-2 py-1 rounded-full ${badge.unlockDate ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
                          {badge.unlockDate ? 'Conquistado 🎉' : 'Não conquistado'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Estado vazio
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhuma badge encontrada
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Tente ajustar seus filtros ou termos de busca.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Ranking e Info */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Ranking de Usuários */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                🏅 Ranking de Badges
              </h3>
              <div className="space-y-3">
                {topUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        index === 0 ? 'bg-yellow-100 dark:bg-yellow-900' :
                        index === 1 ? 'bg-gray-100 dark:bg-gray-700' :
                        index === 2 ? 'bg-orange-100 dark:bg-orange-900' :
                        'bg-gray-50 dark:bg-gray-600'
                      }`}>
                        <span className={`font-bold ${
                          index === 0 ? 'text-yellow-600 dark:text-yellow-400' :
                          index === 1 ? 'text-gray-600 dark:text-gray-400' :
                          index === 2 ? 'text-orange-600 dark:text-orange-400' :
                          'text-gray-500 dark:text-gray-300'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.badges} badges
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {user.points}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        pontos
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/users')}
                className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ver ranking completo →
              </button>
            </div>

            {/* Dicas para Ganhar Badges */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                💡 Como ganhar badges?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 flex-shrink-0">
                    ❓
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Faça perguntas claras e bem detalhadas
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 flex-shrink-0">
                    💬
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Responda perguntas com qualidade e detalhes
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 flex-shrink-0">
                    ⭐
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vote em perguntas e respostas úteis
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-300 flex-shrink-0">
                    🏷️
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Especialize-se em tecnologias específicas
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/')}
                className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Começar a contribuir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};