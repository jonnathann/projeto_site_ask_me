from sqlalchemy import Column, Integer, String, ForeignKey, Boolean  # 👈 ADICIONAR Boolean
from sqlalchemy.orm import relationship
from app.database.db import Base
from app.models.user import User  # 👈 NOVO IMPORT

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 👇 ADICIONAR
    is_anonymous = Column(Boolean, default=False)
    
    content = Column(String, nullable=False)
    media_url = Column(String, nullable=True)
    media_type = Column(String, nullable=True)

    question = relationship("Question", back_populates="answers")
    user = relationship("User")
    comments = relationship("Comment", back_populates="answer", cascade="all, delete")