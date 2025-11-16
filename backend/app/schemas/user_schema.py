from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    avatar_url: str | None = None
    bio: str | None = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    avatar_url: str | None
    bio: str | None
    created_at: datetime  # ← ACEITA datetime do banco

    class Config:
        from_attributes = True  # substitui o "orm_mode"
