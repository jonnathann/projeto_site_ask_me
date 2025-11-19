from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.models.user import User
from datetime import datetime
import json  # 👈 ADICIONAR IMPORT

class NotificationService:
    
    @staticmethod
    def create_notification(
        db: Session,
        user_id: int,
        type: str,
        title: str,
        message: str,
        extra_data: dict = None
    ):
        """Cria uma notificação automaticamente"""
        
        # Verificar se usuário existe
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError(f"Usuário {user_id} não encontrado")
        
        # 👇 MANTER a conversão para string (mas com JSON)
        extra_data_str = json.dumps(extra_data) if extra_data else None
        
        # Criar notificação
        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            extra_data=extra_data_str,
            is_read=False
        )
        
        db.add(notification)
        db.commit()
        db.refresh(notification)
        
        print(f"📧 Notificação criada: {title} para usuário {user.name}")
        return notification
    
    @staticmethod
    def notify_user_blocked(db: Session, user_id: int, block_days: int, moderator_name: str):
        """Notifica usuário quando é bloqueado"""
        if block_days == 0:
            block_type = "permanentemente"
        else:
            block_type = f"por {block_days} dias"
        
        return NotificationService.create_notification(
            db=db,
            user_id=user_id,
            type="user_blocked",
            title="Conta Bloqueada",
            message=f"Sua conta foi bloqueada {block_type} devido a violação das regras da comunidade. Moderador: {moderator_name}",
            extra_data={"block_days": block_days, "moderator": moderator_name}
        )
    
    @staticmethod
    def notify_user_unblocked(db: Session, user_id: int, moderator_name: str):
        """Notifica usuário quando é desbloqueado"""
        return NotificationService.create_notification(
            db=db,
            user_id=user_id,
            type="user_unblocked", 
            title="Conta Desbloqueada",
            message=f"Sua conta foi desbloqueada e o acesso restaurado. Moderador: {moderator_name}",
            extra_data={"moderator": moderator_name}
        )
    
    @staticmethod
    def notify_content_removed(db: Session, user_id: int, content_type: str, moderator_name: str):
        """Notifica quando conteúdo é removido"""
        content_names = {
            "question": "pergunta",
            "answer": "resposta", 
            "comment": "comentário"
        }
        
        content_name = content_names.get(content_type, "conteúdo")
        
        return NotificationService.create_notification(
            db=db,
            user_id=user_id,
            type="content_removed",
            title="Conteúdo Removido",
            message=f"Sua {content_name} foi removida por violar as diretrizes da comunidade. Moderador: {moderator_name}",
            extra_data={"content_type": content_type, "moderator": moderator_name}
        )
    
    @staticmethod
    def notify_report_resolved(db: Session, reporter_id: int, reported_user_name: str, action_taken: str):
        """Notifica denunciante quando denúncia é resolvida"""
        return NotificationService.create_notification(
            db=db,
            user_id=reporter_id,
            type="report_resolved",
            title="Denúncia Resolvida",
            message=f"Sua denúncia contra {reported_user_name} foi analisada. Ação tomada: {action_taken}",
            extra_data={"reported_user": reported_user_name, "action": action_taken}
        )