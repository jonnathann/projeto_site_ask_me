from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from jose import jwt
from fastapi.security import HTTPAuthorizationCredentials
from app.database.db import get_db
from app.models.user import User
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM

auth = HTTPBearer(auto_error=False)

async def check_user_blocked(
    credentials: HTTPAuthorizationCredentials = Depends(auth),
    db: Session = Depends(get_db)
):
    if not credentials:
        print("🔍 Nenhuma credencial enviada")
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = credentials.credentials
    print(f"🔍 Token recebido: {token[:20]}...")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        if not user_id:
            raise HTTPException(status_code=401, detail="Token inválido")

        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")

        if not user.is_active:
            if user.suspended_until and user.suspended_until < datetime.utcnow():
                user.is_active = True
                user.suspended_until = None
                db.commit()
            else:
                raise HTTPException(
                    status_code=403,
                    detail="Usuário bloqueado. Entre em contato com a moderação."
                )

        return user

    except HTTPException:
        raise
    except Exception as e:
        print(f"🔍 Erro na decodificação JWT: {e}")
        raise HTTPException(status_code=401, detail="Token inválido")
