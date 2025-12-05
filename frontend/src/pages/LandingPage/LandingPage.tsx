// frontend/src/pages/LandingPage/LandingPage.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Minimalista - SEM LOGO */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-end items-center">
          {/* Removido o logo do canto superior esquerdo */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              // APENAS botão "Entrar" - cadastro está no botão principal
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Entrar
              </Link>
            ) : (
              <Link
                to="/"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Ir para o App
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-12 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo Grande - CENTRALIZADO */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-4">
                <span className="text-blue-600 dark:text-blue-400">Ask Me</span>
                
              </h1>
              <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-medium">
                A comunidade onde conhecimento é compartilhado
              </p>
            </div>

            {/* Descrição */}
            <div className="mb-12 max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-400 mb-6">
                Conecte-se com desenvolvedores, estudantes e especialistas de todo o mundo. 
                Faça perguntas, compartilhe soluções e cresça junto com uma comunidade que 
                valoriza o aprendizado colaborativo.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="text-3xl mb-4">❓</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Faça Perguntas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tire suas dúvidas sobre programação, tecnologia e muito mais
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="text-3xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Compartilhe Respostas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ajude outros membros com seu conhecimento e experiência
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="text-3xl mb-4">⭐</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Ganhe Reconhecimento
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Construa sua reputação na comunidade tech
                  </p>
                </div>
              </div>
            </div>

            {/* Botão Principal - "Participe Agora" */}
            <div className="mb-16">
              <Link
                to={isAuthenticated ? "/" : "/signup"}
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isAuthenticated ? "🏠 Acessar Minha Conta" : "🎉 Participe Agora - É Grátis!"}
              </Link>
              
              {/* Texto abaixo do botão */}
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Junte-se a milhares de desenvolvedores apaixonados por tecnologia
              </p>
              
              {/* Link "Já tem conta? Entre aqui" */}
              <div className="mt-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Já tem uma conta?{' '}
                  <Link 
                    to="/login" 
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Entre aqui
                  </Link>
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">1k+</div>
                <div className="text-gray-600 dark:text-gray-400">Usuários</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">5k+</div>
                <div className="text-gray-600 dark:text-gray-400">Perguntas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">15k+</div>
                <div className="text-gray-600 dark:text-gray-400">Respostas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">50+</div>
                <div className="text-gray-600 dark:text-gray-400">Tags</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Simples */}
      <footer className="px-6 py-8 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Ask Me. Todos os direitos reservados.
          </p>
          <div className="mt-4 space-x-6">
            <Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Sobre
            </Link>
            <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Privacidade
            </Link>
            <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Termos
            </Link>
            <Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};