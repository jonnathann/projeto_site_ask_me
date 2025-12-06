// src/pages/QuestionPage/QuestionPage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question, Answer } from '../../types/Question';
import { AnswerCard } from '../../components/Question/AnswerCard';
import { useReactions } from '../../hooks/useReactions';
import { useEmojiPicker } from '../../hooks/useEmojiPicker';
import { REACTIONS, getReactionByType } from '../../data/constants/reactions';
import { mockQuestionDetails, relatedQuestions } from '../../data/mock/questions';

// Dados mockados para a página individual
const mockQuestion: Question = mockQuestionDetails[0];

export const QuestionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question] = useState<Question>(mockQuestion);
  const [newAnswer, setNewAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>(mockQuestion.answers || []);
  
  // Usando hooks personalizados
  const { 
    count: questionUpvotes, 
    userReaction: questionReaction, 
    showPicker: showQuestionReactions, 
    handleReaction: handleQuestionReaction, 
    setShowPicker: setShowQuestionReactions 
  } = useReactions({ 
    initialCount: question.upvotes 
  });

  const {
    showPicker: showEmojiPicker,
    activeCategory,
    togglePicker: toggleEmojiPicker,
    hidePicker: hideEmojiPicker,
    changeCategory,
    insertEmoji,
    getEmojis,
    getCategories
  } = useEmojiPicker();

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
      id: `answer-${Date.now()}`,
      content: newAnswer,
      author: { id: 'current-user', name: 'Você' },
      createdAt: new Date().toISOString().split('T')[0],
      upvotes: 0,
      isAccepted: false
    };

    setAnswers([...answers, newAnswerObj]);
    setNewAnswer('');
    hideEmojiPicker();
  };

  const handleInsertEmoji = (emoji: string) => {
    setNewAnswer(prev => prev + emoji);
  };

  const currentQuestionReaction = getReactionByType(questionReaction);
  const acceptedAnswer = answers.find(answer => answer.isAccepted);
  const otherAnswers = answers.filter(answer => !answer.isAccepted);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          
          {/* Coluna principal (esquerda) */}
          <div className="flex-1">
            {/* Cabeçalho da Pergunta */}
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
                        {REACTIONS.map((reaction) => (
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

            {/* FORMULÁRIO DE RESPOSTA - AGORA NO TOPO (acima das respostas) */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ✍️ Sua Resposta
              </h3>
              <form onSubmit={handleSubmitAnswer}>
                <div className="relative">
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Compartilhe sua resposta... Use emojis para deixar mais expressiva! 😊"
                    className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  />
                  
                  {/* Botão de Emoji */}
                  <button
                    type="button"
                    onClick={toggleEmojiPicker}
                    className="absolute bottom-3 right-3 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    title="Inserir emoji"
                  >
                    😊
                  </button>
                </div>

                {/* Paleta de Emojis */}
                {showEmojiPicker && (
                  <div className="mt-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4">
                    {/* Categorias de Emojis */}
                    <div className="flex space-x-2 mb-3 border-b border-gray-200 dark:border-gray-600 pb-2">
                      {getCategories().map((category) => (
                        <button
                          key={category}
                          onClick={() => changeCategory(category)}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            activeCategory === category
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    {/* Grid de Emojis */}
                    <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto">
                      {getEmojis().map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleInsertEmoji(emoji)}
                          className="text-lg hover:bg-gray-100 dark:hover:bg-gray-600 rounded p-1 transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {newAnswer.length > 0 && (
                      <span>{newAnswer.length} caracteres</span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!newAnswer.trim()}
                    className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <span>📤</span>
                    <span>Enviar Resposta</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Seção de Respostas - ABAIXO DO FORMULÁRIO */}
            <div className="space-y-6">
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
                    key={question.id} 
                    className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-gray-100 dark:border-gray-600"
                    onClick={() => navigate(`/question/${question.id}`)}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                      {question.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{question.answersCount} respostas</span>
                      <span>{question.upvotes} 👍</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {question.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
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
                  📊 Estatísticas
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Visualizações:</span>
                    <span className="font-semibold">{question.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Respostas:</span>
                    <span className="font-semibold">{question.answersCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reações:</span>
                    <span className="font-semibold">{questionUpvotes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};