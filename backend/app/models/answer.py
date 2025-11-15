from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)

    content = Column(String, nullable=False)
    media_url = Column(String, nullable=True)
    media_type = Column(String, nullable=True)  # "image", "video", "gif", "other"

    question = relationship("Question", back_populates="answers")

    # Adicionando funcionalidade de comentários nas respostas
    comments = relationship("Comment", back_populates="answer", cascade="all, delete")

