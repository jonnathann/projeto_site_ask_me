from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean  # 👈 ADICIONAR Boolean
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
    
    # 👇 NOVO CAMPO
    is_anonymous = Column(Boolean, default=False)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    media_url = Column(String, nullable=True)
    media_type = Column(String, nullable=True)

    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")
    user = relationship("User")