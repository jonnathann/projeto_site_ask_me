from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.db import get_db
from app.models.report import Report
from app.models.user import User
from app.schemas.report_schema import ReportCreate, ReportResponse, ReportSummary

# Imports para autenticação
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/reports", tags=["Reports"])
auth = HTTPBearer()

# 👇 FUNÇÃO para obter usuário do token
def get_current_user(credentials = Depends(auth), db: Session = Depends(get_db)):
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

# 👇 FUNÇÃO para verificar se é moderador
def get_moderator(current_user: User = Depends(get_current_user)):
    if current_user.role not in ['moderator', 'admin']:
        raise HTTPException(status_code=403, detail="Acesso restrito a moderadores")
    return current_user

# 👇 DENUNCIAR UM USUÁRIO
@router.post("/", response_model=ReportResponse)
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar se o usuário denunciado existe
    reported_user = db.query(User).filter(User.id == report.reported_user_id).first()
    if not reported_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    # Verificar se não está denunciando a si mesmo
    if current_user.id == report.reported_user_id:
        raise HTTPException(status_code=400, detail="Não é possível denunciar a si mesmo")
    
    # Verificar motivos válidos
    valid_reasons = ['spam', 'harassment', 'inappropriate', 'other']
    if report.reason not in valid_reasons:
        raise HTTPException(status_code=400, detail=f"Motivo inválido. Use: {valid_reasons}")
    
    # Criar denúncia
    new_report = Report(
        reporter_id=current_user.id,
        reported_user_id=report.reported_user_id,
        reason=report.reason,
        description=report.description,
        status="pending"
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return new_report

# 👇 LISTAR DENÚNCIAS (APENAS MODERADORES)
@router.get("/", response_model=list[ReportResponse])
def list_reports(
    db: Session = Depends(get_db),
    status: str = Query(None),  # Filtrar por status
    moderator: User = Depends(get_moderator)  # 👈 Apenas moderadores
):
    query = db.query(Report)
    
    if status:
        query = query.filter(Report.status == status)
    
    # Ordenar por mais recente primeiro
    reports = query.order_by(Report.created_at.desc()).all()
    return reports

# 👇 RESUMO DE DENÚNCIAS (APENAS MODERADORES)
@router.get("/summary", response_model=ReportSummary)
def get_reports_summary(
    db: Session = Depends(get_db),
    moderator: User = Depends(get_moderator)  # 👈 Apenas moderadores
):
    total_reports = db.query(Report).count()
    pending_reports = db.query(Report).filter(Report.status == "pending").count()
    
    # Contar denúncias por usuário (para estatísticas)
    user_reports_count = db.query(
        Report.reported_user_id,
        func.count(Report.id).label('report_count')
    ).group_by(Report.reported_user_id).count()
    
    return ReportSummary(
        total_reports=total_reports,
        pending_reports=pending_reports,
        user_reports_count=user_reports_count
    )

# 👇 ATUALIZAR STATUS DA DENÚNCIA (APENAS MODERADORES)
@router.patch("/{report_id}")
def update_report_status(
    report_id: int,
    status: str = Query(..., description="Novo status: pending, reviewed, resolved"),
    db: Session = Depends(get_db),
    moderator: User = Depends(get_moderator)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Denúncia não encontrada")
    
    valid_statuses = ['pending', 'reviewed', 'resolved']
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status inválido. Use: {valid_statuses}")
    
    report.status = status
    db.commit()
    
    return {"message": f"Denúncia {report_id} atualizada para status: {status}"}


# 👇 BLOQUEAR USUÁRIO (APENAS MODERADORES)
@router.post("/{report_id}/block-user")
def block_reported_user(
    report_id: int,
    block_days: int = Query(7, description="Dias de bloqueio (0 = permanente)"),
    db: Session = Depends(get_db),
    moderator: User = Depends(get_moderator)
):
    # Buscar a denúncia
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Denúncia não encontrada")
    
    # Buscar o usuário denunciado
    user_to_block = db.query(User).filter(User.id == report.reported_user_id).first()
    if not user_to_block:
        raise HTTPException(status_code=404, detail="Usuário denunciado não encontrado")
    
    # Calcular data de suspensão
    from datetime import datetime, timedelta
    if block_days == 0:
        # Bloqueio permanente
        user_to_block.is_active = False
        user_to_block.suspended_until = None
        block_type = "permanente"
    else:
        # Bloqueio temporário
        user_to_block.is_active = False
        user_to_block.suspended_until = datetime.utcnow() + timedelta(days=block_days)
        block_type = f"temporário de {block_days} dias"
    
    # Atualizar status da denúncia
    report.status = "resolved"
    
    db.commit()
    
    return {
        "message": f"Usuário {user_to_block.name} bloqueado {block_type}",
        "user_id": user_to_block.id,
        "block_type": block_type,
        "suspended_until": user_to_block.suspended_until
    }

# 👇 DESBLOQUEAR USUÁRIO (APENAS MODERADORES)
@router.post("/users/{user_id}/unblock")
def unblock_user(
    user_id: int,
    db: Session = Depends(get_db),
    moderator: User = Depends(get_moderator)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    user.is_active = True
    user.suspended_until = None
    
    db.commit()
    
    return {"message": f"Usuário {user.name} desbloqueado com sucesso"}

# 👇 LISTAR USUÁRIOS BLOQUEADOS (APENAS MODERADORES)
@router.get("/blocked-users")
def list_blocked_users(
    db: Session = Depends(get_db),
    moderator: User = Depends(get_moderator)
):
    blocked_users = db.query(User).filter(User.is_active == False).all()
    
    result = []
    for user in blocked_users:
        result.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "suspended_until": user.suspended_until,
            "is_permanent": user.suspended_until is None
        })
    
    return result