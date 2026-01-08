import re
from typing import Optional

MISSING_MARKERS = {"", "none", "-"}


def slugify_label(text: str, fallback: str = "row") -> str:
    """
    Convert a label into a slug that matches the front-end logic.
    - Replace whitespace with underscores
    - Keep Persian letters/digits/underscore/hyphen
    - Lowercase output
    """
    if text is None:
        text = ""
    slug = re.sub(r"\s+", "_", str(text).strip())
    slug = re.sub(r"[^\w\-\u0600-\u06FF_]+", "", slug)
    slug = slug.lower()
    return slug or fallback


def is_missing(value: Optional[str]) -> bool:
    """
    Treat empty string, None, 'none', or '-' (case-insensitive) as missing.
    """
    if value is None:
        return True
    text = str(value).strip()
    return text.lower() in MISSING_MARKERS


def normalize_phone(value: Optional[str]) -> str:
    """
    Phone normalization: if starts with + or 0, keep; otherwise prefix 0.
    """
    if value is None:
        return ""
    phone = str(value).strip()
    if not phone:
        return ""
    if phone.startswith("+") or phone.startswith("0"):
        return phone
    return f"0{phone}"


def clamp_channel(channel: int) -> int:
    return max(0, min(channel, 255))


def parse_hex_color(hex_color: str) -> Optional[tuple]:
    if not isinstance(hex_color, str):
        return None
    hex_color = hex_color.strip().lstrip("#")
    if len(hex_color) != 6:
        return None
    try:
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        return r, g, b
    except ValueError:
        return None


def format_hex_color(rgb: tuple) -> str:
    r, g, b = rgb
    return "#{:02x}{:02x}{:02x}".format(clamp_channel(r), clamp_channel(g), clamp_channel(b))


def adjust_color(hex_color: str, factor: float) -> str:
    """
    Lighten (>0) or darken (<0) a hex color by the given factor (0-1).
    """
    rgb = parse_hex_color(hex_color)
    if not rgb:
        return hex_color
    r, g, b = rgb
    if factor >= 0:
        r = r + (255 - r) * factor
        g = g + (255 - g) * factor
        b = b + (255 - b) * factor
    else:
        r = r * (1 + factor)
        g = g * (1 + factor)
        b = b * (1 + factor)
    return format_hex_color((int(r), int(g), int(b)))
