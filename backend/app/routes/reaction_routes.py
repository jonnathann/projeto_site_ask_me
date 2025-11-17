from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.reaction import Reaction
from app.models.user import User
from app.models.question import Question
from app.models.answer import Answer
from app.schemas.reaction_schema import ReactionCreate, ReactionResponse, ReactionSummary, REACTIONS_MAP

# Imports para autenticação
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/reactions", tags=["Reactions"])
auth = HTTPBearer()

# Função para obter usuário do token (já temos essa, mas vou incluir aqui)
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

@router.post("/{content_type}/{content_id}", response_model=ReactionResponse)
def add_reaction(
    content_type: str,  # 'question' ou 'answer'
    content_id: int,
    reaction: ReactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validar content_type
    if content_type not in ['question', 'answer']:
        raise HTTPException(status_code=400, detail="Content type deve ser 'question' ou 'answer'")
    
    # Validar reaction_type
    if reaction.reaction_type not in REACTIONS_MAP:
        raise HTTPException(status_code=400, detail=f"Reaction type inválido. Opções: {list(REACTIONS_MAP.keys())}")
    
    # Verificar se o conteúdo existe
    if content_type == 'question':
        content = db.query(Question).filter(Question.id == content_id).first()
    else:  # answer
        content = db.query(Answer).filter(Answer.id == content_id).first()
    
    if not content:
        raise HTTPException(status_code=404, detail="Conteúdo não encontrado")
    
    # Verificar se usuário já reagiu a este conteúdo
    existing_reaction = db.query(Reaction).filter(
        Reaction.user_id == current_user.id,
        Reaction.content_type == content_type,
        Reaction.content_id == content_id
    ).first()
    
    if existing_reaction:
        # Se já existe e é a mesma reação, remove (toggle)
        if existing_reaction.reaction_type == reaction.reaction_type:
            db.delete(existing_reaction)
            db.commit()
            raise HTTPException(status_code=200, detail="Reação removida")
        else:
            # Se é reação diferente, atualiza
            existing_reaction.reaction_type = reaction.reaction_type
            db.commit()
            db.refresh(existing_reaction)
            return existing_reaction
    else:
        # Criar nova reação
        new_reaction = Reaction(
            user_id=current_user.id,
            content_type=content_type,
            content_id=content_id,
            reaction_type=reaction.reaction_type
        )
        
        db.add(new_reaction)
        db.commit()
        db.refresh(new_reaction)
        return new_reaction

@router.get("/{content_type}/{content_id}/summary", response_model=ReactionSummary)
def get_reaction_summary(
    content_type: str,
    content_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Buscar todas as reações para este conteúdo
    reactions = db.query(Reaction).filter(
        Reaction.content_type == content_type,
        Reaction.content_id == content_id
    ).all()
    
    # Contar reações por tipo
    counts = {}
    for reaction_type in REACTIONS_MAP.keys():
        counts[reaction_type] = 0
    
    for reaction in reactions:
        counts[reaction.reaction_type] += 1
    
    # Buscar reação atual do usuário
    user_reaction = db.query(Reaction).filter(
        Reaction.user_id == current_user.id,
        Reaction.content_type == content_type,
        Reaction.content_id == content_id
    ).first()
    
    return ReactionSummary(
        counts=counts,
        user_reaction=user_reaction.reaction_type if user_reaction else None
    )