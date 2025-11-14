import re

# Mapeamento de shortcodes -> emojis
EMOJI_MAP = {
    # --- Emojis de Rosto e Sentimentos (Faces & Emotions) ---
    "smile": "😄",
    "laugh": "😂",
    "joy": "🤣",
    "heart_eyes": "😍",
    "kiss": "😘",
    "blush": "😊",
    "worry": "😟",
    "sad": "😞",
    "cry": "😢",
    "crying_face": "😭",
    "angry": "😠",
    "rage": "😡",
    "cool": "😎",
    "smirk": "😏",
    "wink": "😉",
    "sweat_smile": "😅",
    "thinking": "🤔",
    "pensive": "😔",
    "sleep": "😴",
    "vomit": "🤮",
    "mask": "😷",
    "ghost": "👻",
    "skull": "💀",
    "alien": "👽",
    "robot": "🤖",
    "clown": "🤡",

    # --- Gestos com as Mãos (Hand Gestures) ---
    "thumbs_up": "👍",
    "thumbs_down": "👎",
    "ok_hand": "👌",
    "clap": "👏",
    "wave": "👋",
    "muscle": "💪",
    "pray": "🙏",
    "handshake": "🤝",
    "raised_hand": "✋",
    "punch": "👊",
    "peace": "✌️",
    "fist": "✊",

    # --- Corações e Símbolos (Hearts & Symbols) ---
    "heart": "❤️",
    "broken_heart": "💔",
    "sparkles": "✨",
    "star": "⭐",
    "fire": "🔥",
    "check": "✅",
    "x": "❌",
    "warning": "⚠️",
    "exclamation": "❗",
    "question": "❓",
    "dollar": "💰",
    "bomb": "💣",
    "bell": "🔔",
    "light_bulb": "💡",
    "anchor": "⚓",

    # --- Pessoas e Atividades (People & Activities) ---
    "person": "👤",
    "man": "👨",
    "woman": "👩",
    "child": "🧒",
    "baby": "👶",
    "worker": "👷",
    "police": "👮",
    "doctor": "🧑‍⚕️",
    "singer": "🎤",
    "runner": "🏃",
    "dance": "💃",
    "party": "🥳",
    "game": "🎮",
    "soccer": "⚽",
    "basketball": "🏀",
    "trophy": "🏆",

    # --- Comida e Bebidas (Food & Drink) ---
    "pizza": "🍕",
    "burger": "🍔",
    "fries": "🍟",
    "taco": "🌮",
    "sushi": "🍣",
    "ice_cream": "🍦",
    "donut": "🍩",
    "coffee": "☕",
    "tea": "🍵",
    "beer": "🍺",
    "wine": "🍷",
    "cocktail": "🍸",
    
    # --- Animais (Animals) ---
    "dog": "🐶",
    "cat": "🐱",
    "mouse": "🐭",
    "lion": "🦁",
    "monkey": "🐒",
    "tiger": "🐅",
    "bear": "🐻",
    "rabbit": "🐰",
    "turtle": "🐢",
    "snake": "🐍",
    "bird": "🐦",
    "whale": "🐳",
    "bug": "🐛",
    
    # --- Viagem e Lugares (Travel & Places) ---
    "car": "🚗",
    "bus": "🚌",
    "airplane": "✈️",
    "rocket": "🚀",
    "train": "🚂",
    "house": "🏠",
    "office": "🏢",
    "school": "🏫",
    "beach": "🏖️",
    "city": "🏙️",
    "mountain": "⛰️",

    # --- Objetos e Tecnologia (Objects & Technology) ---
    "phone": "📱",
    "computer": "💻",
    "camera": "📷",
    "book": "📚",
    "money": "💸",
    "gift": "🎁",
    "watch": "⌚",
    "calendar": "📅",
    "scissors": "✂️",
    "lock": "🔒",
}

# Regex para pegar qualquer coisa entre dois :
SHORTCODE_PATTERN = re.compile(r":([a-zA-Z0-9_]+):")

def replace_shortcodes(text: str) -> str:
    if not isinstance(text, str):
        return text

    def repl(match):
        key = match.group(1)
        return EMOJI_MAP.get(key, match.group(0))  # se não existir, mantém original

    return SHORTCODE_PATTERN.sub(repl, text)