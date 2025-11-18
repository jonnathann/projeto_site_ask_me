from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.db import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    
    # 👇 Usuário que recebe a notificação
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 👇 Tipo da notificação
    type = Column(String, nullable=False)  # 'user_blocked', 'user_unblocked', 'content_removed', 'report_resolved'
    
    # 👇 Título da notificação
    title = Column(String, nullable=False)
    
    # 👇 Mensagem detalhada
    message = Column(Text, nullable=False)
    
    # 👇 Dados extras (JSON)
    extra_data = Column(Text, nullable=True)
    
    # 👇 Status
    is_read = Column(Boolean, default=False)
    
    # 👇 Data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relacionamento
    user = relationship("User")