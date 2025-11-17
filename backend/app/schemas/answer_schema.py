from pydantic import BaseModel
from typing import Dict, Optional  # 👈 NOVO IMPORT

class AnswerBase(BaseModel):
    content: str
    media_url: str | None = None

class AnswerCreate(AnswerBase):
    pass

class AnswerResponse(AnswerBase):
    id: int
    question_id: int
    user_id: int
    media_type: str | None = None
    reactions: Optional[Dict[str, int]] = None  # 👈 NOVO CAMPO
    user_reaction: Optional[str] = None  # 👈 NOVO CAMPO

    class Config:
        from_attributes = True