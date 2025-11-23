# app/routes/badge_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.user import User
from app.models.badge import Badge
from app.models.user_badge import UserBadge
from app.schemas.badge_schema import BadgeResponse, UserBadgeResponse

# Imports para autenticação
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/badges", tags=["Badges"])
auth = HTTPBearer()

def get_current_user(credentials=Depends(auth), db: Session=Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        return user
    except:
        raise HTTPException(status_code=401, detail="Token inválido")

@router.get("/my-badges", response_model=list[UserBadgeResponse])
def get_my_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lista todas as badges do usuário (conquistadas e em progresso)"""
    user_badges = db.query(UserBadge).filter(
        UserBadge.user_id == current_user.id
    ).all()
    
    result = []
    for user_badge in user_badges:
        result.append({
            "id": user_badge.id,
            "badge": user_badge.badge,
            "progress": user_badge.progress,
            "achieved_at": user_badge.achieved_at,
            "is_achieved": user_badge.progress >= user_badge.badge.requirement
        })
    
    return result

@router.get("/available", response_model=list[BadgeResponse])
def get_available_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lista todas as badges disponíveis no sistema"""
    badges = db.query(Badge).filter(Badge.is_secret == False).all()
    return badges

@router.get("/progress/{badge_id}")
def get_badge_progress(
    badge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retorna o progresso do usuário em uma badge específica"""
    user_badge = db.query(UserBadge).filter(
        UserBadge.user_id == current_user.id,
        UserBadge.badge_id == badge_id
    ).first()
    
    badge = db.query(Badge).filter(Badge.id == badge_id).first()
    if not badge:
        raise HTTPException(status_code=404, detail="Badge não encontrada")
    
    progress = user_badge.progress if user_badge else 0
    is_achieved = progress >= badge.requirement
    
    return {
        "badge": badge,
        "progress": progress,
        "requirement": badge.requirement,
        "is_achieved": is_achieved,
        "remaining": max(0, badge.requirement - progress),
        "progress_percentage": min(100, int((progress / badge.requirement) * 100)) if badge.requirement > 0 else 100
    }

@router.get("/stats")
def get_badge_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Estatísticas de badges do usuário"""
    total_badges = db.query(Badge).count()
    user_badges = db.query(UserBadge).filter(UserBadge.user_id == current_user.id).all()
    
    achieved_count = sum(1 for ub in user_badges if ub.progress >= ub.badge.requirement)
    in_progress_count = sum(1 for ub in user_badges if ub.progress < ub.badge.requirement)
    
    return {
        "total_badges": total_badges,
        "achieved_count": achieved_count,
        "in_progress_count": in_progress_count,
        "completion_percentage": int((achieved_count / total_badges) * 100) if total_badges > 0 else 0
    }