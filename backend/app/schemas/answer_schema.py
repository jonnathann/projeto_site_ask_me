from pydantic import BaseModel

class AnswerBase(BaseModel):
    content: str
    media_url: str | None = None

class AnswerCreate(AnswerBase):
    pass

class AnswerResponse(AnswerBase):
    id: int
    media_type: str | None = None

    class Config:
        #orm_mode = True
        from_attributes = True  # substitui o "orm_mode"
