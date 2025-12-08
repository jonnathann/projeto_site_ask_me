// src/components/Question/QuestionFeed.tsx
import { useState, useEffect } from 'react'; // ← ADICIONAR useEffect
import { QuestionCard } from './QuestionCard';
import { useNavigate } from 'react-router-dom';
import { questionService } from '../../services/questions/questionService'; // ← ADICIONAR

interface QuestionFeedProps {
  onCreateQuestion?: () => void;
}

export const QuestionFeed = ({ onCreateQuestion }: QuestionFeedProps) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('todas');
  const [questions, setQuestions] = useState<any[]>([]); // ← ESTADO PARA PERGUNTAS
  const [loading, setLoading] = useState(true); // ← LOADING STATE
  const [stats, setStats] = useState({
    questionsToday: 0,
    totalAnswers: 0,
    onlineUsers: 42 // Mockado por enquanto
  });
  
  // ✅ CARREGAR PERGUNTAS DO LOCALSTORAGE
  useEffect(() => {
    loadQuestions();
  }, [activeFilter]); // Recarrega quando muda filtro

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionService.getQuestions({
        // Podemos adicionar filtros depois
        limit: 10
      });
      
      setQuestions(response.questions);
      
      // Calcular estatísticas
      const today = new Date().toISOString().split('T')[0];
      const questionsToday = response.questions.filter((q: any) => 
        q.createdAt.startsWith(today)
      ).length;
      
      const totalAnswers = response.questions.reduce((total: number, q: any) => 
        total + (q.answersCount || 0), 0
      );
      
      setStats({
        questionsToday,
        totalAnswers,
        onlineUsers: 42
      });
      
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
      setQuestions([]); // Se der erro, array vazio
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    // Aqui poderíamos aplicar filtros diferentes
    // Por enquanto só muda o estado visual
  };

  const handleRelatedQuestionClick = (questionId: string) => {
    navigate(`/question/${questionId}`);
  };

  // ✅ PERGUNTAS RELACIONADAS (pega algumas das perguntas existentes)
  const relatedQuestions = questions.slice(0, 3).map(q => ({
    id: q.id,
    title: q.title,
    answersCount: q.answers?.length || 0,
    upvotes: q.upvotes?.length || 0,
    tags: q.tags || []
  }));

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

            {/* Lista de Perguntas */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Carregando perguntas...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <QuestionCard 
                    key={`question-${question.id}`}
                    question={question} 
                  />
                ))}
                
                {questions.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      Nenhuma pergunta encontrada. Seja o primeiro a perguntar! ✨
                    </p>
                    <button 
                      onClick={onCreateQuestion}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Fazer Primeira Pergunta
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Carregar Mais */}
            {questions.length > 0 && (
              <div className="flex justify-center">
                <button 
                  onClick={loadQuestions}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Atualizar perguntas
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar de Perguntas Relacionadas (direita) */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              🔍 Perguntas Relacionadas
            </h2>
            
            <div className="space-y-4">
              {relatedQuestions.map((question) => (
                <div 
                  key={`related-${question.id}`}
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
                        key={`tag-${question.id}-${tag}-${tagIndex}`}
                        className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              
              {relatedQuestions.length === 0 && !loading && (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                  Ainda não há perguntas relacionadas.
                </p>
              )}
            </div>

            {/* Estatísticas */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                📊 Estatísticas do Dia
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Perguntas hoje:</span>
                  <span className="font-semibold">{stats.questionsToday}</span>
                </div>
                <div className="flex justify-between">
                  <span>Respostas:</span>
                  <span className="font-semibold">{stats.totalAnswers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Usuários online:</span>
                  <span className="font-semibold text-green-600">{stats.onlineUsers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};