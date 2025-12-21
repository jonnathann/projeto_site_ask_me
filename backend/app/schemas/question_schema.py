from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime

class QuestionBase(BaseModel):
    title: str
    description: str
    category: str
    media_url: str | None = None
    is_anonymous: bool = False

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: int
    user_id: int
    media_type: str | None = None
    reactions: Optional[Dict[str, int]] = None
    user_reaction: Optional[str] = None
    author_name: str  # Nome real ou "Anônimo"
    author_gender: str  # "masculino", "feminino", "outro", "prefiro_nao_dizer"
    author_avatar_url: Optional[str] = None  # ✅ NOVO CAMPO: URL do avatar
    is_anonymous: bool  # Para frontend controlar visualização
    created_at: datetime

    class Config:
        from_attributes = True