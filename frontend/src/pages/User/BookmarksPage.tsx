// frontend/src/pages/User/BookmarksPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Question } from '../../types/Question';

// Dados mockados de perguntas salvas
const mockBookmarkedQuestions: Question[] = [
  {
    id: '101',
    title: 'Como otimizar performance em React com muitos componentes?',
    content: 'Estou com um aplicativo React que tem mais de 100 componentes renderizando...',
    author: { 
      id: 'user10', 
      name: 'PerfExpert',
      avatar: 'https://ui-avatars.com/api/?name=PerfExpert&background=3B82F6&color=fff'
    },
    createdAt: '2024-01-20',
    answersCount: 24,
    upvotes: 156,
    tags: ['react', 'performance', 'optimization', 'frontend'],
    isAnswered: true,
    views: 1200
  },
  {
    id: '102',
    title: 'Melhores práticas para autenticação JWT em aplicações Node.js',
    content: 'Quais são as melhores práticas atuais para implementar JWT em APIs Node.js?',
    author: { 
      id: 'user11', 
      name: 'AuthMaster',
      avatar: 'https://ui-avatars.com/api/?name=AuthMaster&background=10B981&color=fff'
    },
    createdAt: '2024-01-18',
    answersCount: 18,
    upvotes: 89,
    tags: ['nodejs', 'jwt', 'authentication', 'security', 'backend'],
    isAnswered: true,
    views: 876
  },
  {
    id: '103',
    title: 'Como migrar de JavaScript para TypeScript em um projeto grande?',
    content: 'Temos um projeto com 50+ arquivos JavaScript e queremos migrar para TypeScript...',
    author: { 
      id: 'user12', 
      name: 'TypeScriptPro',
      avatar: 'https://ui-avatars.com/api/?name=TypeScriptPro&background=8B5CF6&color=fff'
    },
    createdAt: '2024-01-15',
    answersCount: 32,
    upvotes: 143,
    tags: ['typescript', 'javascript', 'migration', 'web'],
    isAnswered: false,
    views: 1543
  },
  {
    id: '104',
    title: 'Diferenças entre Docker e Kubernetes para deploy de aplicações',
    content: 'Qual a diferença prática entre Docker e Kubernetes? Quando usar cada um?',
    author: { 
      id: 'user13', 
      name: 'DevOpsGuru',
      avatar: 'https://ui-avatars.com/api/?name=DevOpsGuru&background=EF4444&color=fff'
    },
    createdAt: '2024-01-12',
    answersCount: 21,
    upvotes: 76,
    tags: ['docker', 'kubernetes', 'devops', 'deployment', 'containers'],
    isAnswered: true,
    views: 987
  },
  {
    id: '105',
    title: 'Como implementar testes end-to-end (E2E) com Cypress?',
    content: 'Estou começando com testes E2E e quero saber as melhores práticas com Cypress...',
    author: { 
      id: 'user14', 
      name: 'QAExpert',
      avatar: 'https://ui-avatars.com/api/?name=QAExpert&background=F59E0B&color=fff'
    },
    createdAt: '2024-01-10',
    answersCount: 15,
    upvotes: 54,
    tags: ['testing', 'cypress', 'e2e', 'quality-assurance'],
    isAnswered: true,
    views: 654
  },
  {
    id: '106',
    title: 'Melhores bancos de dados NoSQL para aplicações em tempo real',
    content: 'Estou desenvolvendo um chat em tempo real e quero saber qual NoSQL usar...',
    author: { 
      id: 'user15', 
      name: 'DBArchitect',
      avatar: 'https://ui-avatars.com/api/?name=DBArchitect&background=6366F1&color=fff'
    },
    createdAt: '2024-01-08',
    answersCount: 28,
    upvotes: 92,
    tags: ['database', 'nosql', 'mongodb', 'realtime', 'backend'],
    isAnswered: false,
    views: 1123
  }
];

// Categorias para organizar os bookmarks
const bookmarkCategories = [
  { id: 'all', label: '📚 Todos', icon: '📚' },
  { id: 'react', label: '⚛️ React', icon: '⚛️' },
  { id: 'nodejs', label: '🟢 Node.js', icon: '🟢' },
  { id: 'database', label: '🗄️ Banco de Dados', icon: '🗄️' },
  { id: 'devops', label: '🚀 DevOps', icon: '🚀' },
  { id: 'testing', label: '🧪 Testes', icon: '🧪' }
];

export const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState<Question[]>(mockBookmarkedQuestions);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'votes' | 'answers'>('date');
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
  const navigate = useNavigate();

  // Filtrar bookmarks por categoria e busca
  const filteredBookmarks = bookmarks.filter(question => {
    const matchesCategory = activeCategory === 'all' || 
      question.tags.some(tag => tag.toLowerCase() === activeCategory);
    
    const matchesSearch = searchQuery === '' || 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Ordenar bookmarks
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    switch (sortBy) {
      case 'votes':
        return b.upvotes - a.upvotes;
      case 'answers':
        return b.answersCount - a.answersCount;
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Remover bookmark
  const removeBookmark = (questionId: string) => {
    setBookmarks(prev => prev.filter(q => q.id !== questionId));
    setSelectedBookmarks(prev => prev.filter(id => id !== questionId));
  };

  // Remover múltiplos bookmarks
  const removeSelectedBookmarks = () => {
    setBookmarks(prev => prev.filter(q => !selectedBookmarks.includes(q.id)));
    setSelectedBookmarks([]);
  };

  // Alternar seleção de bookmark
  const toggleBookmarkSelection = (questionId: string) => {
    setSelectedBookmarks(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Selecionar/deselecionar todos
  const toggleSelectAll = () => {
    if (selectedBookmarks.length === sortedBookmarks.length) {
      setSelectedBookmarks([]);
    } else {
      setSelectedBookmarks(sortedBookmarks.map(q => q.id));
    }
  };

  // Navegar para pergunta
  const navigateToQuestion = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  // Estatísticas
  const totalBookmarks = bookmarks.length;
  const answeredBookmarks = bookmarks.filter(q => q.isAnswered).length;
  const popularTags = Array.from(
    new Set(bookmarks.flatMap(q => q.tags))
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🔖 Perguntas Salvas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Sua coleção pessoal de perguntas interessantes ({totalBookmarks} salvas)
              </p>
            </div>

            {/* Estatísticas rápidas */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {answeredBookmarks}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Respondidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalBookmarks - answeredBookmarks}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Abertas</div>
              </div>
            </div>
          </div>

          {/* Barra de busca e filtros */}
          <div className="space-y-4">
            {/* Busca */}
            <div className="relative max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar nas perguntas salvas..."
                className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>

            {/* Filtros e ações */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Categorias */}
              <div className="flex flex-wrap gap-2">
                {bookmarkCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
                      activeCategory === category.id
                        ? 'bg-blue-600 dark:bg-blue-700 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>

              {/* Ordenação e ações em lote */}
              <div className="flex items-center space-x-4">
                {/* Ordenação */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                >
                  <option value="date">Mais recentes</option>
                  <option value="votes">Mais votadas</option>
                  <option value="answers">Mais respostas</option>
                </select>

                {/* Ações em lote */}
                {selectedBookmarks.length > 0 && (
                  <button
                    onClick={removeSelectedBookmarks}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Remover selecionadas ({selectedBookmarks.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Bookmarks */}
        <div className="space-y-4">
          {sortedBookmarks.length > 0 ? (
            <>
              {/* Selecionar todos (se houver bookmarks) */}
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedBookmarks.length === sortedBookmarks.length && sortedBookmarks.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Selecionar todas ({sortedBookmarks.length} perguntas)
                  </span>
                </div>
                <button
                  onClick={() => console.log('Exportar bookmarks (em desenvolvimento)')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  📥 Exportar lista
                </button>
              </div>

              {/* Lista de perguntas */}
              {sortedBookmarks.map(question => (
                <div
                  key={question.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all hover:shadow-md ${
                    selectedBookmarks.includes(question.id)
                      ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <div className="flex-shrink-0 pt-1">
                        <input
                          type="checkbox"
                          checked={selectedBookmarks.includes(question.id)}
                          onChange={() => toggleBookmarkSelection(question.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </div>

                      {/* Conteúdo */}
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => navigateToQuestion(question.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {question.title}
                          </h3>
                          {question.isAnswered && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full whitespace-nowrap">
                              ✅ Respondida
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {question.content}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {question.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Metadados */}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <img
                                src={question.author.avatar}
                                alt={question.author.name}
                                className="w-5 h-5 rounded-full"
                              />
                              <span>{question.author.name}</span>
                            </div>
                            <span>📅 {question.createdAt}</span>
                            <span>👁️ {question.views} visualizações</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                              <span>👍</span>
                              <span>{question.upvotes}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>💬</span>
                              <span>{question.answersCount}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBookmark(question.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          title="Remover dos favoritos"
                        >
                          ❌
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Compartilhar pergunta:', question.id);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                          title="Compartilhar"
                        >
                          🔗
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            // Estado vazio
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔖</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'Nenhuma pergunta encontrada' : 'Nenhuma pergunta salva'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                {searchQuery 
                  ? 'Tente buscar com outros termos ou limpar os filtros.'
                  : 'Salve perguntas interessantes para encontrá-las facilmente depois!'}
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
                  Explorar perguntas
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tags populares nos bookmarks */}
        {popularTags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                🏷️ Tags populares nos seus favoritos
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setActiveCategory(tag);
                      setSearchQuery('');
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === tag
                        ? 'bg-blue-600 dark:bg-blue-700 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};