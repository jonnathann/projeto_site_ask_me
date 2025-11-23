from sqlalchemy.orm import Session

class XPService:
    # Sistema de XP por ações
    XP_RULES = {
        "create_question": 10,
        "create_answer": 15, 
        "create_comment": 5,
        "receive_reaction": 2,
        "answer_accepted": 25
    }
    
    # Sistema de Levels (XP necessário para cada level)
    LEVELS_XP = {
        1: 0,
        2: 100,
        3: 300, 
        4: 600,
        5: 1000,
        6: 1500,
        7: 2100,
        8: 2800,
        9: 3600, 
        10: 4500
        # Pode expandir depois
    }
    
    @staticmethod
    def calculate_level(xp: int) -> int:
        """Calcula o level baseado no XP"""
        level = 1
        for lvl, xp_required in XPService.LEVELS_XP.items():
            if xp >= xp_required:
                level = lvl
            else:
                break
        return level
    
    @staticmethod
    def get_level_info(xp: int) -> dict:
        """Retorna informações detalhadas do level"""
        current_level = XPService.calculate_level(xp)
        current_level_xp = XPService.LEVELS_XP[current_level]
        next_level_xp = XPService.LEVELS_XP.get(current_level + 1, current_level_xp + 1000)
        
        xp_current_level = xp - current_level_xp
        xp_to_next_level = next_level_xp - current_level_xp
        progress_percentage = (xp_current_level / xp_to_next_level) * 100 if xp_to_next_level > 0 else 100
        
        return {
            "level": current_level,
            "xp": xp,
            "xp_current_level": xp_current_level,
            "xp_to_next_level": xp_to_next_level,
            "progress_percentage": round(progress_percentage, 1),
            "next_level_xp_required": next_level_xp
        }
    
    @staticmethod
    def add_xp(db: Session, user_id: int, action: str, content_id: int = None):
        """Adiciona XP para um usuário baseado na ação"""
        from app.models.user import User
        
        if action not in XPService.XP_RULES:
            return None
            
        xp_to_add = XPService.XP_RULES[action]
        
        # Buscar usuário
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        # Adicionar XP
        user.xp += xp_to_add
        
        # Verificar se subiu de level
        new_level = XPService.calculate_level(user.xp)
        level_up = new_level > user.level
        
        if level_up:
            user.level = new_level
        
        db.commit()
        
        return {
            "xp_added": xp_to_add,
            "new_xp": user.xp,
            "new_level": user.level,
            "level_up": level_up,
            "level_info": XPService.get_level_info(user.xp)
        }