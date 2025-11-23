# app/schemas/leaderboard_schema.py
from pydantic import BaseModel

class LeaderboardUser(BaseModel):
    rank: int
    user_id: int
    name: str
    avatar_url: str | None
    level: int
    xp: int
    xp_to_next_level: int
    
    class Config:
        from_attributes = True

class LeaderboardResponse(BaseModel):
    users: list[LeaderboardUser]
    total_users: int
    current_user_rank: int | None