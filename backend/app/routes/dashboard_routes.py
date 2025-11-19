from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.user import User
from app.schemas.dashboard_schema import DashboardResponse
from app.services.stats_service import StatsService

# Imports para autenticação
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
auth = HTTPBearer()

# 👇 FUNÇÃO para obter usuário do token
def get_current_user(credentials = Depends(auth), db: Session = Depends(get_db)):
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

# 👇 FUNÇÃO para verificar se é moderador/admin
def get_moderator_or_admin(current_user: User = Depends(get_current_user)):
    if current_user.role not in ['moderator', 'admin']:
        raise HTTPException(status_code=403, detail="Acesso restrito a moderadores e administradores")
    return current_user

# 👇 DASHBOARD COMPLETO (APENAS MODERADORES/ADMIN)
@router.get("/", response_model=DashboardResponse)
def get_complete_dashboard(
    db: Session = Depends(get_db),
    moderator: User = Depends(get_moderator_or_admin)
):
    """Dashboard completo com todas as estatísticas"""
    return StatsService.get_complete_dashboard(db)

# 👇 ESTATÍSTICAS DE MODERAÇÃO (APENAS MODERADORES/ADMIN)
@router.get("/moderation")
def get_moderation_stats(
    db: Session = Depends(get_db),
    moderator: User = Depends(get_moderator_or_admin)
):
    """Apenas estatísticas de moderação"""
    return StatsService.get_moderation_stats(db)

# 👇 ESTATÍSTICAS DE ENGAJAMENTO (PÚBLICO)
@router.get("/engagement")
def get_engagement_stats(db: Session = Depends(get_db)):
    """Estatísticas de engajamento (público)"""
    return StatsService.get_engagement_stats(db)

# 👇 ESTATÍSTICAS DE USUÁRIOS (APENAS MODERADORES/ADMIN)
@router.get("/users")
def get_user_stats(
    db: Session = Depends(get_db),
    moderator: User = Depends(get_moderator_or_admin)
):
    """Estatísticas de usuários"""
    return StatsService.get_user_stats(db)