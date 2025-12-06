// src/data/constants/app.ts

// Configurações gerais do app
export const APP_CONFIG = {
  APP_NAME: 'Ask Me',
  APP_DESCRIPTION: 'A comunidade onde conhecimento é compartilhado',
  MAX_TAGS_PER_QUESTION: 5,
  MAX_TITLE_LENGTH: 120,
  DEMO_CREDENTIALS: {
    email: 'demo@askme.com',
    password: 'demo123'
  }
};

// Categorias para organização
export const CATEGORIES = [
  { name: 'Tecnologia', icon: '💻', count: 8 },
  { name: 'Programação', icon: '👨‍💻', count: 10 },
  { name: 'Frontend', icon: '🎨', count: 6 },
  { name: 'Backend', icon: '⚙️', count: 4 },
  { name: 'Mobile', icon: '📱', count: 3 },
  { name: 'Games', icon: '🎮', count: 2 },
  { name: 'Carreira', icon: '💼', count: 3 },
  { name: 'Estudos', icon: '📚', count: 4 }
];

// Tags populares sugeridas
export const SUGGESTED_TAGS = [
  'programação', 'react', 'javascript', 'typescript', 'nodejs',
  'web', 'mobile', 'design', 'carreira', 'dúvida', 'ajuda',
  'tecnologia', 'games', 'estudos', 'trabalho'
];