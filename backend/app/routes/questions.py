from fastapi import APIRouter

router = APIRouter(prefix="/questions", tags=["Perguntas"])

@router.get("/")
def list_questions():
    return {"questions": ["De zero a dez o quanto vcs gostam de bolo de chocolate?", "O que acham do noma Anastácia?"]}

