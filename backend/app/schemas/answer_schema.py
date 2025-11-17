from pydantic import BaseModel

class AnswerBase(BaseModel):
    content: str
    media_url: str | None = None

class AnswerCreate(AnswerBase):
    pass

class AnswerResponse(AnswerBase):
    id: int
    question_id: int
    user_id: int  # 👈 NOVO CAMPO
    media_type: str | None = None

    class Config:
        from_attributes = True