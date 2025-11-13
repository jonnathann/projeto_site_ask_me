from sqlalchemy import Column, Integer, String, Text
from app.database.db import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)  # 👈 troque content por description
    category = Column(String, nullable=False)  # ✅ nova coluna

