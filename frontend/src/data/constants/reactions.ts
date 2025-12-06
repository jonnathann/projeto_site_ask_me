// src/data/constants/reactions.ts

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry' | null;

export interface ReactionOption {
  type: ReactionType;
  emoji: string;
  label: string;
  color: string;
}

export const REACTIONS: ReactionOption[] = [
  { type: 'like', emoji: '👍', label: 'Curtir', color: 'text-blue-500' },
  { type: 'love', emoji: '❤️', label: 'Amei', color: 'text-red-500' },
  { type: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
  { type: 'wow', emoji: '😮', label: 'Uau', color: 'text-yellow-500' },
  { type: 'sad', emoji: '😢', label: 'Triste', color: 'text-yellow-500' },
  { type: 'angry', emoji: '😠', label: 'Bravo', color: 'text-red-600' },
];

// Helper para encontrar reaction por type
export const getReactionByType = (type: ReactionType): ReactionOption | undefined => {
  return REACTIONS.find(r => r.type === type);
};