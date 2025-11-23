# create_initial_badges.py
from app.database.db import SessionLocal
from app.models.badge import Badge

def create_initial_badges():
    db = SessionLocal()
    
    badges_data = [
        # 🎯 Badges de Primeira Vez
        {
            "name": "Primeira Pergunta",
            "description": "Fez sua primeira pergunta na comunidade",
            "icon_url": "🎯",
            "criteria": "first_question",
            "requirement": 1,
            "xp_reward": 25,
            "is_secret": False
        },
        {
            "name": "Primeira Resposta", 
            "description": "Respondeu sua primeira pergunta",
            "icon_url": "💬",
            "criteria": "first_answer",
            "requirement": 1,
            "xp_reward": 30,
            "is_secret": False
        },
        {
            "name": "Primeiro Comentário",
            "description": "Comentou pela primeira vez",
            "icon_url": "💭",
            "criteria": "first_comment", 
            "requirement": 1,
            "xp_reward": 15,
            "is_secret": False
        },
        
        # 📊 Badges de Quantidade
        {
            "name": "Pergunteiro",
            "description": "Fez 10 perguntas",
            "icon_url": "❓",
            "criteria": "question_count",
            "requirement": 10,
            "xp_reward": 50,
            "is_secret": False
        },
        {
            "name": "Respondedor",
            "description": "Respondeu 20 perguntas", 
            "icon_url": "🎤",
            "criteria": "answer_count",
            "requirement": 20,
            "xp_reward": 75,
            "is_secret": False
        },
        {
            "name": "Comentarista",
            "description": "Fez 30 comentários",
            "icon_url": "💬",
            "criteria": "comment_count",
            "requirement": 30,
            "xp_reward": 60,
            "is_secret": False
        },
        
        # ❤️ Badges de Engajamento
        {
            "name": "Popular",
            "description": "Recebeu 50 reações no total",
            "icon_url": "❤️",
            "criteria": "reaction_count", 
            "requirement": 50,
            "xp_reward": 100,
            "is_secret": False
        },
        {
            "name": "Resposta Aceita",
            "description": "Teve uma resposta marcada como aceita",
            "icon_url": "✅",
            "criteria": "first_accepted_answer",
            "requirement": 1,
            "xp_reward": 50,
            "is_secret": False
        }
    ]
    
    for badge_data in badges_data:
        # Verificar se badge já existe
        existing = db.query(Badge).filter(Badge.name == badge_data["name"]).first()
        if not existing:
            badge = Badge(**badge_data)
            db.add(badge)
            print(f"✅ Criado badge: {badge_data['name']}")
    
    db.commit()
    db.close()
    print("🎉 Badges iniciais criados com sucesso!")

if __name__ == "__main__":
    create_initial_badges()