from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.comment import Comment
from app.models.answer import Answer
from app.models.user import User
from app.schemas.comment_schema import CommentCreate, CommentResponse
from app.utils.media_detector import detect_media_type
from app.utils.shorts_coverter_emoji import replace_shortcodes

# 👇 IMPORTS para autenticação
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/comments", tags=["Comments"])
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

@router.post("/{answer_id}", response_model=CommentResponse)
async def create_comment(
    answer_id: int, 
    comment: CommentCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    answer = db.query(Answer).filter(Answer.id == answer_id).first()
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")

    # Aplicar shortcodes no texto
    processed_content = replace_shortcodes(comment.content)

    # Detectar mídia (se houver)
    media_type = None
    if comment.media_url:
        media_type = await detect_media_type(comment.media_url)

    # Criar comentário VINCULADO AO USUÁRIO (agora com is_anonymous)
    new_comment = Comment(
        answer_id=answer_id,
        content=processed_content,
        media_url=comment.media_url,
        media_type=media_type,
        user_id=current_user.id,
        is_anonymous=comment.is_anonymous  # 👈 NOVO CAMPO
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    # 👇 LÓGICA DE ANONIMATO PARA COMENTÁRIOS
    if new_comment.is_anonymous:
        new_comment.author_name = "Anônimo"
    else:
        new_comment.author_name = current_user.name
    
    return new_comment