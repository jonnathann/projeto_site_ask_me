// types/Search.ts
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  answersCount: number;
  upvotes: number;
  tags: string[];
  isAnswered: boolean;
  relevance?: number;
}

export type SearchSort = 'relevance' | 'newest' | 'votes' | 'answers';
export type TimeRange = 'all' | 'day' | 'week' | 'month' | 'year';

export interface SearchFilters {
  query: string;
  sortBy: SearchSort;
  tags: string[];
  timeRange: TimeRange;
  hasAcceptedAnswer: boolean | null;
  isUnanswered: boolean | null;
}