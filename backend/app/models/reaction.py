from sqlalchemy import Column, Integer, String, ForeignKey,  UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.db import Base

class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True, index=True)
    
    # 👇 Usuário que reagiu
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 👇 Tipo de conteúdo (question ou answer)
    content_type = Column(String, nullable=False)  # 'question' ou 'answer'
    
    # 👇 ID do conteúdo (pergunta ou resposta)
    content_id = Column(Integer, nullable=False)
    
    # 👇 Tipo da reação
    reaction_type = Column(String, nullable=False)  # 'like', 'love', 'haha', etc.

    # Relacionamento com usuário
    user = relationship("User")

    # Índice único para evitar reações duplicadas
    __table_args__ = (
        UniqueConstraint('user_id', 'content_type', 'content_id', name='unique_reaction'),
    )