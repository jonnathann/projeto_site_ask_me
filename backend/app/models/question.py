from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from app.database.db import Base
from app.models.answer import Answer
from app.models.user import User

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    is_anonymous = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    media_url = Column(String, nullable=True)
    media_type = Column(String, nullable=True)
    
    # → NOVO CAMPO: data de criação
    created_at = Column(DateTime, default=datetime.utcnow)
    
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")
    user = relationship("User")
