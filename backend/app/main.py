from fastapi import FastAPI

# 👇 IMPORTS DAS ROTAS
from app.routes.question_routes import router as question_router  
from app.routes.answer_routes import router as answer_router
from app.routes.comment_routes import router as comment_router
from app.routes.user_routes import router as user_router
from app.routes.reaction_routes import router as reaction_router
from app.routes.report_routes import router as report_router
from app.routes.admin_routes import router as admin_router
from app.routes.notification_routes import router as notification_router  # 👈 ADICIONAR
from app.routes.test_routes import router as test_router  # 👈 ADICIONAR (TESTE PROVISÓRIO)
from app.routes.dashboard_routes import router as dashboard_router  # 👈 ADICIONAR




app = FastAPI(title="Ask Me API")

# 👇 INCLUINDO ROTAS PRINCIPAIS
app.include_router(user_router) 
app.include_router(question_router) 
app.include_router(answer_router) 
app.include_router(comment_router)
app.include_router(reaction_router)
app.include_router(report_router)
app.include_router(admin_router)
app.include_router(notification_router)  # 👈 ADICIONAR ESTA LINHA
app.include_router(test_router)  # 👈 ADICIONAR ESTA LINHA (TESTE PROVISÓRIO)
app.include_router(dashboard_router)  # 👈 ADICIONAR ESTA LINHA


@app.get("/")
def root():
    return {"message": "Ask Me API está funcionando!"}