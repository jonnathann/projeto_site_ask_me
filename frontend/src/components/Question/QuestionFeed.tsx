import { useState } from 'react';
import { QuestionCard } from './QuestionCard';
import { Question } from '../../types/Question';

// Dados Mocados
const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'De zero a dez o quanto vcs gostam do super nintendo?',
    content: 'Estou fazendo uma pesquisa sobre consoles clássicos e queria saber a opinião de vocês sobre o Super Nintendo. Qual nota dariam de 0 a 10?',
    author: { 
      id: '1', 
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
    id: '2',
    title: 'Já teve a experiência de ter um(a) amigo(a) da onça, vulgo coxinha?',
    content: 'Pessoal, já tiveram aquela experiência de ter um "amigo" que na verdade era falso? Como foi e como lidaram com a situação?',
    author: { 
      id: '2', 
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
    id: '3',
    title: 'A mãe de vocês cozinha bem?',
    content: 'Fala galera! Tava aqui pensando... a mãe de vocês cozinha bem? Aqui em casa é hit or miss, as vezes é banquete, as vezes é sobrevivência kkk',
    author: { 
      id: '3', 
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

export const QuestionFeed = () => {
  const [questions] = useState<Question[]>(mockQuestions);

  return (
    // ⬇️⬇️⬇️ ADICIONE ESTE MAIN ⬇️⬇️⬇️
    <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header do Feed */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Perguntas Recentes</h1>
            <p className="text-gray-600 dark:text-gray-300">Encontre respostas para suas dúvidas ou ajude outros</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
            Fazer Pergunta
          </button>
        </div>

        {/* Filtros */}
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg text-sm font-medium">
            Todas
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Sem resposta
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Mais votadas
          </button>
        </div>

        {/* Lista de Perguntas */}
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>

        {/* Carregar Mais */}
        <div className="flex justify-center">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Carregar mais perguntas
          </button>
        </div>
      </div>
    </main>
    // ⬆️⬆️⬆️ FIM DO MAIN ⬆️⬆️⬆️
  );
};