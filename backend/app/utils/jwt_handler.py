from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "SUPER_SECRET_CHAVE_AQUI"  # coloque uma no .env
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60 * 24  # 1 dia

def create_token(data: dict):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
