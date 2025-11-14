from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.question import Question
from app.schemas.question_schema import QuestionCreate, QuestionResponse
from app.utils.media_detector import detect_media_type  # ⬅️ IMPORTANTE

router = APIRouter(prefix="/questions", tags=["Questions"])

# ✅ Listar todas as perguntas (com filtros opcionais)
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


# 🚀 Atualizado: Criar pergunta com mídia
@router.post("/", response_model=QuestionResponse)
async def create_question(question: QuestionCreate, db: Session = Depends(get_db)):

    media_type = None
    if question.media_url:
        media_type = await detect_media_type(question.media_url)

    new_question = Question(
        title=question.title,
        description=question.description,
        category=question.category,
        media_url=question.media_url,
        media_type=media_type
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question