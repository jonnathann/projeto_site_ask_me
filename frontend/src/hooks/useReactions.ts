// src/hooks/useReactions.ts
import { useState } from 'react';
import { ReactionType } from '../data/constants/reactions';

interface UseReactionsProps {
  initialCount: number;
  initialReaction?: ReactionType;
}

export const useReactions = ({ initialCount, initialReaction = null }: UseReactionsProps) => {
  const [count, setCount] = useState(initialCount);
  const [userReaction, setUserReaction] = useState<ReactionType>(initialReaction);
  const [showPicker, setShowPicker] = useState(false);

  const handleReaction = (reactionType: ReactionType) => {
    const previousReaction = userReaction;
    
    // Remove a reaction anterior se existir
    if (previousReaction && previousReaction !== reactionType) {
      setCount(prev => prev - 1);
    }
    
    // Adiciona a nova reaction
    if (reactionType && reactionType !== previousReaction) {
      setCount(prev => prev + 1);
    }
    
    // Se clicar na mesma reaction, remove
    if (reactionType === previousReaction) {
      setCount(prev => prev - 1);
      setUserReaction(null);
    } else {
      setUserReaction(reactionType);
    }
    
    setShowPicker(false);
  };

  const togglePicker = () => {
    setShowPicker(prev => !prev);
  };

  const hidePicker = () => {
    setShowPicker(false);
  };

  return {
    count,
    userReaction,
    showPicker,
    handleReaction,
    togglePicker,
    hidePicker,
    setShowPicker
  };
};