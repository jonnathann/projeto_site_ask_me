from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.user import User
from datetime import datetime
from jose import jwt
from app.utils.jwt_handler import SECRET_KEY, ALGORITHM
from fastapi.security import HTTPBearer

auth = HTTPBearer()

async def check_user_blocked(credentials = Depends(auth), db: Session = Depends(get_db)):
    """Dependência que verifica se o usuário está bloqueado"""
    token = credentials.credentials
    print(f"🔍 Token recebido: {token}")  # 👈 DEBUG
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        print(f"🔍 User ID decodificado: {user_id}")  # 👈 DEBUG
        
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            print("🔍 Usuário não encontrado no banco")  # 👈 DEBUG
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        
        print(f"🔍 Usuário {user.name} - is_active: {user.is_active}")  # 👈 DEBUG
        
        # VERIFICAR BLOQUEIO
        if not user.is_active:
            print("🔍 USUÁRIO BLOQUEADO - Verificando data...")  # 👈 DEBUG
            if user.suspended_until and user.suspended_until < datetime.utcnow():
                # Bloqueio expirou - reativar
                print("🔍 Bloqueio expirado - reativando usuário")  # 👈 DEBUG
                user.is_active = True
                user.suspended_until = None
                db.commit()
            else:
                print("🔍 ERRO 403: Usuário ainda bloqueado")  # 👈 DEBUG
                raise HTTPException(
                    status_code=403, 
                    detail="Usuário bloqueado. Entre em contato com a moderação."
                )
        
        return user
        
    except HTTPException:
        print("🔍 HTTPException relançada")  # 👈 DEBUG
        raise
    except Exception as e:
        print(f"🔍 Erro na decodificação: {e}")  # 👈 DEBUG
        raise HTTPException(status_code=401, detail="Token inválido")