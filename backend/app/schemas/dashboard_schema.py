from pydantic import BaseModel
from typing import Dict, List
from datetime import datetime

class ModerationStats(BaseModel):
    total_reports: int
    pending_reports: int
    resolved_reports: int
    blocked_users_count: int
    reports_by_reason: Dict[str, int]

class EngagementStats(BaseModel):
    total_questions: int
    total_answers: int
    total_comments: int
    total_reactions: int
    questions_by_category: Dict[str, int]

class UserStats(BaseModel):
    total_users: int
    new_users_today: int
    new_users_this_week: int
    active_moderators: int

class DashboardResponse(BaseModel):
    moderation: ModerationStats
    engagement: EngagementStats
    users: UserStats
    last_updated: datetime