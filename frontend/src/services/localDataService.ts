// services/localDataService.ts
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  joinedAt: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  tags: string[];
  upvotes: string[]; // IDs de usuários que votaram
  views: number;
  isAnswered: boolean;
}

export interface Answer {
  id: string;
  content: string;
  authorId: string;
  questionId: string;
  createdAt: string;
  upvotes: string[];
  isAccepted: boolean;
}

class LocalDataService {
  // CHAVES DO LOCALSTORAGE
  private USERS_KEY = 'askme_users_v1';
  private QUESTIONS_KEY = 'askme_questions_v1';
  private ANSWERS_KEY = 'askme_answers_v1';
  
  // ====== USUÁRIOS ======
  getUsers(): User[] {
    const stored = localStorage.getItem(this.USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  addUser(userData: Omit<User, 'id' | 'joinedAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      joinedAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return newUser;
  }
  
  getUser(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }
  
  // ====== PERGUNTAS ======
  getQuestions(): Question[] {
    const stored = localStorage.getItem(this.QUESTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  addQuestion(questionData: Omit<Question, 'id' | 'createdAt' | 'upvotes' | 'views' | 'isAnswered'>): Question {
    const questions = this.getQuestions();
    const newQuestion: Question = {
      ...questionData,
      id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      upvotes: [],
      views: 0,
      isAnswered: false,
    };
    
    questions.push(newQuestion);
    localStorage.setItem(this.QUESTIONS_KEY, JSON.stringify(questions));
    return newQuestion;
  }
  
  // ====== RESPOSTAS ======
  getAnswers(): Answer[] {
    const stored = localStorage.getItem(this.ANSWERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  addAnswer(answerData: Omit<Answer, 'id' | 'createdAt' | 'upvotes' | 'isAccepted'>): Answer {
    const answers = this.getAnswers();
    const newAnswer: Answer = {
      ...answerData,
      id: `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      upvotes: [],
      isAccepted: false,
    };
    
    answers.push(newAnswer);
    localStorage.setItem(this.ANSWERS_KEY, JSON.stringify(answers));
    return newAnswer;
  }
  
  // ====== LIMPEZA ======
  clearAll() {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.QUESTIONS_KEY);
    localStorage.removeItem(this.ANSWERS_KEY);
  }
}

export const localDataService = new LocalDataService();