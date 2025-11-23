# app/routes/leaderboard_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.user import User
from app.schemas.leaderboard_schema import LeaderboardResponse
from app.services.leaderboard_service import LeaderboardService

# Imports para autenticação
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])
auth = HTTPBearer()

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

@router.get("/", response_model=LeaderboardResponse)
def get_leaderboard(
    limit: int = Query(50, description="Número de usuários no ranking"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retorna o ranking de usuários por XP"""
    return LeaderboardService.get_leaderboard(db, current_user.id, limit)

@router.get("/top/{count}")
def get_top_users(
    count: int,
    db: Session = Depends(get_db)
):
    """Retorna os top N usuários (público - não requer auth)"""
    if count > 100:
        count = 100
    elif count < 1:
        count = 10
        
    result = LeaderboardService.get_leaderboard(db, None, count)
    return result