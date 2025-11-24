from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime  # 👈 NOVO IMPORT

class AnswerBase(BaseModel):
    content: str
    media_url: str | None = None
    is_anonymous: bool = False

class AnswerCreate(AnswerBase):
    pass

class AnswerResponse(AnswerBase):
    id: int
    question_id: int
    user_id: int
    media_type: str | None = None
    reactions: Optional[Dict[str, int]] = None
    user_reaction: Optional[str] = None
    author_name: str
    is_anonymous: bool
    
    # 👇 NOVOS CAMPOS PARA RESPOSTA ACEITA
    is_accepted: bool
    accepted_at: datetime | None = None
    accepted_by: str | None = None
    algorithm_score: float | None = None

    class Config:
        from_attributes = True