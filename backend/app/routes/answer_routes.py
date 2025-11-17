from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.answer import Answer
from app.models.question import Question
from app.models.user import User
from app.schemas.answer_schema import AnswerCreate, AnswerResponse
from app.utils.media_detector import detect_media_type
from app.utils.shorts_coverter_emoji import replace_shortcodes

# 👇 IMPORTS para autenticação
from fastapi.security import HTTPBearer
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/answers", tags=["Answers"])
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

@router.post("/{question_id}", response_model=AnswerResponse)
async def create_answer(
    question_id: int, 
    answer: AnswerCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # 👈 USUÁRIO LOGADO
):
    # Verifica se pergunta existe
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Converter shortcodes em emojis
    processed_content = replace_shortcodes(answer.content)

    media_type = None
    if answer.media_url:
        media_type = await detect_media_type(answer.media_url)

    # Criar resposta VINCULADA AO USUÁRIO
    new_answer = Answer(
        question_id=question_id,
        content=processed_content,
        media_url=answer.media_url,
        media_type=media_type,
        user_id=current_user.id  # 👈 VINCULANDO AO USUÁRIO
    )

    db.add(new_answer)
    db.commit()
    db.refresh(new_answer)
    return new_answer