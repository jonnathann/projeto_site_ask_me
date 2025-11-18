from fastapi import FastAPI
# Imports das rotas principais
from app.routes.question_routes import router as question_router  
from app.routes.answer_routes import router as answer_router
from app.routes.comment_routes import router as comment_router
from app.routes.user_routes import router as user_router
from app.routes.reaction_routes import router as reaction_router
from app.routes.report_routes import router as report_router  # 👈 NOVA ROTA
from app.routes.admin_routes import router as admin_router  # 👈 ADICIONAR


app = FastAPI(title="Ask Me API")

# Incluindo rotas principais
app.include_router(user_router) 
app.include_router(question_router) 
app.include_router(answer_router) 
app.include_router(comment_router)
app.include_router(reaction_router)
app.include_router(report_router)  # 👈 ADICIONAR ESTA LINHA
app.include_router(admin_router)  # 👈 ADICIONAR ESTA LINHA


@app.get("/")
def root():
    return {"message": "Ask Me API está funcionando!"}