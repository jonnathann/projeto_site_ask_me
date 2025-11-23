# app/services/badge_service.py - ADICIONAR ESTA CLASSE
from sqlalchemy.orm import Session
from app.models.badge import Badge
from app.models.user_badge import UserBadge
from app.models.user import User

class BadgeChecker:
    
    # Mapeamento de ações para critérios de badges
    ACTION_TO_CRITERIA = {
        "create_question": ["first_question", "question_count"],
        "create_answer": ["first_answer", "answer_count"], 
        "create_comment": ["first_comment", "comment_count"],
        "receive_reaction": ["first_reaction", "reaction_count"],
        "answer_accepted": ["first_accepted_answer", "accepted_answer_count"]
    }
    
    @staticmethod
    def check_badges(db: Session, user_id: int, action: str, count: int = 1):
        """Verifica e concede badges baseado na ação do usuário"""
        
        # Verificar quais critérios devem ser verificados para esta ação
        criteria_to_check = BadgeChecker.ACTION_TO_CRITERIA.get(action, [])
        
        if not criteria_to_check:
            return []  # Nenhum badge para esta ação
        
        # Buscar badges que correspondem aos critérios
        badges_to_check = db.query(Badge).filter(
            Badge.criteria.in_(criteria_to_check)
        ).all()
        
        new_badges = []
        
        for badge in badges_to_check:
            # Buscar ou criar UserBadge
            user_badge = db.query(UserBadge).filter(
                UserBadge.user_id == user_id,
                UserBadge.badge_id == badge.id
            ).first()
            
            if user_badge and user_badge.progress >= badge.requirement:
                continue  # Já conquistou esta badge
            
            if not user_badge:
                # Primeira vez verificando esta badge
                user_badge = UserBadge(
                    user_id=user_id,
                    badge_id=badge.id,
                    progress=count
                )
                db.add(user_badge)
            else:
                # Atualizar progresso
                user_badge.progress += count
            
            db.flush()  # Para garantir que temos o ID
            
            # Verificar se conquistou a badge
            if user_badge.progress >= badge.requirement:
                new_badges.append({
                    "badge": badge,
                    "user_badge": user_badge
                })
                
                # Buscar usuário para log
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    print(f"🎉 {user.name} conquistou o badge: {badge.name}!")
                
        db.commit()
        return new_badges
    
    @staticmethod
    def check_all_badges(db: Session, user_id: int):
        """Verifica TODAS as badges possíveis para um usuário"""
        from app.models.question import Question
        from app.models.answer import Answer
        from app.models.comment import Comment
        from app.models.reaction import Reaction
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return []
        
        # Contar estatísticas do usuário
        question_count = db.query(Question).filter(Question.user_id == user_id).count()
        answer_count = db.query(Answer).filter(Answer.user_id == user_id).count()
        comment_count = db.query(Comment).filter(Comment.user_id == user_id).count()
        
        # Contar reações recebidas (mais complexo)
        reaction_count = 0
        # Reações em perguntas do usuário
        user_questions = db.query(Question).filter(Question.user_id == user_id).all()
        for question in user_questions:
            reaction_count += db.query(Reaction).filter(
                Reaction.content_type == 'question',
                Reaction.content_id == question.id
            ).count()
        
        # Reações em respostas do usuário
        user_answers = db.query(Answer).filter(Answer.user_id == user_id).all()
        for answer in user_answers:
            reaction_count += db.query(Reaction).filter(
                Reaction.content_type == 'answer', 
                Reaction.content_id == answer.id
            ).count()
        
        # Verificar badges baseado nas contagens
        all_new_badges = []
        
        # Badge de primeira pergunta
        if question_count >= 1:
            all_new_badges.extend(BadgeChecker.check_badges(db, user_id, "create_question", question_count))
        
        # Badge de primeira resposta
        if answer_count >= 1:
            all_new_badges.extend(BadgeChecker.check_badges(db, user_id, "create_answer", answer_count))
        
        # Badge de primeiro comentário
        if comment_count >= 1:
            all_new_badges.extend(BadgeChecker.check_badges(db, user_id, "create_comment", comment_count))
        
        # Badge de primeira reação
        if reaction_count >= 1:
            all_new_badges.extend(BadgeChecker.check_badges(db, user_id, "receive_reaction", reaction_count))
        
        return all_new_badges