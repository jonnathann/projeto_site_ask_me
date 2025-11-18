from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Any, Optional

class NotificationBase(BaseModel):
    type: str
    title: str
    message: str
    extra_data: Optional[Dict[str, Any]] = None

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationUpdate(BaseModel):
    is_read: bool