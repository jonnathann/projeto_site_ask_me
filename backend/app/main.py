from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

# 👇 IMPORTS DAS ROTAS
from app.routes.question_routes import router as question_router  
from app.routes.answer_routes import router as answer_router
from app.routes.comment_routes import router as comment_router
from app.routes.user_routes import router as user_router
from app.routes.reaction_routes import router as reaction_router
from app.routes.report_routes import router as report_router
from app.routes.admin_routes import router as admin_router
from app.routes.notification_routes import router as notification_router
from app.routes.test_routes import router as test_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.friendship_routes import router as friendship_router
from app.routes.leaderboard_routes import router as leaderboard_router
from app.routes.badge_routes import router as badge_router
from app.routes.chat_routes import router as chat_router

# ==================== CRIAÇÃO DO APP ====================
app = FastAPI(title="Ask Me API")

# ==================== CORS ====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== ARQUIVOS ESTÁTICOS ====================
# Caminho base do projeto (pasta raiz)
BASE_DIR = Path(__file__).resolve().parent.parent

UPLOADS_DIR = BASE_DIR / "uploads"
STATIC_DIR = BASE_DIR / "static"

# Cria as pastas se não existirem
(UPLOADS_DIR / "avatars").mkdir(parents=True, exist_ok=True)
(STATIC_DIR / "images").mkdir(parents=True, exist_ok=True)

# Monta os diretórios para servir arquivos
app.mount(
    "/uploads",
    StaticFiles(directory=UPLOADS_DIR),
    name="uploads"
)

app.mount(
    "/static",
    StaticFiles(directory=STATIC_DIR),
    name="static"
)

# ==================== INCLUSÃO DAS ROTAS ====================
app.include_router(user_router)
app.include_router(question_router)
app.include_router(answer_router)
app.include_router(comment_router)
app.include_router(reaction_router)
app.include_router(report_router)
app.include_router(admin_router)
app.include_router(notification_router)
app.include_router(test_router)
app.include_router(dashboard_router)
app.include_router(friendship_router)
app.include_router(leaderboard_router)
app.include_router(badge_router)
app.include_router(chat_router)

# ==================== ROTA RAIZ ====================
@app.get("/")
def root():
    return {"message": "Ask Me API está funcionando!"}
