from fastapi import FastAPI
from app.routes.user_routes import router as user_router
from app.routes.question_routes import router as question_router  # sem o S!
from app.routes.answer_routes import router as answer_router
from app.routes.comment_routes import router as comment_router




app = FastAPI(title="Ask Me API")

app.include_router(user_router) # incluindo rota para cadastro de usuários
app.include_router(question_router) # incluindo rota para criação de perguntas
app.include_router(answer_router) # incluindo rota para criação de respostas
app.include_router(comment_router) #incluinco rota para criação de comentério nas respostas