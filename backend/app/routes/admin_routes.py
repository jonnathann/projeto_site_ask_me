from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])

# 👇 ROTA TEMPORÁRIA - apenas para testes
@router.post("/make-moderator/{user_id}")
def make_user_moderator(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    user.role = "moderator"
    db.commit()
    
    return {"message": f"Usuário {user.name} agora é moderador!"}