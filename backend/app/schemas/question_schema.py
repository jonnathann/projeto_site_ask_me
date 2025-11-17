from pydantic import BaseModel
from typing import Dict, Optional  # 👈 NOVO IMPORT

class QuestionBase(BaseModel):
    title: str
    description: str
    category: str
    media_url: str | None = None

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: int
    user_id: int
    media_type: str | None = None
    reactions: Optional[Dict[str, int]] = None  # 👈 NOVO CAMPO
    user_reaction: Optional[str] = None  # 👈 NOVO CAMPO

    class Config:
        from_attributes = True