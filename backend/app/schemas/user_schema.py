from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    nickname: str  # Novo campo 
    gender: str
    avatar_url: Optional[str] = None  # ← MUDADO: Agora é opcional
    bio: Optional[str] = None

    # Função pra validar o campo gênero
    @validator("gender")
    def validate_gender(cls, v):
        allowed = {"masculino", "feminino", "outro", "prefiro_nao_dizer"}
        if v.lower() not in allowed:
            raise ValueError("Gênero inválido. Use: masculino, feminino, outro ou prefiro_nao_dizer")
        return v

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    nickname: str  # Novo campo
    gender: str  # Novo campo
    avatar_url: Optional[str]
    bio: Optional[str]
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

# 👇 NOVO: Schema para atualização de perfil
class ProfileUpdate(BaseModel):
    nickname: Optional[str] = None
    bio: Optional[str] = None

# 👇 NOVO: Schema para resposta de perfil público
class UserProfileResponse(BaseModel):
    id: int
    name: str
    nickname: str
    gender: str
    avatar_url: Optional[str]
    bio: Optional[str]
    level: int
    xp: int
    created_at: datetime
    
    class Config:
        from_attributes = True