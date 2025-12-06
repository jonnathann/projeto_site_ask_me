// src/components/Question/QuestionCard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from '../../types/Question';
import { useReactions } from '../../hooks/useReactions';
import { REACTIONS, getReactionByType } from '../../data/constants/reactions';

interface QuestionCardProps {
  question: Question;
}

// Função para gerar cor baseada no nome do usuário
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-orange-500', 'bg-teal-500',
    'bg-red-500', 'bg-indigo-500', 'bg-yellow-500'
  ];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Função para gerar iniciais
const getInitials = (name: string) => {
  return name.charAt(0).toUpperCase();
};

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const navigate = useNavigate();
  const avatarColor = getAvatarColor(question.author.name);
  const initials = getInitials(question.author.name);
  
  // Usando hook personalizado para reactions
  const { 
    count: upvotes, 
    userReaction, 
    showPicker, 
    handleReaction, 
    setShowPicker 
  } = useReactions({ 
    initialCount: question.upvotes 
  });

  const handleQuestionClick = () => {
    navigate(`/question/${question.id}`);
  };

  // Encontra a reaction atual do usuário
  const currentReaction = getReactionByType(userReaction);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6 hover:shadow-lg dark:hover:shadow-gray-800 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {question.author.avatar ? (
            <img 
              src={question.author.avatar} 
              alt={question.author.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
          ) : (
            <div className={`w-10 h-10 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
              {initials}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{question.author.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{question.createdAt}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {question.isAnswered && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
              Resolvida
            </span>
          )}
        </div>
      </div>

      {/* Content - CLICÁVEL */}
      <h3 
        onClick={handleQuestionClick}
        className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
      >
        {question.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {question.content}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map((tag) => (
          <span 
            key={tag}
            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-md"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer - COM REACTIONS FUNCIONAIS */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          {/* Botão de Reactions */}
          <div className="relative">
            <button 
              onMouseEnter={() => setShowPicker(true)}
              onMouseLeave={() => setTimeout(() => setShowPicker(false), 300)}
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

            {/* Paleta de Reactions (aparece ao hover) */}
            {showPicker && (
              <div 
                className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex space-x-1 z-10"
                onMouseEnter={() => setShowPicker(true)}
                onMouseLeave={() => setTimeout(() => setShowPicker(false), 300)}
              >
                {REACTIONS.map((reaction) => (
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

          {/* Comentários */}
          <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span>💬</span>
            <span>{question.answersCount} respostas</span>
          </button>
        </div>
        
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          Responder
        </button>
      </div>

      {/* Contadores de Reactions (opcional - estilo Facebook) */}
      <div className="mt-2 flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex -space-x-1">
          {REACTIONS
            .filter(reaction => reaction.type && Math.random() > 0.5) // Simulação
            .slice(0, 3)
            .map(reaction => (
              <span key={reaction.type} className="text-sm">
                {reaction.emoji}
              </span>
            ))
          }
        </div>
        <span>{upvotes} reações</span>
      </div>
    </div>
  );
};