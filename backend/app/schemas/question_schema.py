from pydantic import BaseModel

class QuestionBase(BaseModel):
    title: str
    description: str  # 👈 esse campo precisa existir!

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: int

    class Config:
        orm_mode = True
