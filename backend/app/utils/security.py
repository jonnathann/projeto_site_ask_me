import bcrypt

def hash_password(password: str) -> str:
    # Converter para bytes
    password_bytes = password.encode('utf-8')
    
    # Truncar se necessário (raro em casos normais)
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    # Gerar salt e hash com bcrypt diretamente
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    
    # Retornar como string
    return hashed_bytes.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # Converter ambos para bytes
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        
        # Truncar senha se necessário
        if len(password_bytes) > 72:
            password_bytes = password_bytes[:72]
        
        # Verificar com bcrypt
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception as e:
        print(f"Erro na verificação: {e}")
        return False