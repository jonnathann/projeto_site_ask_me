from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.comment import Comment
from app.models.answer import Answer
from app.schemas.comment_schema import CommentCreate, CommentResponse
from app.utils.media_detector import detect_media_type

# 🔥 IMPORTANTE: função shortcodes -> emojis
from app.utils.shorts_coverter_emoji import replace_shortcodes

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.post("/{answer_id}", response_model=CommentResponse)
async def create_comment(answer_id: int, comment: CommentCreate, db: Session = Depends(get_db)):

    answer = db.query(Answer).filter(Answer.id == answer_id).first()
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")

    # 🟡 1) Aplicar shortcodes no texto
    processed_content = replace_shortcodes(comment.content)

    # 🟡 2) Detectar mídia (se houver)
    media_type = None
    if comment.media_url:
        media_type = await detect_media_type(comment.media_url)

    new_comment = Comment(
        answer_id=answer_id,
        content=processed_content,
        media_url=comment.media_url,
        media_type=media_type
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment
