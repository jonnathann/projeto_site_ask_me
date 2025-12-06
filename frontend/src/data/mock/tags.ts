// src/data/mock/tags.ts
import { Tag } from '../../types/Tag';

export const mockTags: Tag[] = [
  {
    id: 'tag-1',
    name: 'react',
    description: 'Biblioteca JavaScript para construção de interfaces de usuário',
    questionCount: 1245,
    followers: 892,
    isFollowing: true,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    icon: '⚛️',
    lastActivity: '2024-01-15',
    createdAt: '2023-03-10'
  },
  {
    id: 'tag-2',
    name: 'typescript',
    description: 'Superset de JavaScript com tipagem estática',
    questionCount: 892,
    followers: 567,
    isFollowing: false,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    icon: '📘',
    lastActivity: '2024-01-14',
    createdAt: '2023-04-22'
  },
  {
    id: 'tag-3',
    name: 'javascript',
    description: 'Linguagem de programação para web development',
    questionCount: 2345,
    followers: 1456,
    isFollowing: true,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    icon: '🟨',
    lastActivity: '2024-01-15',
    createdAt: '2023-01-15'
  },
  {
    id: 'tag-4',
    name: 'nodejs',
    description: 'Runtime JavaScript no lado do servidor',
    questionCount: 567,
    followers: 345,
    isFollowing: false,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    icon: '🟢',
    lastActivity: '2024-01-13',
    createdAt: '2023-05-30'
  },
  {
    id: 'tag-5',
    name: 'nextjs',
    description: 'Framework React para produção com renderização server-side',
    questionCount: 432,
    followers: 278,
    isFollowing: true,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    icon: '⚡',
    lastActivity: '2024-01-14',
    createdAt: '2023-06-12'
  },
  {
    id: 'tag-6',
    name: 'tailwind',
    description: 'Framework CSS utility-first',
    questionCount: 789,
    followers: 456,
    isFollowing: false,
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    icon: '🎨',
    lastActivity: '2024-01-12',
    createdAt: '2023-07-18'
  }
];

// Tags populares para sugestão
export const popularTags = [
  { name: 'react', count: 1245, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  { name: 'typescript', count: 892, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  { name: 'javascript', count: 2345, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  { name: 'nodejs', count: 567, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  { name: 'nextjs', count: 432, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
  { name: 'tailwind', count: 789, color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300' },
  { name: 'web', count: 1123, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' },
  { name: 'mobile', count: 456, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
  { name: 'games', count: 678, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
  { name: 'estudos', count: 345, color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' },
];

export default {
  mockTags,
  popularTags
};