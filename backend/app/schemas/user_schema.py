# app/schemas/user_schema.py
from pydantic import BaseModel, validator
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    nickname: str #Novo campo 
    gender: str
    avatar_url: str | None = None
    bio: str | None = None

    # Função pra validar o campo gênero
    @validator("gender")
    def validate_gender(cls, v):
        allowed = {"masculino", "feminino", "outro", "prefiro_nao_dizer"}
        if v not in allowed:
            raise ValueError("Gênero inválido")
        return v

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    nickname: str #Novo campo
    gender: str #Novo campo
    avatar_url: str | None
    bio: str | None
    level: int  # 👈 NOVO CAMPO
    xp: int    # 👈 NOVO CAMPO
    created_at: datetime

    class Config:
        from_attributes = True

# 👇 NOVO SCHEMA PARA INFO DE LEVEL
class UserLevelInfo(BaseModel):
    level: int
    xp: int
    xp_to_next_level: int
    xp_current_level: int
    progress_percentage: float