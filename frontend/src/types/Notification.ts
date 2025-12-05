// frontend/src/types/Notification.ts
export type NotificationType = 
  | 'question_answered' 
  | 'new_follower' 
  | 'mention' 
  | 'upvote' 
  | 'badge_earned' 
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
  questionId?: string;
  answerId?: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  metadata?: Record<string, any>;
}