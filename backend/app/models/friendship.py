# app/models/friendship.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.db import Base

class Friendship(Base):
    __tablename__ = "friendships"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    friend_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="pending")  # pending, accepted, rejected, blocked
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    blocked_by = Column(Integer, nullable=True)  # ID do usuário que bloqueou (se aplicável)
    
    # Relacionamentos
    user = relationship("User", foreign_keys=[user_id], backref="sent_requests")
    friend = relationship("User", foreign_keys=[friend_id], backref="received_requests")

    # Índice único para evitar duplicatas
    __table_args__ = (
        UniqueConstraint('user_id', 'friend_id', name='unique_friendship'),
    )