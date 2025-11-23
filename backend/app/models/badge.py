# app/models/badge.py
from sqlalchemy import Column, Integer, String, Text, Boolean
from sqlalchemy.sql import func
from app.database.db import Base

class Badge(Base):
    __tablename__ = "badges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon_url = Column(String(300), nullable=True)
    criteria = Column(String(100), nullable=False)  # 'first_question', '10_answers', etc.
    requirement = Column(Integer, default=1)  # Quantidade necessária
    xp_reward = Column(Integer, default=0)  # XP extra por conquistar
    is_secret = Column(Boolean, default=False)  # Badge secreta