from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.question import Question
from app.models.user import User
from app.schemas.question_schema import QuestionCreate, QuestionResponse
from app.utils.media_detector import detect_media_type
from app.utils.shorts_coverter_emoji import replace_shortcodes

# 👇 NOVOS IMPORTS para autenticação
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/questions", tags=["Questions"])
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

# ✅ Listar perguntas (com filtros) - PÚBLICO
@router.get("/", response_model=list[QuestionResponse])
def list_questions(
    db: Session = Depends(get_db),
    category: str | None = Query(None),
    term: str | None = Query(None)
):
    query = db.query(Question)

    if category:
        query = query.filter(Question.category.ilike(f"%{category}%"))

    if term:
        query = query.filter(Question.title.ilike(f"%{term}%"))

    questions = query.all()
    return questions

# 🚀 Criar pergunta - REQUER AUTENTICAÇÃO
@router.post("/", response_model=QuestionResponse)
async def create_question(
    question: QuestionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # 👈 USUÁRIO LOGADO
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
        user_id=current_user.id  # 👈 VINCULANDO AO USUÁRIO
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question