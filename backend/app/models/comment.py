from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base
from app.models.user import User  # 👈 NOVO IMPORT

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    answer_id = Column(Integer, ForeignKey("answers.id"), nullable=False)
    
    # 👇 NOVO CAMPO: vinculação com usuário
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    content = Column(Text, nullable=False)
    media_url = Column(Text, nullable=True)
    media_type = Column(Text, nullable=True)

    # Relacionamentos
    answer = relationship("Answer", back_populates="comments")
    user = relationship("User")  # 👈 NOVO RELACIONAMENTO