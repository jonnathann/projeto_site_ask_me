from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.question import Question
from app.schemas.question_schema import QuestionCreate, QuestionResponse

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


# ✅ Criar nova pergunta
@router.post("/", response_model=QuestionResponse)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    new_question = Question(
        title=question.title,
        description=question.description,
        category=question.category
    )
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question
