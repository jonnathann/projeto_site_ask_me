from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.question import Question
from app.schemas.question_schema import QuestionCreate, QuestionResponse

from app.utils.media_detector import detect_media_type  # ⬅️ Detector de mídia
from app.utils.shorts_coverter_emoji import replace_shortcodes  # ⬅️ Shortcodes → Emojis

router = APIRouter(prefix="/questions", tags=["Questions"])


# ✅ Listar perguntas (com filtros)
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


# 🚀 Criar pergunta com mídia + emojis nos shortcodes
@router.post("/", response_model=QuestionResponse)
async def create_question(question: QuestionCreate, db: Session = Depends(get_db)):

    # 🔹 1) Converter shortcodes → emojis automaticamente
    title = replace_shortcodes(question.title)
    description = replace_shortcodes(question.description)
    category = replace_shortcodes(question.category)

    # 🔹 2) Detectar tipo de mídia
    media_type = None
    if question.media_url:
        media_type = await detect_media_type(question.media_url)

    # 🔹 3) Criar pergunta já com emojis convertidos
    new_question = Question(
        title=title,
        description=description,
        category=category,
        media_url=question.media_url,
        media_type=media_type
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question
