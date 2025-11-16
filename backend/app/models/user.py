from sqlalchemy import Column, Integer, String, DateTime
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

    created_at = Column(DateTime(timezone=True), server_default=func.now())
