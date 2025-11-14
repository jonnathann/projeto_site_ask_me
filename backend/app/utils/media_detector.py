import httpx
import os

async def detect_media_type(url: str) -> str:
    # 1️⃣ Primeiro tenta HEAD normalmente
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=5) as client:
            response = await client.head(url)

        content_type = response.headers.get("Content-Type", "")

        if "image" in content_type:
            return "image"
        if "video" in content_type:
            return "video"
    except:
        pass  # Se der erro, ignora e vai para o fallback

    # 2️⃣ Fallback: detectar pela extensão do link
    ext = os.path.splitext(url)[1].lower()

    image_exts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"]
    video_exts = [".mp4", ".webm", ".mov", ".avi", ".mkv"]

    if ext in image_exts:
        return "image"
    if ext in video_exts:
        return "video"

    # 3️⃣ Se não descobrir de jeito nenhum
    return "other"
