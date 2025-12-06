// src/hooks/useEmojiPicker.ts
import { useState } from 'react';
import { EMOJI_CATEGORIES, EmojiCategory } from '../data/constants/emojis';

export const useEmojiPicker = (initialCategory: EmojiCategory = 'Carinhas') => {
  const [showPicker, setShowPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState<EmojiCategory>(initialCategory);

  const togglePicker = () => {
    setShowPicker(prev => !prev);
  };

  const hidePicker = () => {
    setShowPicker(false);
  };

  const changeCategory = (category: EmojiCategory) => {
    setActiveCategory(category);
  };

  const insertEmoji = (text: string, emoji: string, cursorPosition: number): string => {
    return text.slice(0, cursorPosition) + emoji + text.slice(cursorPosition);
  };

  const getEmojis = () => {
    return EMOJI_CATEGORIES[activeCategory] || [];
  };

  const getCategories = (): EmojiCategory[] => {
    return Object.keys(EMOJI_CATEGORIES) as EmojiCategory[];
  };

  return {
    showPicker,
    activeCategory,
    togglePicker,
    hidePicker,
    changeCategory,
    insertEmoji,
    getEmojis,
    getCategories
  };
};