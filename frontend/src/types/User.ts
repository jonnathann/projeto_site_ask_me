// types/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinedDate: string;
  reputation: number;
  questionsCount: number;
  answersCount: number;
  upvotesReceived: number;
  tags: string[];
  isOnline: boolean;
  lastSeen: string;
}

export interface Friend {
  id: string;
  user: User;
  friendshipDate: string;
  mutualFriends: number;
  commonTags: string[];
}

export interface UserStats {
  totalQuestions: number;
  totalAnswers: number;
  acceptedAnswers: number;
  upvotesReceived: number;
  upvotesGiven: number;
  daysActive: number;
  streak: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedDate: string;
}

export type ProfileTab = 'questions' | 'answers' | 'friends' | 'activity' | 'badges';