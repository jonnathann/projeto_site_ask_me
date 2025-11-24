# app/services/answer_ranking_service.py - NOVO ARQUIVO
from sqlalchemy.orm import Session
from app.models.answer import Answer
from app.models.reaction import Reaction
from app.models.comment import Comment
from datetime import datetime, timedelta

class AnswerRankingService:
    
    # Pesos do algoritmo
    REACTION_WEIGHT = 0.6      # 60% - Reações
    AUTHOR_ANSWER_WEIGHT = 0.2 # 20% - Resposta do autor da pergunta
    ENGAGEMENT_WEIGHT = 0.2    # 20% - Engajamento (comentários)
    
    @staticmethod
    def calculate_algorithm_score(answer: Answer, db: Session) -> float:
        """Calcula a pontuação do algoritmo para uma resposta"""
        total_score = 0.0
        
        # 1. PONTUAÇÃO POR REAÇÕES (60%)
        reaction_score = AnswerRankingService._calculate_reaction_score(answer, db)
        total_score += reaction_score * AnswerRankingService.REACTION_WEIGHT
        
        # 2. BÔNUS SE FOR RESPOSTA DO AUTOR DA PERGUNTA (20%)
        if answer.user_id == answer.question.user_id:
            total_score += 1.0 * AnswerRankingService.AUTHOR_ANSWER_WEIGHT
        
        # 3. PONTUAÇÃO POR ENGAGEMENT (20%)
        engagement_score = AnswerRankingService._calculate_engagement_score(answer, db)
        total_score += engagement_score * AnswerRankingService.ENGAGEMENT_WEIGHT
        
        return total_score
    
    @staticmethod
    def _calculate_reaction_score(answer: Answer, db: Session) -> float:
        """Calcula pontuação baseada em reações"""
        reactions = db.query(Reaction).filter(
            Reaction.content_type == 'answer',
            Reaction.content_id == answer.id
        ).all()
        
        if not reactions:
            return 0.0
        
        # Dar mais peso para reações positivas
        reaction_weights = {
            'like': 1.0,
            'love': 1.5,
            'haha': 0.8,
            'wow': 0.7,
            'sad': 0.3,
            'angry': 0.1
        }
        
        total_reaction_score = 0.0
        for reaction in reactions:
            total_reaction_score += reaction_weights.get(reaction.reaction_type, 0.5)
        
        # Normalizar para escala 0-1
        max_possible = len(reactions) * 1.5  # Assumindo todas como 'love'
        return min(total_reaction_score / max_possible, 1.0) if max_possible > 0 else 0.0
    
    @staticmethod
    def _calculate_engagement_score(answer: Answer, db: Session) -> float:
        """Calcula pontuação baseada em engajamento (comentários)"""
        comment_count = db.query(Comment).filter(
            Comment.answer_id == answer.id
        ).count()
        
        # Normalizar: 0 comentários = 0, 5+ comentários = 1.0
        return min(comment_count / 5.0, 1.0)
    
    @staticmethod
    def auto_accept_best_answer(question_id: int, db: Session):
        """Escolhe automaticamente a melhor resposta após 48h"""
        from app.models.question import Question
        from app.services.xp_service import XPService
        from app.services.badge_service import BadgeChecker
        
        question = db.query(Question).filter(Question.id == question_id).first()
        if not question:
            return None
        
        # Verificar se já passaram 48h
        time_since_question = datetime.utcnow() - question.created_at
        if time_since_question < timedelta(hours=48):
            return None  # Ainda não passou 48h
        
        # Verificar se já tem resposta aceita
        existing_accepted = db.query(Answer).filter(
            Answer.question_id == question_id,
            Answer.is_accepted == True
        ).first()
        
        if existing_accepted:
            return None  # Já tem resposta aceita
        
        # Buscar todas as respostas da pergunta
        answers = db.query(Answer).filter(Answer.question_id == question_id).all()
        if not answers:
            return None
        
        # Calcular score para cada resposta
        scored_answers = []
        for answer in answers:
            score = AnswerRankingService.calculate_algorithm_score(answer, db)
            scored_answers.append((answer, score))
        
        # Ordenar por score (maior primeiro) e desempatar por data (mais antiga primeiro)
        scored_answers.sort(key=lambda x: (-x[1], x[0].created_at))
        
        if scored_answers:
            best_answer, best_score = scored_answers[0]
            
            # Aceitar a melhor resposta
            best_answer.is_accepted = True
            best_answer.accepted_at = datetime.utcnow()
            best_answer.accepted_by = 'algorithm'
            best_answer.algorithm_score = best_score
            
            # 👇 DAR XP + BADGE PARA QUEM RESPONDEU
            xp_result = XPService.add_xp(db, best_answer.user_id, "answer_accepted", best_answer.id)
            
            # 👇 VERIFICAR BADGE DE RESPOSTA ACEITA
            BadgeChecker.check_badges(db, best_answer.user_id, "first_accepted_answer")
            
            db.commit()
            
            print(f"🤖 Algoritmo aceitou resposta {best_answer.id} com score {best_score:.2f}")
            return best_answer
        
        return None