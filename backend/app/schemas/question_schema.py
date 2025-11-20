from pydantic import BaseModel
from typing import Dict, Optional  # 👈 NOVO IMPORT

class QuestionBase(BaseModel):
    title: str
    description: str
    category: str
    media_url: str | None = None
    is_anonymous: bool = False  # 👈 NOVO CAMPO

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: int
    user_id: int
    media_type: str | None = None
    reactions: Optional[Dict[str, int]] = None
    user_reaction: Optional[str] = None
    author_name: str  # 👈 Nome real ou "Anônimo"
    is_anonymous: bool  # 👈 Para frontend controlar visualização

    class Config:
        from_attributes = True