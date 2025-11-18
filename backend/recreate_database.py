# recreate_database.py
from app.database.db import engine, Base
from app.models.user import User
from app.models.question import Question
from app.models.answer import Answer
from app.models.comment import Comment
from app.models.reaction import Reaction
from app.models.report import Report
from app.models.notification import Notification  # 👈 ADICIONAR ESTA LINHA

def recreate_tables():
    print("🗑️  Apagando tabelas antigas...")
    Base.metadata.drop_all(bind=engine)
    
    print("🛠️  Criando novas tabelas...")
    Base.metadata.create_all(bind=engine)
    
    print("✅ Banco recriado com sucesso!")
    print("📊 Tabelas criadas:")
    print("   - users")
    print("   - questions") 
    print("   - answers")
    print("   - comments")
    print("   - reactions")
    print("   - reports")
    print("   - notifications 👈 NOVA!")

if __name__ == "__main__":
    recreate_tables()