# app/services/leaderboard_service.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.services.xp_service import XPService

class LeaderboardService:
    @staticmethod
    def get_leaderboard(db: Session, current_user_id: int = None, limit: int = 50):
        # Buscar usuários ordenados por XP (maior primeiro)
        users = db.query(User).filter(
            User.is_active == True
        ).order_by(User.xp.desc()).limit(limit).all()
        
        ranked_users = []
        current_user_rank = None
        
        for index, user in enumerate(users, 1):
            level_info = XPService.get_level_info(user.xp)
            
            ranked_users.append({
                "rank": index,
                "user_id": user.id,
                "name": user.name,
                "avatar_url": user.avatar_url,
                "level": user.level,
                "xp": user.xp,
                "xp_to_next_level": level_info["xp_to_next_level"]
            })
            
            # Verificar se é o usuário atual
            if current_user_id and user.id == current_user_id:
                current_user_rank = index
        
        return {
            "users": ranked_users,
            "total_users": len(users),
            "current_user_rank": current_user_rank
        }