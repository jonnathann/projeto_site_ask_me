# app/models/user.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    avatar_url = Column(String(300), nullable=True)
    bio = Column(String(300), nullable=True)

    # 👇 NOVOS CAMPOS PARA LEVEL/XP
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)

    # 👇 CAMPOS EXISTENTES PARA MODERAÇÃO
    role = Column(String, default="user")  # 'user', 'moderator', 'admin'
    is_active = Column(Boolean, default=True)
    suspended_until = Column(DateTime, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())