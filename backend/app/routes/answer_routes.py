from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.answer import Answer
from app.models.question import Question
from app.schemas.answer_schema import AnswerCreate, AnswerResponse
from app.utils.media_detector import detect_media_type
import asyncio

router = APIRouter(prefix="/answers", tags=["Answers"])

@router.post("/{question_id}", response_model=AnswerResponse)
async def create_answer(question_id: int, answer: AnswerCreate, db: Session = Depends(get_db)):

    # verifica se pergunta existe
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    media_type = None
    if answer.media_url:
        media_type = await detect_media_type(answer.media_url)

    new_answer = Answer(
        question_id=question_id,
        content=answer.content,
        media_url=answer.media_url,
        media_type=media_type
    )

    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)

    return new_answer
