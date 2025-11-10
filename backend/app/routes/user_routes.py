from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.user import User
from fastapi import Depends
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
def register_user(username: str, email: str, password: str, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    hashed_password = pwd_context.hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Usuário registrado com sucesso", "user_id": new_user.id}


@router.post("/login")
def login_user(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Email não encontrado")

    if not pwd_context.verify(password, user.password):
        raise HTTPException(status_code=400, detail="Senha incorreta")

    return {"message": "Login realizado com sucesso", "user_id": user.id, "username": user.username}

