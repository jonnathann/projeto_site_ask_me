from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from app.models.user import User
from app.models.question import Question
from app.models.answer import Answer
from app.models.comment import Comment
from app.models.reaction import Reaction
from app.models.report import Report
from app.models.notification import Notification

class StatsService:
    
    @staticmethod
    def get_moderation_stats(db: Session):
        """Estatísticas de moderação"""
        total_reports = db.query(Report).count()
        pending_reports = db.query(Report).filter(Report.status == 'pending').count()
        resolved_reports = db.query(Report).filter(Report.status == 'resolved').count()
        blocked_users = db.query(User).filter(User.is_active == False).count()
        
        # Relatório por motivo
        reports_by_reason = db.query(
            Report.reason,
            func.count(Report.id).label('count')
        ).group_by(Report.reason).all()
        
        reports_by_reason_dict = {reason: count for reason, count in reports_by_reason}
        
        return {
            "total_reports": total_reports,
            "pending_reports": pending_reports,
            "resolved_reports": resolved_reports,
            "blocked_users_count": blocked_users,
            "reports_by_reason": reports_by_reason_dict
        }
    
    @staticmethod
    def get_engagement_stats(db: Session):
        """Estatísticas de engajamento"""
        total_questions = db.query(Question).count()
        total_answers = db.query(Answer).count()
        total_comments = db.query(Comment).count()
        total_reactions = db.query(Reaction).count()
        
        # Perguntas por categoria
        questions_by_category = db.query(
            Question.category,
            func.count(Question.id).label('count')
        ).group_by(Question.category).all()
        
        questions_by_category_dict = {category: count for category, count in questions_by_category}
        
        return {
            "total_questions": total_questions,
            "total_answers": total_answers,
            "total_comments": total_comments,
            "total_reactions": total_reactions,
            "questions_by_category": questions_by_category_dict
        }
    
    @staticmethod
    def get_user_stats(db: Session):
        """Estatísticas de usuários"""
        total_users = db.query(User).count()
        active_moderators = db.query(User).filter(
            User.role.in_(['moderator', 'admin']),
            User.is_active == True
        ).count()
        
        # Usuários novos hoje
        today = datetime.utcnow().date()
        new_users_today = db.query(User).filter(
            func.date(User.created_at) == today
        ).count()
        
        # Usuários novos esta semana
        week_ago = datetime.utcnow() - timedelta(days=7)
        new_users_this_week = db.query(User).filter(
            User.created_at >= week_ago
        ).count()
        
        return {
            "total_users": total_users,
            "new_users_today": new_users_today,
            "new_users_this_week": new_users_this_week,
            "active_moderators": active_moderators
        }

    @staticmethod
    def get_complete_dashboard(db: Session):
        """Dashboard completo com todas as estatísticas"""
        return {
            "moderation": StatsService.get_moderation_stats(db),
            "engagement": StatsService.get_engagement_stats(db),
            "users": StatsService.get_user_stats(db),
            "last_updated": datetime.utcnow()
        }