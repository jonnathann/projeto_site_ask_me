from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.question import Question
from app.schemas.question_schema import QuestionCreate, QuestionResponse

router = APIRouter(prefix="/questions", tags=["Questions"])

# ✅ Listar todas as perguntas
@router.get("/", response_model=list[QuestionResponse])
def list_questions(db: Session = Depends(get_db)):
    questions = db.query(Question).all()
    return questions

# ✅ Criar nova pergunta
@router.post("/", response_model=QuestionResponse)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    new_question = Question(title=question.title, description=question.description)
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question
