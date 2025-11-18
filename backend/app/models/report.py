from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.db import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    
    # 👇 Usuário que fez a denúncia
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 👇 Usuário sendo denunciado
    reported_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 👇 Motivo da denúncia
    reason = Column(String, nullable=False)  # 'spam', 'harassment', 'inappropriate', 'other'
    
    # 👇 Descrição detalhada (opcional)
    description = Column(Text, nullable=True)
    
    # 👇 Status da denúncia
    status = Column(String, default="pending")  # 'pending', 'reviewed', 'resolved'
    
    # 👇 Data e hora
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relacionamentos
    reporter = relationship("User", foreign_keys=[reporter_id])
    reported_user = relationship("User", foreign_keys=[reported_user_id])