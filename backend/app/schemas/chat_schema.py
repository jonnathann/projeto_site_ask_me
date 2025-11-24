# app/schemas/chat_schema.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    receiver_id: int  # 👈 Para criar NOVA conversa
    content: str

class MessageSend(BaseModel):  # 👈 NOVO SCHEMA
    content: str  # 👈 Para conversa EXISTENTE (sem receiver_id)

class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    content: str
    is_read: bool
    created_at: datetime
    sender_name: str  # 👈 Nome do remetente
    
    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: int
    user1_id: int
    user2_id: int
    other_user_name: str
    other_user_avatar: str | None
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    unread_count: int = 0
    
    class Config:
        from_attributes = True

class ConversationListResponse(BaseModel):
    conversations: list[ConversationResponse]
    total_unread: int