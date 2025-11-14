# app/utils/media_detector.py
import httpx
import os

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg"}
# Adicionado .m3u8 e .mpd para cobrir playlists/manifestos de vídeo streaming
VIDEO_EXTS = {".mp4", ".webm", ".mov", ".avi", ".mkv", ".m3u8", ".mpd"}
# AUMENTADO: tamanho do buffer que vamos ler (4KB para dar mais chance a magic headers deslocados)
SNIPPET_BYTES = 4096

async def detect_media_type(url: str) -> str:
    """
    Detecta tipo de mídia de forma robusta e rápida:
    0) Detecta por domínio (YouTube, Vimeo, etc.)
    1) Detecta por extensão (rápido)
    2) HEAD com timeout curto -> usa Content-Type se confiável
    3) GET parcial (Range: bytes=0-<N>) -> analisa Content-Type e magic bytes / texto inicial
    4) Fallback por extensão se URL respondeu OK
    Retorna: "image", "video", "gif" ou "other"
    """

    if not url or not isinstance(url, str):
        return "other"
    url = url.strip()

    # --- 0) Detecção por Domínio (Plataformas de Vídeo) ---
    if "youtube.com" in url or "youtu.be" in url or "vimeo.com" in url:
        return "video"

    # --- 1) Detectar por extensão (mais rápido) ---
    ext = os.path.splitext(url.split("?")[0])[1].lower()
    if ext in IMAGE_EXTS:
        if ext == ".gif":
            return "image"
        return "image"
    if ext in VIDEO_EXTS:
        return "video"

    # Configuração do httpx: Aumentado o timeout
    timeout = httpx.Timeout(5.0, connect=1.0)  # total 5s, connect 1s
    async with httpx.AsyncClient(follow_redirects=True, timeout=timeout) as client:

        # --- 2) Tentar HEAD -- conteúdo se disponível
        try:
            head = await client.head(url)
            if head.status_code == 200:
                ct = head.headers.get("Content-Type", "").lower()
                if ct:
                    if "image" in ct:
                        return "image"
                    if "video" in ct:
                        return "video"
                    # hls/dash content types
                    if "mpegurl" in ct or "application/vnd.apple.mpegurl" in ct or "application/x-mpegurl" in ct:
                        return "video"
                    if "dash" in ct or "application/dash+xml" in ct:
                        return "video"
        except Exception:
            pass

        # --- 3) GET parcial: tentar Range byte=0-SNIPPET_BYTES-1 (baixa só um trecho)
        try:
            # Note o uso do novo SNIPPET_BYTES (4096)
            headers = {"Range": f"bytes=0-{SNIPPET_BYTES - 1}"}
            resp = await client.get(url, headers=headers)
            if resp.status_code in (200, 206):
                # 3.1 Checar content-type do GET
                ct = resp.headers.get("Content-Type", "").lower()
                if ct:
                    if "image" in ct:
                        return "image"
                    if "video" in ct:
                        return "video"
                    if "mpegurl" in ct or "application/vnd.apple.mpegurl" in ct or "application/x-mpegurl" in ct:
                        return "video"
                    if "dash" in ct or "application/dash+xml" in ct:
                        return "video"

                # 3.2 Analisar os bytes iniciais (magic numbers)
                content = resp.content[:SNIPPET_BYTES]  # bytes (até 4096)

                # Checar GIF: começa com ASCII "GIF87a" ou "GIF89a"
                if content.startswith(b"GIF87a") or content.startswith(b"GIF89a"):
                    return "image"

                # Checar PNG: primeiros 8 bytes 89 50 4E 47 0D 0A 1A 0A
                if content.startswith(b"\x89PNG\r\n\x1a\n"):
                    return "image"

                # Checar JPG: FF D8 FF
                if content.startswith(b"\xff\xd8\xff"):
                    return "image"

                # Checar WEBP (CORREÇÃO FINAL): Busca por WEBP nos primeiros 512 bytes do snippet
                if content.startswith(b"RIFF") and b"WEBP" in content[:512]:
                    return "image"

                # Checar MP4/ISO base media file: procurar 'ftyp' dentro dos primeiros 64 bytes
                if b"ftyp" in content[:64]:
                    return "video"

                # Checar 'moov' ou 'mdat' nos primeiros 512 bytes
                if b"moov" in content[:512] or b"mdat" in content[:512]:
                    return "video"

                # Checar HLS playlist textual
                try:
                    text_head = content.decode("utf-8", errors="ignore").strip().upper()
                    if text_head.startswith("#EXTM3U") or "#EXTINF" in text_head:
                        return "video"
                    # Checar DASH manifest
                    if "<MPD" in text_head or "MPD" in text_head:
                        return "video"
                except Exception:
                    pass

                # Fallback por extensão
                if ext:
                    if ext in IMAGE_EXTS:
                        return "image"
                    if ext in VIDEO_EXTS:
                        return "video"

                return "other"
            else:
                # GET retornou erro (404, 403, 5xx)
                if ext:
                    if ext in IMAGE_EXTS:
                        return "image"
                    if ext in VIDEO_EXTS:
                        return "video"
                return "other"
        except Exception:
            # GET parcial falhou
            if ext:
                if ext in IMAGE_EXTS:
                    return "image"
                if ext in VIDEO_EXTS:
                    return "video"
            return "other"

    # fallback final
    return "other"