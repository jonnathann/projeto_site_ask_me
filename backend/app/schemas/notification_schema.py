from pydantic import BaseModel, validator
from datetime import datetime
from typing import Any, Optional
import json

class NotificationBase(BaseModel):
    type: str
    title: str
    message: str
    extra_data: Optional[Any] = None

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime

    @validator('extra_data', pre=True)
    def parse_extra_data(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v.replace("'", '"'))  # Converter aspas simples para duplas
            except:
                return v
        return v

    class Config:
        from_attributes = True

class NotificationUpdate(BaseModel):
    is_read: bool