from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database.db import Base
from app.models.answer import Answer   # 👉 IMPORT NECESSÁRIO PARA O RELACIONAMENTO

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)

    # Mídias da pergunta
    media_url = Column(String, nullable=True)
    media_type = Column(String, nullable=True)  # image, video, gif, other

    # Relacionamento com respostas
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")
