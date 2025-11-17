from pydantic import BaseModel
from typing import Dict

# Mapa de reações disponíveis
REACTIONS_MAP = {
    "like": "👍",
    "love": "❤️",
    "haha": "😄", 
    "wow": "😮",
    "sad": "😢",
    "angry": "😠"
}

class ReactionCreate(BaseModel):
    reaction_type: str  # 'like', 'love', 'haha', etc.

class ReactionResponse(BaseModel):
    id: int
    user_id: int
    content_type: str
    content_id: int
    reaction_type: str

    class Config:
        from_attributes = True

class ReactionSummary(BaseModel):
    counts: Dict[str, int]  # {'like': 5, 'love': 2, ...}
    user_reaction: str | None  # reação atual do usuário logado