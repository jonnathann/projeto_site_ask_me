from pydantic import BaseModel

class CommentCreate(BaseModel):
    content: str
    media_url: str | None = None

class CommentResponse(BaseModel):
    id: int
    answer_id: int
    content: str
    media_url: str | None = None
    media_type: str | None = None

    class Config:
        orm_mode = True
