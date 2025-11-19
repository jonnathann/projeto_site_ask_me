from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/test", tags=["Test"])

@router.post("/test-notifications")
def test_notifications(db: Session = Depends(get_db)):
    """Endpoint para testar o sistema de notificações"""
    
    print("🧪 Testando sistema de notificações...")
    
    # Teste 1: Notificação de bloqueio
    notif1 = NotificationService.notify_user_blocked(
        db=db,
        user_id=1,  # User A
        block_days=7,
        moderator_name="Moderador Teste"
    )
    
    # Teste 2: Notificação de desbloqueio  
    notif2 = NotificationService.notify_user_unblocked(
        db=db,
        user_id=1,  # User A
        moderator_name="Moderador Teste"
    )
    
    # Teste 3: Notificação de conteúdo removido
    notif3 = NotificationService.notify_content_removed(
        db=db,
        user_id=2,  # User B
        content_type="answer",
        moderator_name="Moderador Teste"
    )
    
    # Teste 4: Notificação de denúncia resolvida
    notif4 = NotificationService.notify_report_resolved(
        db=db,
        reporter_id=1,  # User A como denunciante
        reported_user_name="Carlos Problem",
        action_taken="Usuário bloqueado por 7 dias"
    )
    
    return {
        "message": "Notificações de teste criadas com sucesso!",
        "notifications_created": 4,
        "check_console": "Veja as mensagens no terminal"
    }