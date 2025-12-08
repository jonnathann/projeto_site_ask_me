// services/questions/questionService.ts
import { localDataService } from '../localDataService';
import { Question as QuestionType } from '../localDataService';

export interface CreateQuestionRequest {
  title: string;
  content: string;
  tags: string[];
}

export interface QuestionFilters {
  page?: number;
  limit?: number;
  tag?: string;
}

export interface QuestionsResponse {
  questions: Array<QuestionType & { author: any }>;
  total: number;
  page: number;
  totalPages: number;
}

export const questionService = {
  // CRIAR PERGUNTA
  async createQuestion(data: CreateQuestionRequest) {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) throw new Error('Não autenticado');
    
    const question = localDataService.addQuestion({
      title: data.title,
      content: data.content,
      authorId: currentUserId,
      tags: data.tags,
    });
    
    const author = localDataService.getUser(question.authorId);
    
    return {
      ...question,
      author: author || { id: currentUserId, name: 'Usuário', avatar: '👤' },
    };
  },

  // OBTER PERGUNTAS
  async getQuestions(filters: QuestionFilters = {}) {
    let questions = localDataService.getQuestions();
    
    // Filtrar por tag se especificado
    if (filters.tag) {
      questions = questions.filter(q => 
        q.tags.some(tag => tag.toLowerCase().includes(filters.tag!.toLowerCase()))
      );
    }
    
    // Adicionar autor a cada pergunta
    const questionsWithAuthors = questions.map(question => ({
      ...question,
      author: localDataService.getUser(question.authorId) || 
             { id: question.authorId, name: 'Usuário', avatar: '👤' },
    }));
    
    // Paginação simples
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      questions: questionsWithAuthors.slice(start, end),
      total: questionsWithAuthors.length,
      page,
      totalPages: Math.ceil(questionsWithAuthors.length / limit),
    };
  },

  // OBTER PERGUNTA POR ID
  async getQuestionById(id: string) {
    const questions = localDataService.getQuestions();
    const question = questions.find(q => q.id === id);
    
    if (!question) {
      throw new Error('Pergunta não encontrada');
    }
    
    const author = localDataService.getUser(question.authorId);
    const answers = localDataService.getAnswers().filter(a => a.questionId === id);
    
    // Adicionar autores às respostas
    const answersWithAuthors = answers.map(answer => ({
      ...answer,
      author: localDataService.getUser(answer.authorId) || 
             { id: answer.authorId, name: 'Usuário', avatar: '👤' },
    }));
    
    return {
      ...question,
      author: author || { id: question.authorId, name: 'Usuário', avatar: '👤' },
      answers: answersWithAuthors,
    };
  },

  // ADICIONAR RESPOSTA
  async addAnswer(questionId: string, content: string) {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) throw new Error('Não autenticado');
    
    const answer = localDataService.addAnswer({
      content,
      authorId: currentUserId,
      questionId,
    });
    
    const author = localDataService.getUser(answer.authorId);
    
    return {
      ...answer,
      author: author || { id: currentUserId, name: 'Usuário', avatar: '👤' },
    };
  },

  // VOTAR EM PERGUNTA
  async voteQuestion(questionId: string, voteType: 'up' | 'down') {
    // Implementação simples
    console.log(`Voto ${voteType} na pergunta ${questionId}`);
    return { success: true };
  },
};