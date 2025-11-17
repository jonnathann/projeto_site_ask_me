from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session  # 👈 JÁ EXISTE
from app.database.db import get_db
from app.models.question import Question
from app.models.user import User  # 👈 JÁ EXISTE
from app.schemas.question_schema import QuestionCreate, QuestionResponse
from app.utils.media_detector import detect_media_type
from app.utils.shorts_coverter_emoji import replace_shortcodes

# 👇 IMPORTS para autenticação
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/questions", tags=["Questions"])
auth = HTTPBearer()

# 👇 FUNÇÃO para obter usuário do token (MANTER ESSA PRIMEIRO)
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

# 👇 AGORA SIM A FUNÇÃO DE REAÇÕES (DEPOIS DOS IMPORTS)
def get_question_reactions(question_id: int, db: Session, current_user: User = None):
    """Busca reações de uma pergunta"""
    from app.models.reaction import Reaction
    from app.schemas.reaction_schema import REACTIONS_MAP
    
    # Buscar todas as reações para esta pergunta
    reactions = db.query(Reaction).filter(
        Reaction.content_type == 'question',
        Reaction.content_id == question_id
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
            Reaction.content_type == 'question',
            Reaction.content_id == question_id
        ).first()
        user_reaction = user_reaction_obj.reaction_type if user_reaction_obj else None
    
    return counts, user_reaction

# ... (o resto do código permanece igual) ...
# ✅ Listar perguntas (com filtros) - REQUER AUTENTICAÇÃO
@router.get("/", response_model=list[QuestionResponse])
def list_questions(
    db: Session = Depends(get_db),
    category: str | None = Query(None),
    term: str | None = Query(None),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Question)

    if category:
        query = query.filter(Question.category.ilike(f"%{category}%"))

    if term:
        query = query.filter(Question.title.ilike(f"%{term}%"))

    questions = query.all()
    
    # Adicionar reações a cada pergunta
    for question in questions:
        reactions, user_reaction = get_question_reactions(question.id, db, current_user)
        question.reactions = reactions
        question.user_reaction = user_reaction
    
    return questions

# 🚀 Criar pergunta - REQUER AUTENTICAÇÃO
@router.post("/", response_model=QuestionResponse)
async def create_question(
    question: QuestionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Converter shortcodes → emojis
    title = replace_shortcodes(question.title)
    description = replace_shortcodes(question.description)
    category = replace_shortcodes(question.category)

    # Detectar tipo de mídia
    media_type = None
    if question.media_url:
        media_type = await detect_media_type(question.media_url)

    # Criar pergunta VINCULADA AO USUÁRIO
    new_question = Question(
        title=title,
        description=description,
        category=category,
        media_url=question.media_url,
        media_type=media_type,
        user_id=current_user.id
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    
    # Adicionar reações à response (vazias inicialmente)
    reactions, user_reaction = get_question_reactions(new_question.id, db, current_user)
    new_question.reactions = reactions
    new_question.user_reaction = user_reaction
    
    return new_question