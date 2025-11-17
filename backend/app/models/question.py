from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base
from app.models.answer import Answer
from app.models.user import User  # 👈 NOVO IMPORT

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    
    # 👇 NOVO CAMPO: vinculação com usuário
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Mídias da pergunta
    media_url = Column(String, nullable=True)
    media_type = Column(String, nullable=True)

    # Relacionamentos
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")
    user = relationship("User")  # 👈 NOVO RELACIONAMENTO