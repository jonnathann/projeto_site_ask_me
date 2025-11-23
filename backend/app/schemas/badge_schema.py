# app/schemas/badge_schema.py
from pydantic import BaseModel
from datetime import datetime

class BadgeBase(BaseModel):
    name: str
    description: str
    icon_url: str | None
    criteria: str
    requirement: int
    xp_reward: int
    is_secret: bool

class BadgeResponse(BadgeBase):
    id: int
    
    class Config:
        from_attributes = True

class UserBadgeResponse(BaseModel):
    id: int
    badge: BadgeResponse
    progress: int
    achieved_at: datetime
    is_achieved: bool
    
    class Config:
        from_attributes = True

