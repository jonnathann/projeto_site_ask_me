# backend/recreate_database.py
from app.database.db import engine, Base
from app.models.user import User
from app.models.question import Question
from app.models.answer import Answer
from app.models.comment import Comment
from app.models.reaction import Reaction
from app.models.report import Report
from app.models.notification import Notification
from app.models.friendship import Friendship
from app.models.badge import Badge  # 👈 ADICIONAR
from app.models.user_badge import UserBadge  # 👈 ADICIONAR
from app.models.conversation import Conversation  # 👈 ADICIONAR
from app.models.message import Message  # 👈 ADICIONAR

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
    print("   - notifications")
    print("   - friendships")
    print("   - badges")
    print("   - user_badges")
    print("   - conversations 👈 NOVA!")
    print("   - messages 👈 NOVA!")

if __name__ == "__main__":
    recreate_tables()