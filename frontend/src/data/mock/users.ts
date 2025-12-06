// src/data/mock/users.ts

export interface MockUser {
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

export const currentUser: MockUser = {
  id: 'current-user',
  name: 'Nuon',
  email: 'nuon@askme.com',
  avatar: 'https://cdn.worldvectorlogo.com/logos/nuon.svg',
  bio: 'Desenvolvedor full-stack apaixonado por tecnologia, games e compartilhar conhecimento. Sempre disposto a ajudar a comunidade! 🚀',
  location: 'São Paulo, Brasil',
  website: 'https://github.com/nuon',
  joinedDate: '2024-01-01',
  reputation: 1245,
  questionsCount: 24,
  answersCount: 156,
  upvotesReceived: 892,
  tags: ['react', 'typescript', 'nodejs', 'games', 'backend', 'frontend'],
  isOnline: true,
  lastSeen: 'Agora mesmo'
};

export const mockUsers: MockUser[] = [
  {
    id: 'user2',
    name: 'MariaDev',
    email: 'maria@example.com',
    avatar: 'https://i.postimg.cc/fW0bGZ1J/maria-flor321.png',
    bio: 'Frontend Developer | React & Vue.js',
    location: 'Rio de Janeiro, Brasil',
    website: 'https://mariadev.com',
    joinedDate: '2024-01-05',
    reputation: 876,
    questionsCount: 12,
    answersCount: 89,
    upvotesReceived: 543,
    tags: ['react', 'vue', 'javascript', 'frontend'],
    isOnline: true,
    lastSeen: 'Agora mesmo'
  },
  {
    id: 'user3',
    name: 'JoãoBackend',
    email: 'joao@example.com',
    avatar: 'https://ui-avatars.com/api/?name=JoãoBackend&background=10B981&color=fff',
    bio: 'Backend Specialist | Node.js & Python',
    location: 'Porto Alegre, Brasil',
    website: 'https://joaobackend.dev',
    joinedDate: '2024-01-03',
    reputation: 987,
    questionsCount: 8,
    answersCount: 112,
    upvotesReceived: 765,
    tags: ['nodejs', 'python', 'backend', 'api'],
    isOnline: false,
    lastSeen: '2 horas atrás'
  },
  {
    id: 'user4',
    name: 'AnaFullStack',
    email: 'ana@example.com',
    avatar: 'https://ui-avatars.com/api/?name=AnaFullStack&background=8B5CF6&color=fff',
    bio: 'Full Stack Developer | React & Node.js',
    location: 'Belo Horizonte, Brasil',
    website: 'https://anafullstack.com',
    joinedDate: '2024-01-08',
    reputation: 654,
    questionsCount: 15,
    answersCount: 76,
    upvotesReceived: 432,
    tags: ['react', 'nodejs', 'typescript', 'fullstack'],
    isOnline: true,
    lastSeen: 'Agora mesmo'
  },
  {
    id: 'user5',
    name: 'CarlosMobile',
    email: 'carlos@example.com',
    avatar: 'https://ui-avatars.com/api/?name=CarlosMobile&background=EF4444&color=fff',
    bio: 'Mobile Developer | React Native & Flutter',
    location: 'Curitiba, Brasil',
    website: 'https://carlosmobile.dev',
    joinedDate: '2024-01-12',
    reputation: 543,
    questionsCount: 9,
    answersCount: 67,
    upvotesReceived: 321,
    tags: ['react-native', 'flutter', 'mobile', 'ios', 'android'],
    isOnline: true,
    lastSeen: '30 minutos atrás'
  },
  {
    id: 'user6',
    name: 'LuizaGames',
    email: 'luiza@example.com',
    avatar: 'https://ui-avatars.com/api/?name=LuizaGames&background=F59E0B&color=fff',
    bio: 'Game Developer & Tech Enthusiast',
    location: 'Florianópolis, Brasil',
    website: 'https://luizagames.com',
    joinedDate: '2024-01-06',
    reputation: 432,
    questionsCount: 18,
    answersCount: 54,
    upvotesReceived: 298,
    tags: ['games', 'unity', 'c#', 'game-dev'],
    isOnline: false,
    lastSeen: '5 horas atrás'
  },
  {
    id: 'user7',
    name: 'PedroDevOps',
    email: 'pedro@example.com',
    avatar: 'https://ui-avatars.com/api/?name=PedroDevOps&background=6366F1&color=fff',
    bio: 'DevOps Engineer | AWS & Docker',
    location: 'Salvador, Brasil',
    website: 'https://pedrodevops.io',
    joinedDate: '2024-01-04',
    reputation: 765,
    questionsCount: 6,
    answersCount: 92,
    upvotesReceived: 567,
    tags: ['devops', 'aws', 'docker', 'kubernetes', 'ci-cd'],
    isOnline: true,
    lastSeen: 'Agora mesmo'
  },
  {
    id: 'user8',
    name: 'JuliaData',
    email: 'julia@example.com',
    avatar: 'https://ui-avatars.com/api/?name=JuliaData&background=8B5CF6&color=fff',
    bio: 'Data Scientist | Python & Machine Learning',
    location: 'Campinas, Brasil',
    website: 'https://juliadata.ai',
    joinedDate: '2024-01-09',
    reputation: 567,
    questionsCount: 11,
    answersCount: 78,
    upvotesReceived: 345,
    tags: ['python', 'machine-learning', 'data-science', 'ai'],
    isOnline: true,
    lastSeen: 'Agora mesmo'
  },
  {
    id: 'user9',
    name: 'RafaelUX',
    email: 'rafael@example.com',
    avatar: 'https://ui-avatars.com/api/?name=RafaelUX&background=EC4899&color=fff',
    bio: 'UX/UI Designer | Figma & Design Systems',
    location: 'Recife, Brasil',
    website: 'https://rafaelux.design',
    joinedDate: '2024-01-11',
    reputation: 432,
    questionsCount: 7,
    answersCount: 45,
    upvotesReceived: 234,
    tags: ['design', 'figma', 'ui', 'ux', 'web-design'],
    isOnline: false,
    lastSeen: '3 horas atrás'
  }
];

// Exportar tudo de uma vez
export default {
  currentUser,
  mockUsers
};