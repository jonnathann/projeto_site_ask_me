import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Question, Answer } from '../../types/Question';
import { AnswerCard } from '../../components/Question/AnswerCard';

type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry' | null;

const reactions = [
  { type: 'like' as ReactionType, emoji: '👍', label: 'Curtir', color: 'text-blue-500' },
  { type: 'love' as ReactionType, emoji: '❤️', label: 'Amei', color: 'text-red-500' },
  { type: 'haha' as ReactionType, emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
  { type: 'wow' as ReactionType, emoji: '😮', label: 'Uau', color: 'text-yellow-500' },
  { type: 'sad' as ReactionType, emoji: '😢', label: 'Triste', color: 'text-yellow-500' },
  { type: 'angry' as ReactionType, emoji: '😠', label: 'Bravo', color: 'text-red-600' },
];

// Dados mockados para a página individual
const mockQuestion: Question = {
  id: '1',
  title: 'De zero a dez o quanto vcs gostam do super nintendo?',
  content: 'Estou fazendo uma pesquisa sobre consoles clássicos e queria saber a opinião de vocês sobre o Super Nintendo. Eu particularmente dou 9/10 - os gráficos eram incríveis para a época e a biblioteca de jogos é fantástica! Qual nota vocês dariam de 0 a 10?',
  author: { 
    id: '1', 
    name: 'Nuon',
    avatar: 'https://cdn.worldvectorlogo.com/logos/nuon.svg'
  },
  createdAt: '2024-01-15',
  answersCount: 3,
  upvotes: 15,
  tags: ['games', 'retro', 'super-nintendo', 'nostalgia'],
  isAnswered: true,
  views: 142,
  answers: [
    {
      id: '1',
      content: 'Eu dou 10/10 fácil! O Super Nintendo foi minha infância toda. Jogos como Super Mario World, Donkey Kong Country e Zelda: A Link to the Past são atemporais. A Nintendo acertou em cheio com esse console!',
      author: { id: '4', name: 'GameLover' },
      createdAt: '2024-01-15',
      upvotes: 8,
      isAccepted: true
    },
    {
      id: '2',
      content: 'Daria 8/10. Os jogos são incríveis, mas acho que o controle poderia ser mais ergonômico. Fora isso, é um console fantástico que envelheceu muito bem!',
      author: { id: '5', name: 'RetroPlayer' },
      createdAt: '2024-01-16',
      upvotes: 5,
      isAccepted: false
    },
    {
      id: '3',
      content: '10/10 sem dúvidas! Até hoje jogo Super Metroid e Chrono Trigger. A qualidade dos RPGs da era SNES é insuperável na minha opinião.',
      author: { id: '6', name: 'RPGMaster' },
      createdAt: '2024-01-17',
      upvotes: 12,
      isAccepted: false
    }
  ]
};

export const QuestionPage = () => {
  const { id } = useParams<{ id: string }>();
  const [question] = useState<Question>(mockQuestion);
  const [newAnswer, setNewAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>(mockQuestion.answers || []);
  
  // States para reactions da PERGUNTA
  const [questionUpvotes, setQuestionUpvotes] = useState(question.upvotes);
  const [questionReaction, setQuestionReaction] = useState<ReactionType>(null);
  const [showQuestionReactions, setShowQuestionReactions] = useState(false);

  const handleQuestionReaction = (reactionType: ReactionType) => {
    const previousReaction = questionReaction;
    
    if (previousReaction && previousReaction !== reactionType) {
      setQuestionUpvotes(questionUpvotes - 1);
    }
    
    if (reactionType && reactionType !== previousReaction) {
      setQuestionUpvotes(questionUpvotes + 1);
    }
    
    if (reactionType === previousReaction) {
      setQuestionUpvotes(questionUpvotes - 1);
      setQuestionReaction(null);
    } else {
      setQuestionReaction(reactionType);
    }
    
    setShowQuestionReactions(false);
  };

  const handleAcceptAnswer = (answerId: string) => {
    setAnswers(answers.map(answer => ({
      ...answer,
      isAccepted: answer.id === answerId
    })));
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    const newAnswerObj: Answer = {
      id: Date.now().toString(),
      content: newAnswer,
      author: { id: 'current-user', name: 'Você' },
      createdAt: new Date().toISOString().split('T')[0],
      upvotes: 0,
      isAccepted: false
    };

    setAnswers([...answers, newAnswerObj]);
    setNewAnswer('');
  };

  const currentQuestionReaction = reactions.find(r => r.type === questionReaction);
  const acceptedAnswer = answers.find(answer => answer.isAccepted);
  const otherAnswers = answers.filter(answer => !answer.isAccepted);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Pergunta - AGORA COM AVATAR E REACTIONS */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          {/* Header da Pergunta com Avatar */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {question.author.avatar ? (
                <img 
                  src={question.author.avatar} 
                  alt={question.author.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {question.author.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{question.author.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{question.createdAt}</p>
              </div>
            </div>
            
            {/* Badge de Pergunta Respondida */}
            {question.isAnswered && (
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-full font-medium flex items-center space-x-1">
                <span>🏆</span>
                <span>Com Melhor Resposta</span>
            </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {question.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>📅 {question.createdAt}</span>
            <span>👁️ {question.views} visualizações</span>
            <span>💬 {question.answersCount} respostas</span>
          </div>

          {/* Conteúdo da Pergunta */}
          <div className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {question.content}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* REACTIONS DA PERGUNTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4">
              {/* Reactions da Pergunta */}
              <div className="relative">
                <button 
                  onMouseEnter={() => setShowQuestionReactions(true)}
                  onMouseLeave={() => setTimeout(() => setShowQuestionReactions(false), 300)}
                  className={`flex items-center space-x-1 p-2 rounded-lg transition-all ${
                    questionReaction 
                      ? `${currentQuestionReaction?.color} bg-gray-100 dark:bg-gray-700` 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">
                    {questionReaction ? currentQuestionReaction?.emoji : '👍'}
                  </span>
                  <span className={`font-medium ${
                    questionReaction ? currentQuestionReaction?.color : ''
                  }`}>
                    {questionUpvotes}
                  </span>
                </button>

                {/* Paleta de Reactions da Pergunta */}
                {showQuestionReactions && (
                  <div 
                    className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex space-x-1 z-10"
                    onMouseEnter={() => setShowQuestionReactions(true)}
                    onMouseLeave={() => setTimeout(() => setShowQuestionReactions(false), 300)}
                  >
                    {reactions.map((reaction) => (
                      <button
                        key={reaction.type}
                        onClick={() => handleQuestionReaction(reaction.type)}
                        className="transform transition-transform hover:scale-125 hover:-translate-y-1"
                        title={reaction.label}
                      >
                        <span className="text-2xl block">
                          {reaction.emoji}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Comentários */}
              <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span>💬</span>
                <span>{question.answersCount} respostas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Seção de Respostas (o resto permanece igual) */}
        <div className="space-y-6">
          {/* Melhor Resposta (se existir) */}
           {/* Melhor Resposta (se existir) */}
            {acceptedAnswer && (
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="text-yellow-500 mr-2">🏆</span>
                Melhor Resposta
                </h2>
                <AnswerCard 
                answer={acceptedAnswer} 
                isAccepted={true}
                canAccept={false}
                />
            </div>
            )}

          {/* Outras Respostas */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {answers.length} {answers.length === 1 ? 'Resposta' : 'Respostas'}
            </h2>
            <div className="space-y-4">
              {otherAnswers.map((answer) => (
                <AnswerCard 
                  key={answer.id}
                  answer={answer}
                  isAccepted={false}
                  onAccept={handleAcceptAnswer}
                  canAccept={true}
                />
              ))}
            </div>
          </div>

          {/* Formulário de Resposta */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sua Resposta
            </h3>
            <form onSubmit={handleSubmitAnswer}>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={!newAnswer.trim()}
                  className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Enviar Resposta
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};