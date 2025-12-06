// src/pages/SearchPage/SearchPage.tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchFilters, SearchResult, SearchSort, TimeRange } from '../../types/Search';
import { QuestionCard } from '../../components/Question/QuestionCard';
import { popularTags } from '../../data/mock/tags';
import { initialMockQuestions } from '../../data/mock/questions';

// Dados mockados para busca
const mockSearchResults: SearchResult[] = initialMockQuestions.map(q => ({
  ...q,
  relevance: Math.floor(Math.random() * 30) + 70 // Adiciona relevância aleatória
}));

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Estado dos filtros
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    sortBy: (searchParams.get('sort') as SearchSort) || 'relevance',
    tags: searchParams.get('tags')?.split(',') || [],
    timeRange: (searchParams.get('time') as TimeRange) || 'all',
    hasAcceptedAnswer: searchParams.get('answered') === 'true' ? true : 
                      searchParams.get('answered') === 'false' ? false : null,
    isUnanswered: searchParams.get('unanswered') === 'true'
  });
  
  const [results, setResults] = useState<SearchResult[]>(mockSearchResults);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  // Atualizar URL quando filtros mudam
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.query) params.set('q', filters.query);
    if (filters.sortBy !== 'relevance') params.set('sort', filters.sortBy);
    if (filters.tags.length > 0) params.set('tags', filters.tags.join(','));
    if (filters.timeRange !== 'all') params.set('time', filters.timeRange);
    if (filters.hasAcceptedAnswer !== null) params.set('answered', filters.hasAcceptedAnswer.toString());
    if (filters.isUnanswered) params.set('unanswered', 'true');
    
    setSearchParams(params);
    
    // Simular busca
    if (filters.query || filters.tags.length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        // Filtrar resultados baseado nos filtros
        const filteredResults = mockSearchResults.filter(result => {
          const matchesQuery = !filters.query || 
            result.title.toLowerCase().includes(filters.query.toLowerCase()) ||
            result.content.toLowerCase().includes(filters.query.toLowerCase());
          
          const matchesTags = filters.tags.length === 0 || 
            filters.tags.every(tag => result.tags.includes(tag));
          
          return matchesQuery && matchesTags;
        });
        
        // Ordenar resultados
        const sortedResults = [...filteredResults].sort((a, b) => {
          switch (filters.sortBy) {
            case 'newest':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'votes':
              return b.upvotes - a.upvotes;
            case 'answers':
              return b.answersCount - a.answersCount;
            case 'relevance':
            default:
              return (b.relevance || 0) - (a.relevance || 0);
          }
        });
        
        setResults(sortedResults);
        setIsLoading(false);
        
        // Sugerir tags baseado na query
        if (filters.query) {
          const queryTags = popularTags
            .filter(tag => tag.name.includes(filters.query.toLowerCase()))
            .map(tag => tag.name)
            .slice(0, 5);
          setSuggestedTags(queryTags);
        }
      }, 500);
    }
  }, [filters, setSearchParams]);

  // Manipuladores de filtros
  const handleSortChange = (sort: SearchSort) => {
    setFilters(prev => ({ ...prev, sortBy: sort }));
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setFilters(prev => ({ ...prev, timeRange: range }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      sortBy: 'relevance',
      tags: [],
      timeRange: 'all',
      hasAcceptedAnswer: null,
      isUnanswered: null
    });
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, query: e.target.value }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A busca já é acionada pelo useEffect
  };

  const totalResults = results.length;
  const hasActiveFilters = filters.query || filters.tags.length > 0 || 
    filters.timeRange !== 'all' || filters.hasAcceptedAnswer !== null || filters.isUnanswered;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Busca */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🔍 Buscar Perguntas
          </h1>
          
          {/* Barra de Busca Principal */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-3xl">
            <input
              type="text"
              value={filters.query}
              onChange={handleQueryChange}
              placeholder="Digite palavras-chave, tags ou o título da pergunta..."
              className="w-full px-6 py-4 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <span className="text-2xl">🔍</span>
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  🎯 Filtros
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Limpar tudo
                  </button>
                )}
              </div>

              {/* Filtro: Ordenar por */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Ordenar por
                </h3>
                <div className="space-y-2">
                  {([
                    { value: 'relevance' as SearchSort, label: '🔍 Relevância' },
                    { value: 'newest' as SearchSort, label: '🆕 Mais novas' },
                    { value: 'votes' as SearchSort, label: '👍 Mais votadas' },
                    { value: 'answers' as SearchSort, label: '💬 Mais respondidas' }
                  ]).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        filters.sortBy === option.value
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro: Período */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Período
                </h3>
                <div className="space-y-2">
                  {([
                    { value: 'all' as TimeRange, label: '🕒 Todo o período' },
                    { value: 'year' as TimeRange, label: '📅 Último ano' },
                    { value: 'month' as TimeRange, label: '📅 Último mês' },
                    { value: 'week' as TimeRange, label: '📅 Última semana' },
                    { value: 'day' as TimeRange, label: '📅 Últimas 24h' }
                  ]).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleTimeRangeChange(option.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        filters.timeRange === option.value
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro: Status da resposta */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Status
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      hasAcceptedAnswer: prev.hasAcceptedAnswer === true ? null : true 
                    }))}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      filters.hasAcceptedAnswer === true
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    ✅ Com resposta aceita
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      isUnanswered: !prev.isUnanswered 
                    }))}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      filters.isUnanswered
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    ❓ Sem respostas
                  </button>
                </div>
              </div>

              {/* Tags selecionadas */}
              {filters.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Tags selecionadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {filters.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors"
                      >
                        #{tag}
                        <span className="ml-2">✕</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags populares */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  🏷️ Tags populares
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => handleTagToggle(tag.name)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.tags.includes(tag.name)
                          ? 'ring-2 ring-blue-500 ' + tag.color
                          : tag.color + ' hover:opacity-90'
                      }`}
                    >
                      #{tag.name}
                      <span className="ml-1 text-xs opacity-75">({tag.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resultados da Busca */}
          <div className="flex-1">
            {/* Status da Busca */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></span>
                      Buscando...
                    </span>
                  ) : (
                    `📊 ${totalResults} ${totalResults === 1 ? 'resultado encontrado' : 'resultados encontrados'}`
                  )}
                </h2>
                {filters.query && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Resultados para: <span className="font-semibold">"{filters.query}"</span>
                  </p>
                )}
              </div>
              
              {/* Filtros ativos rápidos */}
              {hasActiveFilters && (
                <div className="flex items-center space-x-2">
                  {filters.tags.length > 0 && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      {filters.tags.length} tag(s)
                    </span>
                  )}
                  {filters.timeRange !== 'all' && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                      {filters.timeRange}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Sugestões de busca */}
            {suggestedTags.length > 0 && !isLoading && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  💡 Sugestões relacionadas:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Resultados */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : totalResults > 0 ? (
              <div className="space-y-6">
                {results.map((result) => (
                  <div 
                    key={result.id} 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                    onClick={() => navigate(`/question/${result.id}`)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {result.title}
                        </h3>
                        {result.isAnswered && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm rounded-full font-medium">
                            ✅ Respondida
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {result.content}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {result.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <span>👤</span>
                            <span className="font-medium">{result.author.name}</span>
                          </div>
                          <span>📅 {result.createdAt}</span>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-1">
                            <span>👍</span>
                            <span className="font-medium">{result.upvotes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>💬</span>
                            <span className="font-medium">{result.answersCount} respostas</span>
                          </div>
                          {result.relevance && (
                            <div className="flex items-center space-x-1">
                              <span>🎯</span>
                              <span className="font-medium">{result.relevance}% relevante</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Nenhum resultado encontrado */
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Não encontramos perguntas correspondentes aos seus critérios de busca.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Limpar filtros
                  </button>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p className="mb-2">💡 Dicas para melhorar sua busca:</p>
                    <ul className="space-y-1">
                      <li>• Verifique a ortografia das palavras</li>
                      <li>• Tente termos mais gerais</li>
                      <li>• Use tags específicas</li>
                      <li>• Remova alguns filtros</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};