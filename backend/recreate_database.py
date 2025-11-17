# recreate_database.py
from app.database.db import engine, Base
from app.models.user import User
from app.models.question import Question
from app.models.answer import Answer
from app.models.comment import Comment

def recreate_tables():
    print("🗑️  Apagando tabelas antigas...")
    Base.metadata.drop_all(bind=engine)
    
    print("🛠️  Criando novas tabelas...")
    Base.metadata.create_all(bind=engine)
    
    print("✅ Banco recriado com sucesso!")
    print("📊 Tabelas criadas:")
    print("   - users (com id, name, email, password_hash, avatar_url, bio, created_at)")
    print("   - questions (com user_id - NOVO!)")
    print("   - answers (com user_id - NOVO!)")
    print("   - comments (com user_id - NOVO!)")

if __name__ == "__main__":
    recreate_tables()