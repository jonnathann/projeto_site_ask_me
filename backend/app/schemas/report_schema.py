from pydantic import BaseModel
from datetime import datetime

class ReportCreate(BaseModel):
    reported_user_id: int
    reason: str  # 'spam', 'harassment', 'inappropriate', 'other'
    description: str | None = None

class ReportResponse(BaseModel):
    id: int
    reporter_id: int
    reported_user_id: int
    reason: str
    description: str | None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ReportSummary(BaseModel):
    total_reports: int
    pending_reports: int
    user_reports_count: int