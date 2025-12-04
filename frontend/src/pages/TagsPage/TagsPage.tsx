// pages/TagsPage/TagsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, TagSort } from '../../types/Tag';

// Dados mockados de tags
const mockTags: Tag[] = [
  {
    id: '1',
    name: 'react',
    description: 'Biblioteca JavaScript para construção de interfaces de usuário',
    questionCount: 1245,
    followers: 892,
    isFollowing: true,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    icon: '⚛️',
    lastActivity: '2024-01-15',
    createdAt: '2023-03-10'
  },
  {
    id: '2',
    name: 'typescript',
    description: 'Superset de JavaScript com tipagem estática',
    questionCount: 892,
    followers: 567,
    isFollowing: false,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    icon: '📘',
    lastActivity: '2024-01-14',
    createdAt: '2023-04-22'
  },
  {
    id: '3',
    name: 'javascript',
    description: 'Linguagem de programação para web development',
    questionCount: 2345,
    followers: 1456,
    isFollowing: true,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    icon: '🟨',
    lastActivity: '2024-01-15',
    createdAt: '2023-01-15'
  },
  {
    id: '4',
    name: 'nodejs',
    description: 'Runtime JavaScript no lado do servidor',
    questionCount: 567,
    followers: 345,
    isFollowing: false,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    icon: '🟢',
    lastActivity: '2024-01-13',
    createdAt: '2023-05-30'
  },
  {
    id: '5',
    name: 'nextjs',
    description: 'Framework React para produção com renderização server-side',
    questionCount: 432,
    followers: 278,
    isFollowing: true,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    icon: '⚡',
    lastActivity: '2024-01-14',
    createdAt: '2023-06-12'
  },
  {
    id: '6',
    name: 'tailwind',
    description: 'Framework CSS utility-first',
    questionCount: 789,
    followers: 456,
    isFollowing: false,
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    icon: '🎨',
    lastActivity: '2024-01-12',
    createdAt: '2023-07-18'
  },
  {
    id: '7',
    name: 'web',
    description: 'Desenvolvimento web em geral',
    questionCount: 1123,
    followers: 678,
    isFollowing: false,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    icon: '🌐',
    lastActivity: '2024-01-15',
    createdAt: '2023-02-14'
  },
  {
    id: '8',
    name: 'mobile',
    description: 'Desenvolvimento para dispositivos móveis',
    questionCount: 456,
    followers: 234,
    isFollowing: false,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    icon: '📱',
    lastActivity: '2024-01-11',
    createdAt: '2023-08-05'
  },
  {
    id: '9',
    name: 'games',
    description: 'Jogos, desenvolvimento de games e consoles',
    questionCount: 678,
    followers: 345,
    isFollowing: true,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    icon: '🎮',
    lastActivity: '2024-01-15',
    createdAt: '2023-09-20'
  },
  {
    id: '10',
    name: 'estudos',
    description: 'Dúvidas sobre estudos, carreira e aprendizado',
    questionCount: 345,
    followers: 189,
    isFollowing: false,
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    icon: '📚',
    lastActivity: '2024-01-10',
    createdAt: '2023-10-15'
  },
  {
    id: '11',
    name: 'carreira',
    description: 'Dicas de carreira, entrevistas e mercado de trabalho',
    questionCount: 234,
    followers: 156,
    isFollowing: false,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    icon: '💼',
    lastActivity: '2024-01-14',
    createdAt: '2023-11-08'
  },
  {
    id: '12',
    name: 'dúvida',
    description: 'Perguntas gerais e dúvidas diversas',
    questionCount: 567,
    followers: 278,
    isFollowing: false,
    color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    icon: '❓',
    lastActivity: '2024-01-13',
    createdAt: '2023-12-01'
  },
  {
    id: '13',
    name: 'tecnologia',
    description: 'Tecnologia em geral, gadgets e inovações',
    questionCount: 789,
    followers: 432,
    isFollowing: true,
    color: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300',
    icon: '💻',
    lastActivity: '2024-01-15',
    createdAt: '2024-01-02'
  },
  {
    id: '14',
    name: 'design',
    description: 'UI/UX, design de interfaces e experiência do usuário',
    questionCount: 321,
    followers: 198,
    isFollowing: false,
    color: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300',
    icon: '🎨',
    lastActivity: '2024-01-12',
    createdAt: '2024-01-05'
  },
  {
    id: '15',
    name: 'backend',
    description: 'Desenvolvimento backend, APIs e servidores',
    questionCount: 543,
    followers: 321,
    isFollowing: false,
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    icon: '⚙️',
    lastActivity: '2024-01-14',
    createdAt: '2024-01-08'
  }
];

// Categorias de tags
const tagCategories = [
  { name: 'Tecnologia', icon: '💻', count: 8 },
  { name: 'Programação', icon: '👨‍💻', count: 10 },
  { name: 'Frontend', icon: '🎨', count: 6 },
  { name: 'Backend', icon: '⚙️', count: 4 },
  { name: 'Mobile', icon: '📱', count: 3 },
  { name: 'Games', icon: '🎮', count: 2 },
  { name: 'Carreira', icon: '💼', count: 3 },
  { name: 'Estudos', icon: '📚', count: 4 }
];

export const TagsPage = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [sortBy, setSortBy] = useState<TagSort>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estatísticas totais
  const totalTags = tags.length;
  const totalQuestions = tags.reduce((sum, tag) => sum + tag.questionCount, 0);
  const totalFollowers = tags.reduce((sum, tag) => sum + tag.followers, 0);
  const followingTags = tags.filter(tag => tag.isFollowing).length;

  // Filtrar e ordenar tags
  useEffect(() => {
    setIsLoading(true);
    
    // Simular carregamento
    setTimeout(() => {
      let filteredTags = [...mockTags];
      
      // Filtrar por busca
      if (searchQuery) {
        filteredTags = filteredTags.filter(tag =>
          tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tag.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Filtrar por categoria (simulado)
      if (selectedCategory) {
        // Aqui você implementaria a lógica real de categorias
        filteredTags = filteredTags.filter(tag => 
          tag.name.length > 3 // Exemplo simplificado
        );
      }
      
      // Filtrar por tags seguidas
      if (showFollowingOnly) {
        filteredTags = filteredTags.filter(tag => tag.isFollowing);
      }
      
      // Ordenar
      filteredTags.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'new':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'followers':
            return b.followers - a.followers;
          case 'popular':
          default:
            return b.questionCount - a.questionCount;
        }
      });
      
      setTags(filteredTags);
      setIsLoading(false);
    }, 300);
  }, [sortBy, searchQuery, selectedCategory, showFollowingOnly]);

  // Manipuladores
  const handleFollowToggle = (tagId: string) => {
    setTags(prevTags =>
      prevTags.map(tag =>
        tag.id === tagId
          ? { ...tag, isFollowing: !tag.isFollowing, followers: tag.isFollowing ? tag.followers - 1 : tag.followers + 1 }
          : tag
      )
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca já é acionada pelo useEffect
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setShowFollowingOnly(false);
    setSortBy('popular');
  };

  const handleTagClick = (tagName: string) => {
    navigate(`/search?tags=${tagName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho e Estatísticas */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🏷️ Explorar Tags
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Descubra tópicos, acompanhe tags e encontre conteúdo relevante
              </p>
            </div>
            
            {/* Barra de Busca */}
            <form onSubmit={handleSearch} className="relative max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tags por nome ou descrição..."
                className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Buscar"
              >
                🔍
              </button>
            </form>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalTags}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Tags totais
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalQuestions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Perguntas
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalFollowers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Seguidores totais
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {followingTags}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Tags seguidas
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  ⚙️ Filtros
                </h2>
                {(searchQuery || selectedCategory || showFollowingOnly || sortBy !== 'popular') && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Limpar
                  </button>
                )}
              </div>
              
              {/* Ordenar por */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Ordenar por
                </h3>
                <div className="space-y-2">
                  {([
                    { value: 'popular' as TagSort, label: '🔥 Mais populares' },
                    { value: 'name' as TagSort, label: '🔤 Ordem alfabética' },
                    { value: 'new' as TagSort, label: '🆕 Mais novas' },
                    { value: 'followers' as TagSort, label: '👥 Mais seguidores' }
                  ]).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        sortBy === option.value
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Filtrar por */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Filtrar por
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowFollowingOnly(!showFollowingOnly)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      showFollowingOnly
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {showFollowingOnly ? '✅ Apenas tags seguidas' : '👀 Ver tags seguidas'}
                  </button>
                </div>
              </div>
              
              {/* Categorias */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  🗂️ Categorias
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === null
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    🌟 Todas as categorias
                  </button>
                  {tagCategories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                      <span className="float-right text-gray-500 dark:text-gray-400">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tags em Destaque */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                ⭐ Tags em Alta
              </h3>
              <div className="space-y-3">
                {mockTags.slice(0, 5).map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <button
                      onClick={() => handleTagClick(tag.name)}
                      className="text-left"
                    >
                      <span className={`px-2 py-1 rounded text-sm ${tag.color}`}>
                        #{tag.name}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {tag.questionCount} perguntas
                      </div>
                    </button>
                    <button
                      onClick={() => handleFollowToggle(tag.id)}
                      className={`text-sm px-3 py-1 rounded-full ${
                        tag.isFollowing
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {tag.isFollowing ? 'Seguindo' : 'Seguir'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Tags */}
          <div className="flex-1">
            {/* Status */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></span>
                      Carregando tags...
                    </span>
                  ) : (
                    `🏷️ ${tags.length} ${tags.length === 1 ? 'tag encontrada' : 'tags encontradas'}`
                  )}
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Resultados para: <span className="font-semibold">"{searchQuery}"</span>
                  </p>
                )}
              </div>
              
              {/* Filtros ativos */}
              <div className="flex items-center space-x-2">
                {showFollowingOnly && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                    📌 Seguidas
                  </span>
                )}
                {selectedCategory && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    🗂️ {selectedCategory}
                  </span>
                )}
              </div>
            </div>

            {/* Grid de Tags */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : tags.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tags.map((tag) => (
                  <div 
                    key={tag.id} 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    <div className="p-6">
                      {/* Cabeçalho da Tag */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{tag.icon}</span>
                          <div>
                            <button
                              onClick={() => handleTagClick(tag.name)}
                              className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              #{tag.name}
                            </button>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Criada em {tag.createdAt}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleFollowToggle(tag.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            tag.isFollowing
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {tag.isFollowing ? 'Seguindo ✓' : 'Seguir'}
                        </button>
                      </div>
                      
                      {/* Descrição */}
                      <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                        {tag.description}
                      </p>
                      
                      {/* Estatísticas */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {tag.questionCount}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Perguntas
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {tag.followers}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Seguidores
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {tag.lastActivity}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Atividade
                          </div>
                        </div>
                      </div>
                      
                      {/* Ações */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleTagClick(tag.name)}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                          🔍 Ver Perguntas
                        </button>
                        <button
                          onClick={() => navigate(`/search?tags=${tag.name}`)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          📝 Perguntar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Nenhuma tag encontrada */
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🏷️</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Nenhuma tag encontrada
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Não encontramos tags correspondentes aos seus critérios de busca.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
            
            {/* Crie sua própria tag */}
            {!isLoading && (
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  ✨ Não encontrou a tag que procurava?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Você pode criar uma nova tag quando fizer uma pergunta!
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  🚀 Fazer uma Pergunta
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};