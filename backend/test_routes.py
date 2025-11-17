from app.main import app

print("🔍 Rotas registradas:")
for route in app.routes:
    print(f"  {route.methods} {route.path}")