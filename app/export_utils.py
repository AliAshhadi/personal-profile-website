import io
import re
import zipfile
from pathlib import Path
from typing import Iterable, Set

PROJECT_ROOT = Path(__file__).resolve().parent.parent
BASE_TEMPLATE_STYLE = PROJECT_ROOT / "style.css"
PLACEHOLDER_IMAGE = PROJECT_ROOT / "pic" / "profile.png"


def load_base_style() -> str:
    if BASE_TEMPLATE_STYLE.exists():
        return BASE_TEMPLATE_STYLE.read_text(encoding="utf-8")
    return ""


def zip_directory(folder: Path) -> bytes:
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in folder.rglob("*"):
            arcname = path.relative_to(folder)
            zf.write(path, arcname)
    buffer.seek(0)
    return buffer.read()


def safe_folder_name(name: str, used: Iterable[str]) -> str:
    base = re.sub(r"\s+", "_", name.strip())
    base = re.sub(r"[^\w\-\u0600-\u06FF_]+", "", base) or "person"
    used_set: Set[str] = set(used)
    if base not in used_set:
        return base
    counter = 2
    while f"{base}_{counter}" in used_set:
        counter += 1
    return f"{base}_{counter}"
