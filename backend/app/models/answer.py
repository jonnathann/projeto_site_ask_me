# app/models/answer.py - ATUALIZAR
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.db import Base

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    media_url = Column(String, nullable=True)
    media_type = Column(String, nullable=True)
    is_anonymous = Column(Boolean, default=False)
    
    # 👇 NOVOS CAMPOS PARA RESPOSTA ACEITA
    is_accepted = Column(Boolean, default=False)
    accepted_at = Column(DateTime, nullable=True)
    accepted_by = Column(String, nullable=True)  # 'author' ou 'algorithm'
    algorithm_score = Column(Float, default=0.0)  # Pontuação do algoritmo
    
    # Relacionamentos existentes
    question = relationship("Question", back_populates="answers")
    user = relationship("User")
    comments = relationship("Comment", back_populates="answer", cascade="all, delete")