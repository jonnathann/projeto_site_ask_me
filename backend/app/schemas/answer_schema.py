from pydantic import BaseModel
from typing import Dict, Optional  # 👈 NOVO IMPORT

class AnswerBase(BaseModel):
    content: str
    media_url: str | None = None
    is_anonymous: bool = False  # 👈 ADICIONAR

class AnswerCreate(AnswerBase):
    pass

class AnswerResponse(AnswerBase):
    id: int
    question_id: int
    user_id: int
    media_type: str | None = None
    reactions: Optional[Dict[str, int]] = None
    user_reaction: Optional[str] = None
    author_name: str  # 👈 ADICIONAR
    is_anonymous: bool  # 👈 ADICIONAR

    class Config:
        from_attributes = True