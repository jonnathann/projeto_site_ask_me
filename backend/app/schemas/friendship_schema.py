# app/schemas/friendship_schema.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FriendshipCreate(BaseModel):
    friend_id: int

class FriendshipResponse(BaseModel):
    id: int
    user_id: int
    friend_id: int
    status: str
    created_at: datetime
    friend_name: str
    friend_avatar: str | None
    blocked_by: Optional[int] = None  # 👈 NOVO CAMPO

    class Config:
        from_attributes = True

class FriendRequest(BaseModel):
    id: int
    user_id: int
    user_name: str
    user_avatar: str | None
    created_at: datetime

    class Config:
        from_attributes = True

class FriendshipStatus(BaseModel):
    is_friend: bool
    status: str | None  # pending, accepted, rejected, blocked
    request_id: int | None
    blocked_by: Optional[int] = None  # 👈 NOVO CAMPO