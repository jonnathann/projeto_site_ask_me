// src/data/mock/questions.ts
import { Question } from '../../types/Question';

export const initialMockQuestions: Question[] = [
  {
    id: 'question-1',
    title: 'De zero a dez o quanto vcs gostam do super nintendo?',
    content: 'Estou fazendo uma pesquisa sobre consoles clássicos e queria saber a opinião de vocês sobre o Super Nintendo. Qual nota dariam de 0 a 10?',
    author: { 
      id: 'user1', 
      name: 'nuon',
      avatar: 'https://cdn.worldvectorlogo.com/logos/nuon.svg'
    },
    createdAt: '2024-01-15',
    answersCount: 8,
    upvotes: 15,
    tags: ['games', 'retro', 'super-nintendo'],
    isAnswered: true
  },
  {
    id: 'question-2',
    title: 'Já teve a experiência de ter um(a) amigo(a) da onça, vulgo coxinha?',
    content: 'Pessoal, já tiveram aquela experiência de ter um "amigo" que na verdade era falso? Como foi e como lidaram com a situação?',
    author: { 
      id: 'user2', 
      name: 'Mariaflor321',
      avatar: 'https://i.postimg.cc/fW0bGZ1J/maria-flor321.png'
    },
    createdAt: '2024-01-14',
    answersCount: 12,
    upvotes: 23,
    tags: ['amizade', 'relacionamentos', 'conselhos'],
    isAnswered: false
  },
  {
    id: 'question-3',
    title: 'A mãe de vocês cozinha bem?',
    content: 'Fala galera! Tava aqui pensando... a mãe de vocês cozinha bem? Aqui em casa é hit or miss, as vezes é banquete, as vezes é sobrevivência kkk',
    author: { 
      id: 'user3', 
      name: 'l450',
      avatar: 'https://i.postimg.cc/k4vT4LpD/l450.png'
    },
    createdAt: '2024-01-13',
    answersCount: 25,
    upvotes: 42,
    tags: ['família', 'culinária', 'humor'],
    isAnswered: false
  }
];

export const relatedQuestions: Question[] = [
  {
    id: 'question-4',
    title: 'Qual seu jogo de SNES favorito?',
    content: 'Me conta qual jogo do Super Nintendo marcou mais sua infância!',
    author: { id: 'user7', name: 'Gamer123' },
    createdAt: '2024-01-12',
    answersCount: 5,
    upvotes: 18,
    tags: ['games', 'snes', 'nostalgia'],
    isAnswered: false
  },
  {
    id: 'question-5',
    title: 'Vale a pena comprar um SNES hoje em dia?',
    content: 'Tô pensando em comprar um Super Nintendo original, mas não sei se vale a pena...',
    author: { id: 'user8', name: 'RetroCollector' },
    createdAt: '2024-01-11',
    answersCount: 7,
    upvotes: 12,
    tags: ['games', 'retro', 'coleção'],
    isAnswered: true
  },
  {
    id: 'question-6',
    title: 'Como conectar SNES em TV moderna?',
    content: 'Alguém sabe como conectar um Super Nintendo em uma TV LED moderna?',
    author: { id: 'user9', name: 'TechHelper' },
    createdAt: '2024-01-10',
    answersCount: 3,
    upvotes: 9,
    tags: ['games', 'tecnologia', 'snes'],
    isAnswered: false
  }
];

export const mockQuestionDetails: Question[] = [
  {
    id: 'question-1',
    title: 'De zero a dez o quanto vcs gostam do super nintendo?',
    content: 'Estou fazendo uma pesquisa sobre consoles clássicos e queria saber a opinião de vocês sobre o Super Nintendo. Eu particularmente dou 9/10 - os gráficos eram incríveis para a época e a biblioteca de jogos é fantástica! Qual nota vocês dariam de 0 a 10?',
    author: { 
      id: 'user1', 
      name: 'Nuon',
      avatar: 'https://cdn.worldvectorlogo.com/logos/nuon.svg'
    },
    createdAt: '2024-01-15',
    answersCount: 3,
    upvotes: 15,
    tags: ['games', 'retro', 'super-nintendo', 'nostalgia'],
    isAnswered: true,
    views: 142,
    answers: [
      {
        id: 'answer-1',
        content: 'Eu dou 10/10 fácil! O Super Nintendo foi minha infância toda. Jogos como Super Mario World, Donkey Kong Country e Zelda: A Link to the Past são atemporais. A Nintendo acertou em cheio com esse console!',
        author: { id: 'user4', name: 'GameLover' },
        createdAt: '2024-01-15',
        upvotes: 8,
        isAccepted: true
      },
      {
        id: 'answer-2',
        content: 'Daria 8/10. Os jogos são incríveis, mas acho que o controle poderia ser mais ergonômico. Fora isso, é um console fantástico que envelheceu muito bem!',
        author: { id: 'user5', name: 'RetroPlayer' },
        createdAt: '2024-01-16',
        upvotes: 5,
        isAccepted: false
      },
      {
        id: 'answer-3',
        content: '10/10 sem dúvidas! Até hoje jogo Super Metroid e Chrono Trigger. A qualidade dos RPGs da era SNES é insuperável na minha opinião.',
        author: { id: 'user6', name: 'RPGMaster' },
        createdAt: '2024-01-17',
        upvotes: 12,
        isAccepted: false
      }
    ]
  }
];

export default {
  initialMockQuestions,
  relatedQuestions,
  mockQuestionDetails
};