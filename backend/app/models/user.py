from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    # Campo para nickname de usuário
    nickname = Column(String(50), nullable=False)

    # Campo pra gênero
    gender = Column(String(20), nullable=False)

    # AVATAR: Agora pode ser nulo (será definido no registro)
    avatar_url = Column(String(500), nullable=True)  # ← AUMENTADO para 500 e nullable=True

    bio = Column(String(300), nullable=True)

    # Campos para LEVEL/XP
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)

    # Campos para MODERAÇÃO
    role = Column(String, default="user")  # 'user', 'moderator', 'admin'
    is_active = Column(Boolean, default=True)
    suspended_until = Column(DateTime, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Método para facilitar debug
    def __repr__(self):
        return f"<User(id={self.id}, name='{self.name}', nickname='{self.nickname}')>"