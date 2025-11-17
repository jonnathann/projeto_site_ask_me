from pydantic import BaseModel

class QuestionBase(BaseModel):
    title: str
    description: str
    category: str
    media_url: str | None = None

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: int
    user_id: int  # 👈 NOVO CAMPO
    media_type: str | None = None

    class Config:
        from_attributes = True