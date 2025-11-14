from pydantic import BaseModel

class QuestionBase(BaseModel):
    title: str
    description: str
    category: str
    media_url: str | None = None   # 👉 OK aqui

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: int
    media_type: str | None = None   # 👉 tipo detectado (image, video, gif, other)

    class Config:
        orm_mode = True
