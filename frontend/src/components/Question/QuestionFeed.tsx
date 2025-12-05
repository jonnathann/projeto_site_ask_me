// QuestionFeed.tsx - VERSÃO CORRIGIDA
import { useState } from 'react';
import { QuestionCard } from './QuestionCard';
import { Question } from '../../types/Question';
import { useNavigate } from 'react-router-dom';

interface QuestionFeedProps {
  onCreateQuestion?: () => void;
  questions?: Question[];
}

// Dados mockados iniciais
const initialMockQuestions: Question[] = [
  {
    id: '1',
    title: 'De zero a dez o quanto vcs gostam do super nintendo?',
    content: 'Estou fazendo uma pesquisa sobre consoles clássicos e queria saber a opinião de vocês sobre o Super Nintendo. Qual nota dariam de 0 a 10?',
    author: { 
      id: '1', 
      name: 'nuon',
      avatar: 'https://cdn.worldvectorlogo.com/logos/nuon.svg'
    },
    createdAt: '2024-01-15',
    answersCount: 8,
    upvotes: 15,
    tags: ['games', 'retro', 'super-nintendo'],
    isAnswered: true
  },
  {
    id: '2',
    title: 'Já teve a experiência de ter um(a) amigo(a) da onça, vulgo coxinha?',
    content: 'Pessoal, já tiveram aquela experiência de ter um "amigo" que na verdade era falso? Como foi e como lidaram com a situação?',
    author: { 
      id: '2', 
      name: 'Mariaflor321',
      avatar: 'https://i.postimg.cc/fW0bGZ1J/maria-flor321.png'
    },
    createdAt: '2024-01-14',
    answersCount: 12,
    upvotes: 23,
    tags: ['amizade', 'relacionamentos', 'conselhos'],
    isAnswered: false
  },
  {
    id: '3',
    title: 'A mãe de vocês cozinha bem?',
    content: 'Fala galera! Tava aqui pensando... a mãe de vocês cozinha bem? Aqui em casa é hit or miss, as vezes é banquete, as vezes é sobrevivência kkk',
    author: { 
      id: '3', 
      name: 'l450',
      avatar: 'https://i.postimg.cc/k4vT4LpD/l450.png'
    },
    createdAt: '2024-01-13',
    answersCount: 25,
    upvotes: 42,
    tags: ['família', 'culinária', 'humor'],
    isAnswered: false
  }
];

// Perguntas relacionadas (mock)
const relatedQuestions: Question[] = [
  {
    id: '4',
    title: 'Qual seu jogo de SNES favorito?',
    content: 'Me conta qual jogo do Super Nintendo marcou mais sua infância!',
    author: { id: '7', name: 'Gamer123' },
    createdAt: '2024-01-12',
    answersCount: 5,
    upvotes: 18,
    tags: ['games', 'snes', 'nostalgia'],
    isAnswered: false
  },
  {
    id: '5',
    title: 'Vale a pena comprar um SNES hoje em dia?',
    content: 'Tô pensando em comprar um Super Nintendo original, mas não sei se vale a pena...',
    author: { id: '8', name: 'RetroCollector' },
    createdAt: '2024-01-11',
    answersCount: 7,
    upvotes: 12,
    tags: ['games', 'retro', 'coleção'],
    isAnswered: true
  },
  {
    id: '6',
    title: 'Como conectar SNES em TV moderna?',
    content: 'Alguém sabe como conectar um Super Nintendo em uma TV LED moderna?',
    author: { id: '9', name: 'TechHelper' },
    createdAt: '2024-01-10',
    answersCount: 3,
    upvotes: 9,
    tags: ['games', 'tecnologia', 'snes'],
    isAnswered: false
  }
];

export const QuestionFeed = ({ onCreateQuestion, questions: propQuestions }: QuestionFeedProps) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('todas');
  
  // Combina perguntas mockadas iniciais com perguntas criadas
  const allQuestions = [...(propQuestions || []), ...initialMockQuestions];
  
  // DEBUG: Verificar IDs das perguntas
  console.log('📊 Question IDs:', allQuestions.map(q => q.id));
  console.log('📊 Related Question IDs:', relatedQuestions.map(q => q.id));

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleRelatedQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        
        {/* Coluna principal (esquerda) */}
        <div className="flex-1">
          <div className="space-y-6">
            {/* Header do Feed */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Perguntas Recentes</h1>
                <p className="text-gray-600 dark:text-gray-300">Encontre respostas para suas dúvidas ou ajude outros</p>
              </div>
              <button 
                onClick={onCreateQuestion}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center"
              >
                <span className="mr-2">✏️</span>
                Fazer Pergunta
              </button>
            </div>

            {/* Filtros */}
            <div className="flex space-x-4">
              <button 
                onClick={() => handleFilterClick('todas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'todas' 
                    ? 'bg-blue-600 dark:bg-blue-700 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Todas
              </button>
              <button 
                onClick={() => handleFilterClick('sem-resposta')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'sem-resposta' 
                    ? 'bg-blue-600 dark:bg-blue-700 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Sem resposta
              </button>
              <button 
                onClick={() => handleFilterClick('mais-votadas')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'mais-votadas' 
                    ? 'bg-blue-600 dark:bg-blue-700 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Mais votadas
              </button>
            </div>

            {/* Lista de Perguntas - CORRIGIDO */}
            <div className="space-y-4">
              {allQuestions.map((question) => (
                <QuestionCard 
                  key={`question-${question.id}`} // Chave única com prefixo
                  question={question} 
                />
              ))}
              
              {allQuestions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Nenhuma pergunta encontrada. Seja o primeiro a perguntar! ✨
                  </p>
                </div>
              )}
            </div>

            {/* Carregar Mais */}
            {allQuestions.length > 0 && (
              <div className="flex justify-center">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Carregar mais perguntas
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar de Perguntas Relacionadas (direita) - CORRIGIDO */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              🔍 Perguntas Relacionadas
            </h2>
            
            <div className="space-y-4">
              {relatedQuestions.map((question) => (
                <div 
                  key={`related-${question.id}`} // Chave única com prefixo
                  onClick={() => handleRelatedQuestionClick(question.id)}
                  className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-gray-100 dark:border-gray-600"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                    {question.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{question.answersCount} respostas</span>
                    <span>{question.upvotes} 👍</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {question.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span 
                        key={`tag-${question.id}-${tag}-${tagIndex}`} // Chave única para tags
                        className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Estatísticas */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                📊 Estatísticas do Dia
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Perguntas hoje:</span>
                  <span className="font-semibold">{allQuestions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Respostas:</span>
                  <span className="font-semibold">
                    {allQuestions.reduce((total, q) => total + q.answersCount, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Usuários online:</span>
                  <span className="font-semibold text-green-600">42</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};