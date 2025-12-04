import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onCreateQuestion: () => void;
}

export const Header = ({ onCreateQuestion }: HeaderProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navegar para página de resultados de busca
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Buscar ao pressionar Enter (se já não estiver no formulário)
    if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) {
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const currentYear = 2026;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Título */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold flex items-center space-x-2">
              <span className="text-blue-600 dark:text-blue-400">Ask Me</span>
              <span className="inline-flex items-center space-x-1">
                <span className="text-green-600 dark:text-green-400 animate-pulse">🎄</span>
                <span className="text-red-500 dark:text-red-400 animate-bounce">🎅</span>
                <span className="text-yellow-500 dark:text-yellow-400">✨</span>
                <span className="text-blue-500 dark:text-blue-400 font-semibold">
                  Feliz {currentYear}!
                </span>
                <span className="text-red-500 dark:text-red-400">🎆</span>
                <span className="text-yellow-500 dark:text-yellow-400">🎉</span>
              </span>
            </h1>
          </div>

          {/* BARRA DE PESQUISA NO MEIO */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pesquisar perguntas, tags, usuários..."
                className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Buscar"
              >
                🔍
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Limpar busca"
                >
                  ✕
                </button>
              )}
            </form>
          </div>

          {/* Botões do lado direito */}
          <div className="flex items-center space-x-4">
            {/* Botão Fazer Pergunta */}
            <button
              onClick={onCreateQuestion}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all flex items-center space-x-2"
            >
              <span>✏️</span>
              <span className="hidden md:inline">Fazer Pergunta</span>
            </button>

            {/* Botão de Tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Notificações */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="text-lg">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Perfil do Usuário */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <img 
                  src="https://cdn.worldvectorlogo.com/logos/nuon.svg" 
                  alt="Nuon"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                />
                <span className={`transform transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Dropdown do Usuário */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">Nuon</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">membro desde 2024</p>
                  </div>
                  <button 
                    onClick={() => navigate('/profile')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    📝 Meu Perfil
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                    ❓ Minhas Perguntas
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                    💬 Minhas Respostas
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors">
                      🚪 Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
          {/* Barra de Pesquisa Mobile */}
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pesquisar perguntas..."
              className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Buscar"
            >
              🔍
            </button>
          </form>
          
          <div className="flex items-center justify-between">
            <button
              onClick={onCreateQuestion}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all flex items-center space-x-2"
            >
              <span>✏️</span>
              <span>Fazer Pergunta</span>
            </button>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/search')}
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Explorar
              </button>
              <button 
                onClick={() => navigate('/tags')}
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Tags
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};