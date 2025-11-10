from fastapi import FastAPI
from app.routes.user_routes import router as user_router
from app.routes.question_routes import router as question_router  # sem o S!

app = FastAPI(title="Ask Me API")

app.include_router(user_router)
app.include_router(question_router)

