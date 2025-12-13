from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse
from app.utils.security import hash_password, verify_password
from app.utils.jwt_handler import create_token
from app.utils.shorts_coverter_emoji import replace_shortcodes  # ⬅️ Shortcodes → Emojis

# 👇 ADICIONAR A DEPENDÊNCIA DE BLOQUEIO
from app.dependencies.block_check import check_user_blocked

router = APIRouter(prefix="/users", tags=["Users"])

# 🔹 Registro de usuário
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        avatar_url=user.avatar_url,
        nickname = user.nickname, # Novo Campo nickname
        gender = user.gender, # Novo campo gender
        bio=replace_shortcodes(user.bio) if user.bio else None
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# 🔹 Login
@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = create_token({"user_id": user.id})

    return {"access_token": token, "token_type": "bearer"}


# 🔹 Obter dados do usuário logado - 👈 ATUALIZADA!
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(check_user_blocked)):  # 👈 MUDANÇA AQUI!
    return current_user