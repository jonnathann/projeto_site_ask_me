from pydantic import BaseModel

class CommentCreate(BaseModel):
    content: str
    media_url: str | None = None
    is_anonymous: bool = False  # 👈 ADICIONAR

class CommentResponse(BaseModel):
    id: int
    answer_id: int
    user_id: int
    content: str
    media_url: str | None = None
    media_type: str | None = None
    author_name: str  # 👈 ADICIONAR
    is_anonymous: bool  # 👈 ADICIONAR

    class Config:
        from_attributes = True