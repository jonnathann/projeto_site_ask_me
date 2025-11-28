export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Answer {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  upvotes: number;
  isAccepted: boolean;
  reactions?: {
    type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
    count: number;
  }[];
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  answersCount: number;
  upvotes: number;
  tags: string[];
  isAnswered?: boolean;
  answers?: Answer[]; // Adicionamos as respostas aqui
  views?: number;
}