// types/Tag.ts
export interface Tag {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  followers: number;
  isFollowing: boolean;
  color: string;
  icon: string;
  lastActivity: string;
  createdAt: string;
}

export type TagSort = 'popular' | 'name' | 'new' | 'followers';