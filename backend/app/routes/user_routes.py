from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pathlib import Path
import shutil
import os
import hashlib
import time
from datetime import datetime
from typing import Optional

from app.database.db import get_db
from app.models.user import User
from app.schemas.user_schema import (
    UserCreate,
    UserLogin,
    UserResponse,
    ProfileUpdate,
    UserProfileResponse
)
from app.utils.security import hash_password, verify_password
from app.utils.jwt_handler import create_token
from app.utils.shorts_coverter_emoji import replace_shortcodes
from app.dependencies.block_check import check_user_blocked

# ==================== CONFIGURAÇÃO DE UPLOAD ====================
BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads" / "avatars"
STATIC_DIR = BASE_DIR / "static" / "images"

# Garantir que os diretórios existem
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

DEFAULT_AVATAR_MALE = "/static/images/avatar-male-default.png"
DEFAULT_AVATAR_FEMALE = "/static/images/avatar-female-default.png"
DEFAULT_AVATAR_OTHER = "/static/images/avatar-default.png"

# ==================== AVATAR MANAGER ====================
class AvatarManager:
    def __init__(self):
        self.UPLOAD_DIR = UPLOAD_DIR
    
    def generate_filename(self, user_id: int, file: UploadFile) -> str:
        """Gera nome único para o arquivo"""
        timestamp = int(time.time())
        # Usar hash para garantir unicidade
        file_hash = hashlib.md5(f"{user_id}{timestamp}{file.filename}".encode()).hexdigest()[:8]
        # Manter a extensão original do arquivo
        original_ext = Path(file.filename).suffix if file.filename else ".png"
        return f"avatar_{user_id}_{file_hash}{original_ext}"
    
    def save_avatar(self, user_id: int, file: UploadFile) -> str:
        """Salva novo avatar e retorna o caminho relativo"""
        filename = self.generate_filename(user_id, file)
        file_path = self.UPLOAD_DIR / filename
        
        # Salvar arquivo
        with open(file_path, "wb") as buffer:
            content = file.file.read()
            buffer.write(content)
        
        return f"/uploads/avatars/{filename}"
    
    def delete_old_avatars(self, user_id: int, keep_filename: Optional[str] = None):
        """Deleta todos os avatares antigos do usuário, mantendo o atual"""
        deleted = []
        keep_file_path = None
        
        if keep_filename:
            keep_file_path = self.UPLOAD_DIR / keep_filename
        
        try:
            # Procurar por todos os avatares do usuário
            for file in self.UPLOAD_DIR.glob(f"avatar_{user_id}_*"):
                # Se for o arquivo que queremos manter, pular
                if keep_file_path and file == keep_file_path:
                    continue
                
                try:
                    file.unlink()  # Deleta o arquivo
                    deleted.append(file.name)
                except Exception as e:
                    print(f"Erro ao deletar {file.name}: {e}")
        except Exception as e:
            print(f"Erro ao listar arquivos: {e}")
        
        return deleted
    
    def get_current_avatar_filename(self, avatar_url: Optional[str]) -> Optional[str]:
        """Extrai nome do arquivo da URL do avatar"""
        if not avatar_url:
            return None
        
        # Se a URL contém /uploads/avatars/, extrair o nome do arquivo
        if '/uploads/avatars/' in avatar_url:
            return avatar_url.split('/')[-1]
        elif avatar_url.startswith('/'):
            return avatar_url.split('/')[-1]
        return avatar_url

# Instância global do AvatarManager
avatar_manager = AvatarManager()

router = APIRouter(prefix="/users", tags=["Users"])

# ==================== ENDPOINTS ====================

# 🔹 Registro de usuário
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    if db.query(User).filter(User.nickname == user.nickname).first():
        raise HTTPException(status_code=400, detail="Nickname já em uso")

    gender_lower = user.gender.lower()

    if gender_lower == "masculino":
        avatar_url = DEFAULT_AVATAR_MALE
    elif gender_lower == "feminino":
        avatar_url = DEFAULT_AVATAR_FEMALE
    else:
        avatar_url = DEFAULT_AVATAR_OTHER

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        nickname=user.nickname,
        gender=user.gender,
        bio=replace_shortcodes(user.bio) if user.bio else None,
        avatar_url=avatar_url,
        level=1,
        xp=0,
        is_active=True,
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

# 🔹 Login
@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = create_token({"user_id": user.id})
    return {"access_token": token, "token_type": "bearer"}

# 🔹 Usuário logado
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(check_user_blocked)):
    return current_user

# 🔹 Perfil por ID
@router.get("/{user_id}", response_model=UserProfileResponse)
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_user_blocked)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Usuário suspenso")
    return user

# 🔹 Atualizar avatar (COM EXCLUSÃO DE AVATARES ANTIGOS)
@router.put("/{user_id}/avatar")
async def update_avatar(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(check_user_blocked)
):
    if current_user.id != user_id and current_user.role not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Não autorizado")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # Validação do tipo de arquivo
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Tipo de arquivo não suportado")

    # Validação do tamanho do arquivo (5MB máximo)
    file_size = 0
    chunk_size = 1024 * 1024  # 1MB por chunk
    
    # Ler para verificar tamanho
    while True:
        chunk = await file.read(chunk_size)
        if not chunk:
            break
        file_size += len(chunk)
    
    # Voltar ao início do arquivo
    await file.seek(0)
    
    if file_size > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(status_code=400, detail="Arquivo muito grande. Máximo 5MB.")
    
    # 1. Extrair nome do arquivo atual ANTES de substituir
    current_filename = avatar_manager.get_current_avatar_filename(user.avatar_url)
    
    # 2. Salvar novo avatar
    try:
        new_avatar_url = avatar_manager.save_avatar(user_id, file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar arquivo: {str(e)}")
    
    # 3. Atualizar no banco de dados
    user.avatar_url = new_avatar_url
    db.commit()
    db.refresh(user)
    
    # 4. Deletar avatares antigos (exceto o novo)
    new_filename = new_avatar_url.split('/')[-1]
    deleted_files = avatar_manager.delete_old_avatars(user_id, keep_filename=new_filename)
    
    # Log para debug (opcional)
    print(f"[Avatar] Usuário {user_id}: Avatar atualizado para {new_filename}")
    if deleted_files:
        print(f"[Avatar] Usuário {user_id}: Arquivos antigos deletados: {deleted_files}")
    
    return {
        "message": "Avatar atualizado com sucesso", 
        "avatar_url": new_avatar_url,
        "deleted_old_files": len(deleted_files)
    }

# 🔹 Atualizar perfil
@router.put("/{user_id}/profile", response_model=UserProfileResponse)
def update_profile(
    user_id: int,
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_user_blocked)
):
    if current_user.id != user_id and current_user.role not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Não autorizado")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if profile_data.nickname and profile_data.nickname != user.nickname:
        if db.query(User).filter(
            User.nickname == profile_data.nickname,
            User.id != user_id
        ).first():
            raise HTTPException(status_code=400, detail="Nickname já em uso")

    if profile_data.nickname is not None:
        user.nickname = profile_data.nickname

    if profile_data.bio is not None:
        user.bio = replace_shortcodes(profile_data.bio) if profile_data.bio else None

    db.commit()
    db.refresh(user)

    return user

# 🔹 Posts do usuário (com serialização segura)
@router.get("/{user_id}/posts")
def get_user_posts(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_user_blocked)
):
    from app.models.question import Question

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    try:
        posts = db.query(Question).filter(Question.user_id == user_id).order_by(Question.created_at.desc()).all()
        serialized_posts = [
            {
                "id": post.id,
                "title": getattr(post, "title", ""),
                "content": getattr(post, "content", ""),
                "created_at": post.created_at.isoformat() if post.created_at else None,
                "user_id": post.user_id
            }
            for post in posts
        ]
    except Exception as e:
        print(f"Erro ao serializar posts: {e}")
        serialized_posts = []

    return {"user_id": user_id, "total_posts": len(serialized_posts), "posts": serialized_posts}

# 🔹 (OPCIONAL) Endpoint para limpar avatares antigos manualmente
@router.delete("/{user_id}/cleanup-avatars")
def cleanup_old_avatars(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_user_blocked)
):
    """Limpa avatares antigos do usuário (apenas mantém o atual)"""
    if current_user.id != user_id and current_user.role not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Não autorizado")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    current_filename = avatar_manager.get_current_avatar_filename(user.avatar_url)
    deleted_files = avatar_manager.delete_old_avatars(user_id, keep_filename=current_filename)
    
    return {
        "message": "Limpeza de avatares concluída",
        "kept_file": current_filename,
        "deleted_files": deleted_files,
        "total_deleted": len(deleted_files)
    }