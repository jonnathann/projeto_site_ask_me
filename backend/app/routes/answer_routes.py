from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session  # 👈 JÁ EXISTE
from app.database.db import get_db
from app.models.answer import Answer
from app.models.question import Question
from app.models.user import User  # 👈 JÁ EXISTE
from app.schemas.answer_schema import AnswerCreate, AnswerResponse
from app.utils.media_detector import detect_media_type
from app.utils.shorts_coverter_emoji import replace_shortcodes
from app.services.xp_service import XPService #Novo


# 👇 IMPORTS para autenticação
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/answers", tags=["Answers"])
auth = HTTPBearer()

# 👇 FUNÇÃO para obter usuário do token (PRIMEIRO)
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

# 👇 DEPOIS A FUNÇÃO DE REAÇÕES
def get_answer_reactions(answer_id: int, db: Session, current_user: User = None):
    """Busca reações de uma resposta"""
    from app.models.reaction import Reaction
    from app.schemas.reaction_schema import REACTIONS_MAP
    
    # Buscar todas as reações para esta resposta
    reactions = db.query(Reaction).filter(
        Reaction.content_type == 'answer',
        Reaction.content_id == answer_id
    ).all()
    
    # Contar reações por tipo
    counts = {}
    for reaction_type in REACTIONS_MAP.keys():
        counts[reaction_type] = 0
    
    for reaction in reactions:
        counts[reaction.reaction_type] += 1
    
    # Buscar reação atual do usuário
    user_reaction = None
    if current_user:
        user_reaction_obj = db.query(Reaction).filter(
            Reaction.user_id == current_user.id,
            Reaction.content_type == 'answer',
            Reaction.content_id == answer_id
        ).first()
        user_reaction = user_reaction_obj.reaction_type if user_reaction_obj else None
    
    return counts, user_reaction

# ... (o resto do código permanece igual) ...
@router.post("/{question_id}", response_model=AnswerResponse)
async def create_answer(
    question_id: int, 
    answer: AnswerCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verifica se pergunta existe
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Converter shortcodes em emojis
    processed_content = replace_shortcodes(answer.content)

    media_type = None
    if answer.media_url:
        media_type = await detect_media_type(answer.media_url)

    # Criar resposta VINCULADA AO USUÁRIO (agora com is_anonymous)
    new_answer = Answer(
        question_id=question_id,
        content=processed_content,
        media_url=answer.media_url,
        media_type=media_type,
        user_id=current_user.id,
        is_anonymous=answer.is_anonymous  # 👈 NOVO CAMPO
    )

    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)

    # 👇 ADICIONAR XP POR CRIAR RESPOSTA
    xp_result = XPService.add_xp(db, current_user.id, "create_answer", new_answer.id)
    if xp_result and xp_result["level_up"]:
        print(f"🎉 {current_user.name} subiu para level {xp_result['new_level']}!")
    
    # 👇 ADICIONAR REAÇÕES E author_name
    reactions, user_reaction = get_answer_reactions(new_answer.id, db, current_user)
    new_answer.reactions = reactions
    new_answer.user_reaction = user_reaction
    
    # 👇 LÓGICA DE ANONIMATO PARA RESPOSTAS
    if new_answer.is_anonymous:
        new_answer.author_name = "Anônimo"
    else:
        new_answer.author_name = current_user.name
    
    return new_answer