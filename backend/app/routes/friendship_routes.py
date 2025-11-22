from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.friendship import Friendship
from app.models.user import User
from app.models.report import Report  # 👈 PARA DENÚNCIAS AUTOMÁTICAS
from app.schemas.friendship_schema import (
    FriendshipCreate, 
    FriendshipResponse, 
    FriendRequest,
    FriendshipStatus
)

# Imports para autenticação
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/friends", tags=["Friends"])
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

# 👇 ENVIAR SOLICITAÇÃO DE AMIZADE
@router.post("/send-request", response_model=FriendshipResponse)
def send_friend_request(
    request: FriendshipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar se não está tentando adicionar a si mesmo
    if current_user.id == request.friend_id:
        raise HTTPException(status_code=400, detail="Não é possível adicionar a si mesmo como amigo")

    # Verificar se o amigo existe
    friend = db.query(User).filter(User.id == request.friend_id).first()
    if not friend:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # Verificar se está bloqueado
    blocked = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) & (Friendship.friend_id == request.friend_id) & (Friendship.status == "blocked")) |
        ((Friendship.user_id == request.friend_id) & (Friendship.friend_id == current_user.id) & (Friendship.status == "blocked"))
    ).first()
    
    if blocked:
        raise HTTPException(status_code=403, detail="Não é possível enviar solicitação para usuário bloqueado")

    # Verificar se já existe solicitação
    existing_request = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) & (Friendship.friend_id == request.friend_id)) |
        ((Friendship.user_id == request.friend_id) & (Friendship.friend_id == current_user.id))
    ).first()

    if existing_request:
        if existing_request.status == "pending":
            raise HTTPException(status_code=400, detail="Solicitação de amizade já enviada")
        elif existing_request.status == "accepted":
            raise HTTPException(status_code=400, detail="Vocês já são amigos")
        elif existing_request.status == "rejected":
            # Reativar solicitação rejeitada
            existing_request.status = "pending"
            db.commit()
            db.refresh(existing_request)
            
            return FriendshipResponse(
                id=existing_request.id,
                user_id=existing_request.user_id,
                friend_id=existing_request.friend_id,
                status=existing_request.status,
                created_at=existing_request.created_at,
                friend_name=friend.name,
                friend_avatar=friend.avatar_url,
                blocked_by=existing_request.blocked_by
            )

    # Criar nova solicitação
    new_friendship = Friendship(
        user_id=current_user.id,
        friend_id=request.friend_id,
        status="pending"
    )

    db.add(new_friendship)
    db.commit()
    db.refresh(new_friendship)

    return FriendshipResponse(
        id=new_friendship.id,
        user_id=new_friendship.user_id,
        friend_id=new_friendship.friend_id,
        status=new_friendship.status,
        created_at=new_friendship.created_at,
        friend_name=friend.name,
        friend_avatar=friend.avatar_url,
        blocked_by=new_friendship.blocked_by
    )

# 👇 LISTAR SOLICITAÇÕES PENDENTES
@router.get("/requests", response_model=list[FriendRequest])
def list_friend_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Buscar solicitações recebidas pendentes (excluir usuários bloqueados)
    requests = db.query(Friendship).filter(
        Friendship.friend_id == current_user.id,
        Friendship.status == "pending"
    ).all()

    result = []
    for req in requests:
        # Verificar se não bloqueou quem enviou a solicitação
        blocked = db.query(Friendship).filter(
            Friendship.user_id == current_user.id,
            Friendship.friend_id == req.user_id,
            Friendship.status == "blocked"
        ).first()
        
        if not blocked:
            user = db.query(User).filter(User.id == req.user_id).first()
            result.append(FriendRequest(
                id=req.id,
                user_id=req.user_id,
                user_name=user.name,
                user_avatar=user.avatar_url,
                created_at=req.created_at
            ))

    return result

# 👇 ACEITAR SOLICITAÇÃO
@router.post("/accept/{request_id}", response_model=FriendshipResponse)
def accept_friend_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    friendship = db.query(Friendship).filter(
        Friendship.id == request_id,
        Friendship.friend_id == current_user.id,
        Friendship.status == "pending"
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")

    # Aceitar solicitação
    friendship.status = "accepted"
    db.commit()
    db.refresh(friendship)

    friend = db.query(User).filter(User.id == friendship.user_id).first()

    return FriendshipResponse(
        id=friendship.id,
        user_id=friendship.user_id,
        friend_id=friendship.friend_id,
        status=friendship.status,
        created_at=friendship.created_at,
        friend_name=friend.name,
        friend_avatar=friend.avatar_url,
        blocked_by=friendship.blocked_by
    )

# 👇 REJEITAR SOLICITAÇÃO
@router.post("/reject/{request_id}")
def reject_friend_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    friendship = db.query(Friendship).filter(
        Friendship.id == request_id,
        Friendship.friend_id == current_user.id,
        Friendship.status == "pending"
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada")

    friendship.status = "rejected"
    db.commit()

    return {"message": "Solicitação de amizade rejeitada"}

# 👇 LISTAR AMIGOS
@router.get("/", response_model=list[FriendshipResponse])
def list_friends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Buscar amigos (excluir bloqueados)
    friendships = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) | (Friendship.friend_id == current_user.id)),
        Friendship.status == "accepted"
    ).all()

    result = []
    for friendship in friendships:
        # Determinar quem é o amigo
        if friendship.user_id == current_user.id:
            friend_id = friendship.friend_id
        else:
            friend_id = friendship.user_id

        # Verificar se não bloqueou este amigo
        blocked = db.query(Friendship).filter(
            Friendship.user_id == current_user.id,
            Friendship.friend_id == friend_id,
            Friendship.status == "blocked"
        ).first()
        
        if not blocked:
            friend = db.query(User).filter(User.id == friend_id).first()
            result.append(FriendshipResponse(
                id=friendship.id,
                user_id=friendship.user_id,
                friend_id=friendship.friend_id,
                status=friendship.status,
                created_at=friendship.created_at,
                friend_name=friend.name,
                friend_avatar=friend.avatar_url,
                blocked_by=friendship.blocked_by
            ))

    return result

# 👇 REMOVER AMIGO
@router.delete("/{friend_id}")
def remove_friend(
    friend_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    friendship = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) & (Friendship.friend_id == friend_id)) |
        ((Friendship.user_id == friend_id) & (Friendship.friend_id == current_user.id)),
        Friendship.status == "accepted"
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Amizade não encontrada")

    db.delete(friendship)
    db.commit()

    return {"message": "Amizade removida com sucesso"}

# 👇 BLOQUEAR USUÁRIO (COM DENÚNCIA AUTOMÁTICA)
@router.post("/block/{user_id}")
def block_user(
    user_id: int,
    reason: str = "harassment",  # Motivo padrão para bloqueio
    description: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Não é possível bloquear a si mesmo")

    user_to_block = db.query(User).filter(User.id == user_id).first()
    if not user_to_block:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # Buscar relação existente
    friendship = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) & (Friendship.friend_id == user_id)) |
        ((Friendship.user_id == user_id) & (Friendship.friend_id == current_user.id))
    ).first()

    if friendship:
        # Atualizar relação existente para bloqueado
        friendship.status = "blocked"
        friendship.blocked_by = current_user.id
    else:
        # Criar novo registro de bloqueio
        friendship = Friendship(
            user_id=current_user.id,
            friend_id=user_id,
            status="blocked",
            blocked_by=current_user.id
        )
        db.add(friendship)
    
    # 👇 CRIAR DENÚNCIA AUTOMÁTICA
    auto_report = Report(
        reporter_id=current_user.id,
        reported_user_id=user_id,
        reason=reason,
        description=description or f"Usuário bloqueado por {current_user.name}",
        status="reviewed"  # Já considerado revisado por ser bloqueio direto
    )
    db.add(auto_report)
    
    db.commit()

    return {
        "message": "Usuário bloqueado com sucesso",
        "auto_report_created": True,
        "report_id": auto_report.id
    }

# 👇 DESBLOQUEAR USUÁRIO
@router.post("/unblock/{user_id}")
def unblock_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    friendship = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) & (Friendship.friend_id == user_id)) |
        ((Friendship.user_id == user_id) & (Friendship.friend_id == current_user.id)),
        Friendship.status == "blocked",
        Friendship.blocked_by == current_user.id
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Bloqueio não encontrado")

    # Se eram amigos antes do bloqueio, restaurar amizade
    if friendship.user_id == current_user.id and friendship.friend_id == user_id:
        friendship.status = "accepted"
    elif friendship.user_id == user_id and friendship.friend_id == current_user.id:
        friendship.status = "accepted"
    else:
        # Se não eram amigos, deletar o registro
        db.delete(friendship)
    
    friendship.blocked_by = None
    db.commit()

    return {"message": "Usuário desbloqueado com sucesso"}

# 👇 LISTAR USUÁRIOS BLOQUEADOS
@router.get("/blocked", response_model=list[FriendshipResponse])
def list_blocked_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    blocked_friendships = db.query(Friendship).filter(
        Friendship.blocked_by == current_user.id,
        Friendship.status == "blocked"
    ).all()

    result = []
    for friendship in blocked_friendships:
        blocked_user_id = friendship.friend_id if friendship.user_id == current_user.id else friendship.user_id
        blocked_user = db.query(User).filter(User.id == blocked_user_id).first()

        result.append(FriendshipResponse(
            id=friendship.id,
            user_id=friendship.user_id,
            friend_id=friendship.friend_id,
            status=friendship.status,
            created_at=friendship.created_at,
            friend_name=blocked_user.name,
            friend_avatar=blocked_user.avatar_url,
            blocked_by=friendship.blocked_by
        ))

    return result

# 👇 VERIFICAR STATUS DE AMIZADE/BLOQUEIO
@router.get("/status/{user_id}", response_model=FriendshipStatus)
def check_friendship_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    friendship = db.query(Friendship).filter(
        ((Friendship.user_id == current_user.id) & (Friendship.friend_id == user_id)) |
        ((Friendship.user_id == user_id) & (Friendship.friend_id == current_user.id))
    ).first()

    if friendship:
        return FriendshipStatus(
            is_friend=(friendship.status == "accepted"),
            status=friendship.status,
            request_id=friendship.id,
            blocked_by=friendship.blocked_by
        )
    else:
        return FriendshipStatus(
            is_friend=False,
            status=None,
            request_id=None,
            blocked_by=None
        )