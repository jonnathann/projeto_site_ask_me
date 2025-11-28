import { useState } from 'react';
import { Answer } from '../../types/Question';

type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry' | null;

const reactions = [
  { type: 'like' as ReactionType, emoji: '👍', label: 'Curtir', color: 'text-blue-500' },
  { type: 'love' as ReactionType, emoji: '❤️', label: 'Amei', color: 'text-red-500' },
  { type: 'haha' as ReactionType, emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
  { type: 'wow' as ReactionType, emoji: '😮', label: 'Uau', color: 'text-yellow-500' },
  { type: 'sad' as ReactionType, emoji: '😢', label: 'Triste', color: 'text-yellow-500' },
  { type: 'angry' as ReactionType, emoji: '😠', label: 'Bravo', color: 'text-red-600' },
];

interface AnswerCardProps {
  answer: Answer;
  isAccepted?: boolean;
  onAccept?: (answerId: string) => void;
  canAccept?: boolean;
}

export const AnswerCard = ({ answer, isAccepted, onAccept, canAccept = false }: AnswerCardProps) => {
  const [upvotes, setUpvotes] = useState(answer.upvotes);
  const [userReaction, setUserReaction] = useState<ReactionType>(null);
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = (reactionType: ReactionType) => {
    const previousReaction = userReaction;
    
    if (previousReaction && previousReaction !== reactionType) {
      setUpvotes(upvotes - 1);
    }
    
    if (reactionType && reactionType !== previousReaction) {
      setUpvotes(upvotes + 1);
    }
    
    if (reactionType === previousReaction) {
      setUpvotes(upvotes - 1);
      setUserReaction(null);
    } else {
      setUserReaction(reactionType);
    }
    
    setShowReactions(false);
  };

  const currentReaction = reactions.find(r => r.type === userReaction);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-6 transition-all ${
      isAccepted ? 'border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700'
    }`}>
      {/* Header da Resposta */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {answer.author.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{answer.author.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{answer.createdAt}</p>
          </div>
        </div>
        
        {/* Badge de Melhor Resposta - AGORA COM TROFÉU 🏆 */}
        {isAccepted && (
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-full font-medium flex items-center space-x-1">
            <span>🏆</span>
            <span>Melhor Resposta</span>
          </span>
        )}
      </div>

      {/* Conteúdo da Resposta */}
      <div className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        {answer.content}
      </div>

      {/* Footer da Resposta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Reactions */}
          <div className="relative">
            <button 
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
              className={`flex items-center space-x-1 p-2 rounded-lg transition-all ${
                userReaction 
                  ? `${currentReaction?.color} bg-gray-100 dark:bg-gray-700` 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">
                {userReaction ? currentReaction?.emoji : '👍'}
              </span>
              <span className={`font-medium ${
                userReaction ? currentReaction?.color : ''
              }`}>
                {upvotes}
              </span>
            </button>

            {/* Paleta de Reactions */}
            {showReactions && (
              <div 
                className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex space-x-1 z-10"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
              >
                {reactions.map((reaction) => (
                  <button
                    key={reaction.type}
                    onClick={() => handleReaction(reaction.type)}
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

          {/* Botão de Escolher Melhor Resposta (apenas para o autor da pergunta) */}
          {canAccept && !isAccepted && (
            <button 
              onClick={() => onAccept?.(answer.id)}
              className="px-3 py-1 border border-yellow-600 text-yellow-600 dark:text-yellow-400 dark:border-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-colors flex items-center space-x-1"
            >
              <span>🏆</span>
              <span>Escolher como Melhor</span>
            </button>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
          <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Responder
          </button>
          <button className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
            Denunciar
          </button>
        </div>
      </div>
    </div>
  );
};