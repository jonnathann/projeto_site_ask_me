from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.question import Question

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.get("/")
def list_questions(db: Session = Depends(get_db)):
    questions = db.query(Question).all()
    return {"questions": [{"id": q.id, "title": q.title, "content": q.content} for q in questions]}

