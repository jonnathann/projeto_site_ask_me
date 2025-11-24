# app/routes/chat_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.user import User
from app.schemas.chat_schema import (
    MessageCreate, 
    MessageResponse, 
    ConversationResponse,
    ConversationListResponse,
    MessageSend,
)

# 👇 ADICIONAR IMPORT DO SHORTCODE CONVERTER
from app.utils.shorts_coverter_emoji import replace_shortcodes

# Imports para autenticação
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/chat", tags=["Chat"])
auth = HTTPBearer()

def get_current_user(credentials=Depends(auth), db: Session=Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        return user
    except:
        raise HTTPException(status_code=401, detail="Token inválido")

@router.post("/conversations", response_model=ConversationResponse)
def create_or_get_conversation(
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cria uma nova conversa ou retorna existente"""
    # Verificar se o receptor existe
    receiver = db.query(User).filter(User.id == message_data.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Verificar se não está tentando enviar para si mesmo
    if current_user.id == message_data.receiver_id:
        raise HTTPException(status_code=400, detail="Não é possível enviar mensagem para si mesmo")
    
    # Buscar conversa existente
    conversation = db.query(Conversation).filter(
        ((Conversation.user1_id == current_user.id) & (Conversation.user2_id == message_data.receiver_id)) |
        ((Conversation.user1_id == message_data.receiver_id) & (Conversation.user2_id == current_user.id))
    ).first()
    
    if not conversation:
        # Criar nova conversa
        conversation = Conversation(
            user1_id=current_user.id,
            user2_id=message_data.receiver_id
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    # 👇 PROCESSAR SHORTCODES → EMOJIS (PRIMEIRA MENSAGEM)
    processed_content = replace_shortcodes(message_data.content)
    
    # Criar primeira mensagem COM EMOJIS
    message = Message(
        conversation_id=conversation.id,
        sender_id=current_user.id,
        content=processed_content  # 👈 Conteúdo com emojis
    )
    db.add(message)
    
    # Atualizar última mensagem da conversa
    conversation.last_message_at = message.created_at
    db.commit()
    db.refresh(message)
    
    # Determinar quem é o outro usuário
    other_user = receiver
    other_user_name = other_user.name
    other_user_avatar = other_user.avatar_url
    
    return ConversationResponse(
        id=conversation.id,
        user1_id=conversation.user1_id,
        user2_id=conversation.user2_id,
        other_user_name=other_user_name,
        other_user_avatar=other_user_avatar,
        last_message=processed_content,  # 👈 Mostrar com emojis
        last_message_at=message.created_at,
        unread_count=0
    )

@router.get("/conversations", response_model=ConversationListResponse)
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lista todas as conversas do usuário"""
    # Buscar conversas onde o usuário está envolvido
    conversations = db.query(Conversation).filter(
        (Conversation.user1_id == current_user.id) | (Conversation.user2_id == current_user.id)
    ).order_by(Conversation.last_message_at.desc()).all()
    
    conversation_responses = []
    total_unread = 0
    
    for conv in conversations:
        # Determinar quem é o outro usuário
        if conv.user1_id == current_user.id:
            other_user_id = conv.user2_id
        else:
            other_user_id = conv.user1_id
        
        other_user = db.query(User).filter(User.id == other_user_id).first()
        
        # Buscar última mensagem
        last_message = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(Message.created_at.desc()).first()
        
        # Contar mensagens não lidas
        unread_count = db.query(Message).filter(
            Message.conversation_id == conv.id,
            Message.sender_id != current_user.id,  # Só mensagens de outros
            Message.is_read == False
        ).count()
        
        total_unread += unread_count
        
        conversation_responses.append(ConversationResponse(
            id=conv.id,
            user1_id=conv.user1_id,
            user2_id=conv.user2_id,
            other_user_name=other_user.name,
            other_user_avatar=other_user.avatar_url,
            last_message=last_message.content if last_message else None,
            last_message_at=last_message.created_at if last_message else None,
            unread_count=unread_count
        ))
    
    return ConversationListResponse(
        conversations=conversation_responses,
        total_unread=total_unread
    )

@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
def send_message(
    conversation_id: int,
    message_data: MessageSend,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Envia uma mensagem em uma conversa existente"""
    # Verificar se a conversa existe e o usuário tem acesso
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        ((Conversation.user1_id == current_user.id) | (Conversation.user2_id == current_user.id))
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversa não encontrada")
    
    # 👇 PROCESSAR SHORTCODES → EMOJIS
    processed_content = replace_shortcodes(message_data.content)
    
    # Criar mensagem COM EMOJIS
    message = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        content=processed_content  # 👈 Conteúdo com emojis
    )
    db.add(message)
    
    # Atualizar última mensagem da conversa
    conversation.last_message_at = message.created_at
    db.commit()
    db.refresh(message)
    
    # Buscar nome do remetente para a response
    sender = db.query(User).filter(User.id == current_user.id).first()
    
    return MessageResponse(
        id=message.id,
        conversation_id=message.conversation_id,
        sender_id=message.sender_id,
        content=processed_content,  # 👈 Retornar com emojis
        is_read=message.is_read,
        created_at=message.created_at,
        sender_name=sender.name
    )

@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageResponse])
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Busca todas as mensagens de uma conversa"""
    # Verificar se a conversa existe e o usuário tem acesso
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        ((Conversation.user1_id == current_user.id) | (Conversation.user2_id == current_user.id))
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversa não encontrada")
    
    # Buscar mensagens
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc()).all()
    
    # Marcar mensagens como lida (apenas as do outro usuário)
    for message in messages:
        if message.sender_id != current_user.id and not message.is_read:
            message.is_read = True
    
    db.commit()
    
    # Preparar response com nomes dos remetentes
    result = []
    for message in messages:
        sender = db.query(User).filter(User.id == message.sender_id).first()
        result.append(MessageResponse(
            id=message.id,
            conversation_id=message.conversation_id,
            sender_id=message.sender_id,
            content=message.content,  # 👈 Já está salvo com emojis no banco
            is_read=message.is_read,
            created_at=message.created_at,
            sender_name=sender.name
        ))
    
    return result

@router.put("/messages/{message_id}/read")
def mark_message_as_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Marca uma mensagem como lida"""
    message = db.query(Message).filter(Message.id == message_id).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")
    
    # Verificar se o usuário tem acesso à conversa
    conversation = db.query(Conversation).filter(
        Conversation.id == message.conversation_id,
        ((Conversation.user1_id == current_user.id) | (Conversation.user2_id == current_user.id))
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Só pode marcar como lida mensagens de outros usuários
    if message.sender_id != current_user.id:
        message.is_read = True
        db.commit()
    
    return {"message": "Mensagem marcada como lida"}

# 👇 NOVO ENDPOINT OTIMIZADO
@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retorna o total de mensagens não lidas (OTIMIZADO)"""
    total_unread = db.query(Message).join(Conversation).filter(
        ((Conversation.user1_id == current_user.id) | (Conversation.user2_id == current_user.id)),
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).count()
    
    return {"unread_count": total_unread}

# 👇 NOVO ENDPOINT - MENSAGENS RECENTES PARA NOTIFICAÇÕES
@router.get("/recent-messages")
def get_recent_unread_messages(
    limit: int = Query(5, description="Quantidade máxima de mensagens"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retorna mensagens recentes não lidas para notificações"""
    # Buscar mensagens não lidas do usuário
    unread_messages = db.query(Message).join(Conversation).filter(
        ((Conversation.user1_id == current_user.id) | (Conversation.user2_id == current_user.id)),
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).order_by(Message.created_at.desc()).limit(limit).all()
    
    recent_messages = []
    
    for msg in unread_messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        
        # Determinar com quem é a conversa
        conversation = db.query(Conversation).filter(Conversation.id == msg.conversation_id).first()
        if conversation.user1_id == current_user.id:
            other_user_id = conversation.user2_id
        else:
            other_user_id = conversation.user1_id
        
        other_user = db.query(User).filter(User.id == other_user_id).first()
        
        recent_messages.append({
            "id": msg.id,
            "conversation_id": msg.conversation_id,
            "sender_id": msg.sender_id,
            "sender_name": sender.name,
            "content": msg.content,
            "created_at": msg.created_at,
            "conversation_with": other_user.name,
            "conversation_with_avatar": other_user.avatar_url
        })
    
    return {
        "recent_messages": recent_messages,
        "total_unread": len(recent_messages)
    }