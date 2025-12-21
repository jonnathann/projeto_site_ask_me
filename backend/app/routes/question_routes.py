from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.question import Question
from app.models.user import User
from app.schemas.question_schema import QuestionCreate, QuestionResponse
from app.utils.media_detector import detect_media_type
from app.utils.shorts_coverter_emoji import replace_shortcodes
from app.services.xp_service import XPService
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/questions", tags=["Questions"])
auth = HTTPBearer()

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

def get_question_reactions(question_id: int, db: Session, current_user: User = None):
    """Busca reações de uma pergunta"""
    from app.models.reaction import Reaction
    from app.schemas.reaction_schema import REACTIONS_MAP
    
    reactions = db.query(Reaction).filter(
        Reaction.content_type == 'question',
        Reaction.content_id == question_id
    ).all()
    
    counts = {}
    for reaction_type in REACTIONS_MAP.keys():
        counts[reaction_type] = 0
    
    for reaction in reactions:
        counts[reaction.reaction_type] += 1
    
    user_reaction = None
    if current_user:
        user_reaction_obj = db.query(Reaction).filter(
            Reaction.user_id == current_user.id,
            Reaction.content_type == 'question',
            Reaction.content_id == question_id
        ).first()
        user_reaction = user_reaction_obj.reaction_type if user_reaction_obj else None
    
    return counts, user_reaction

# ✅ Listar perguntas - CORRIGIDO PARA MANTER GÊNERO REAL EM ANÔNIMOS
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

    questions = query.order_by(Question.created_at.desc()).all()
    
    # Adicionar reações, author_name, gênero E AVATAR a cada pergunta
    for question in questions:
        reactions, user_reaction = get_question_reactions(question.id, db, current_user)
        question.reactions = reactions
        question.user_reaction = user_reaction
        
        # ✅ ADICIONA O GÊNERO DO USUÁRIO
        question.user_gender = question.user.gender
        # ✅ ADICIONA O AVATAR DO USUÁRIO
        question.user_avatar_url = question.user.avatar_url
        
        # 👇 LÓGICA DE ANONIMATO - CORRIGIDA!
        if question.is_anonymous:
            # Moderadores veem o autor real, outros veem "Anônimo"
            if current_user.role in ['moderator', 'admin']:
                question.author_name = question.user.nickname
                question.author_gender = question.user.gender  # ✅ Gênero real
                question.author_avatar_url = question.user.avatar_url  # ✅ Avatar real
            else:
                question.author_name = "Anônimo"
                question.author_gender = question.user.gender  # ✅ CORREÇÃO: Mantém gênero real!
                question.author_avatar_url = None  # ✅ Anônimo sem avatar
        else:
            question.author_name = question.user.nickname
            question.author_gender = question.user.gender
            question.author_avatar_url = question.user.avatar_url  # ✅ Avatar real
    
    return questions

# 🚀 Criar pergunta - CORRIGIDO PARA MANTER GÊNERO REAL EM ANÔNIMOS
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

    # Criar pergunta
    new_question = Question(
        title=title,
        description=description,
        category=category,
        media_url=question.media_url,
        media_type=media_type,
        user_id=current_user.id,
        is_anonymous=question.is_anonymous
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)

    # Adicionar XP
    xp_result = XPService.add_xp(db, current_user.id, "create_question", new_question.id)
    if xp_result and xp_result["level_up"]:
        print(f"🎉 {current_user.name} subiu para level {xp_result['new_level']}!")
    
    # Adicionar reações
    reactions, user_reaction = get_question_reactions(new_question.id, db, current_user)
    new_question.reactions = reactions
    new_question.user_reaction = user_reaction
    
    # 👇 ADICIONAR author_name, author_gender E author_avatar_url - CORRIGIDO!
    if new_question.is_anonymous:
        new_question.author_name = "Anônimo"
        new_question.author_gender = current_user.gender  # ✅ CORREÇÃO: Mantém gênero real!
        new_question.author_avatar_url = None  # ✅ Anônimo sem avatar
    else:
        new_question.author_name = current_user.nickname
        new_question.author_gender = current_user.gender
        new_question.author_avatar_url = current_user.avatar_url  # ✅ Avatar do usuário
    
    return new_question