import html
import tempfile
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

from app.export_utils import PLACEHOLDER_IMAGE, load_base_style, safe_folder_name, zip_directory
from app.utils import adjust_color, is_missing, normalize_phone, slugify_label

DEFAULT_THEME = {
    "font": "Vazir",
    "fontFile": None,
    "defaultMode": "dark",
    "accent": {"style": "gradient", "color": "#2e7bc8", "solidColor": "#2e7bc8"},
    "text": {
        "light": {"title": "#444444", "subtitle": "#666666"},
        "dark": {"title": "#ffffff", "subtitle": "#cccccc"},
    },
    "background": {
        "light": {"page": "#f6f6f7", "card": "#ffffff"},
        "dark": {"page": "#1a1a1a", "card": "#333333"},
    },
}


def deep_merge(default: dict, override: dict) -> dict:
    result = dict(default)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(result.get(key), dict):
            result[key] = deep_merge(result[key], value)
        else:
            result[key] = value
    return result


def normalize_theme(theme: dict) -> dict:
    if not isinstance(theme, dict):
        return DEFAULT_THEME
    return deep_merge(DEFAULT_THEME, theme)


def derive_accent(theme: dict) -> Dict[str, str]:
    accent = theme.get("accent", {})
    style = accent.get("style", "gradient")
    base_color = accent.get("color", "#2e7bc8")
    solid_color = accent.get("solidColor", base_color)
    if style == "solid":
        start = solid_color
        end = solid_color
        hover_start = adjust_color(solid_color, 0.08)
        hover_end = adjust_color(solid_color, -0.08)
    else:
        start = adjust_color(base_color, 0.08)
        end = adjust_color(base_color, -0.08)
        hover_start = adjust_color(base_color, 0.16)
        hover_end = adjust_color(base_color, -0.12)
    link_color = start
    return {
        "accent_start": start,
        "accent_end": end,
        "accent_hover_start": hover_start,
        "accent_hover_end": hover_end,
        "link_color": link_color,
    }


def build_style(theme: dict, font_rel_path: Optional[str]) -> str:
    theme = normalize_theme(theme)
    accent = derive_accent(theme)
    light_bg = theme["background"]["light"]["page"]
    light_card = theme["background"]["light"]["card"]
    dark_bg = theme["background"]["dark"]["page"]
    dark_card = theme["background"]["dark"]["card"]
    style_overrides = f"""
:root {{
    --bg-gradient-start: {light_bg};
    --bg-gradient-end: {adjust_color(light_bg, 0.03)};
    --card-bg: {light_card};
    --text-color: {theme['text']['light']['title']};
    --subtitle-color: {theme['text']['light']['subtitle']};
    --accent-start: {accent['accent_start']};
    --accent-end: {accent['accent_end']};
    --accent-hover-start: {accent['accent_hover_start']};
    --accent-hover-end: {accent['accent_hover_end']};
    --footer-color: {theme['text']['light']['subtitle']};
    --link-color: {accent['link_color']};
}}

.dark-mode {{
    --bg-gradient-start: {dark_bg};
    --bg-gradient-end: {adjust_color(dark_bg, 0.06)};
    --card-bg: {dark_card};
    --text-color: {theme['text']['dark']['title']};
    --subtitle-color: {theme['text']['dark']['subtitle']};
    --accent-start: {accent['accent_start']};
    --accent-end: {accent['accent_end']};
    --accent-hover-start: {accent['accent_hover_start']};
    --accent-hover-end: {accent['accent_hover_end']};
    --footer-color: {theme['text']['dark']['subtitle']};
    --link-color: {accent['link_color']};
}}
"""
    font_family = theme.get("font", "Vazir")
    font_face = ""
    if font_family == "Custom" and font_rel_path:
        font_family = "CustomExportFont"
        font_format = "truetype"
        suffix = font_rel_path.lower()
        if suffix.endswith(".otf"):
            font_format = "opentype"
        elif suffix.endswith(".woff"):
            font_format = "woff"
        elif suffix.endswith(".woff2"):
            font_format = "woff2"
        font_face = f"""
@font-face {{
    font-family: '{font_family}';
    src: url('{font_rel_path}') format('{font_format}');
    font-weight: normal;
    font-style: normal;
}}
"""
    font_override = f"""
body {{
    font-family: '{font_family}', 'Vazir', sans-serif;
}}
"""
    base_css = load_base_style()
    return "\n".join([base_css, font_face, style_overrides, font_override])


def build_contacts(rows: List[dict], icons: Dict[str, dict], row_values: Dict[str, dict]) -> List[dict]:
    contacts: List[dict] = []
    for idx, row in enumerate(rows):
        slug = slugify_label(row.get("label", ""), f"row{idx + 1}")
        row_type = row.get("type", "link")
        data = row_values.get(slug)
        if not data:
            continue
        icon_svg = (icons.get(row.get("icon")) or {}).get("svg", "")

        if row_type == "phone":
            label = data.get("value") if isinstance(data, dict) else str(data)
            if is_missing(label):
                continue
            normalized_value = data.get("normalized") if isinstance(data, dict) else None
            href_value = normalized_value or normalize_phone(label)
            href = f"tel:{href_value}"
            contacts.append(
                {
                    "type": "phone",
                    "label": label,
                    "href": href,
                    "icon": icon_svg,
                    "dir": "ltr",
                }
            )
        elif row_type == "email":
            label = data.get("value") if isinstance(data, dict) else str(data)
            if is_missing(label):
                continue
            href = f"mailto:{label}"
            contacts.append(
                {
                    "type": "email",
                    "label": label,
                    "href": href,
                    "icon": icon_svg,
                    "dir": "ltr",
                }
            )
        else:
            href = data.get("href") if isinstance(data, dict) else str(data)
            if is_missing(href):
                continue
            label = ""
            if isinstance(data, dict):
                label = data.get("label") or row.get("label", slug)
            else:
                label = row.get("label", slug)
            contacts.append(
                {
                    "type": "link",
                    "label": label,
                    "href": href,
                    "icon": icon_svg,
                    "dir": None,
                }
            )
    return contacts


def render_profile_html(person: dict, contacts: List[dict], theme: dict, profile_image_name: str) -> str:
    default_mode = theme.get("defaultMode", "dark")
    body_class = "dark-mode" if default_mode == "dark" else ""
    name = html.escape(person.get("name", ""))
    subtitle1 = html.escape(person.get("subtitle1", ""))
    subtitle2 = html.escape(person.get("subtitle2", ""))
    contacts_html = ""
    for contact in contacts:
        span_dir = f' dir="{contact["dir"]}"' if contact.get("dir") else ""
        target_attrs = ''
        if contact["type"] == "link":
            target_attrs = ' target="_blank" rel="noopener noreferrer"'
        contacts_html += f"""
            <a href="{html.escape(contact['href'], quote=True)}" class="contact-btn" aria-label="{html.escape(contact['label'], quote=True)}"{target_attrs}>
                {contact['icon']}
                <span{span_dir}>{html.escape(contact['label'])}</span>
            </a>
        """

    return f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name}</title>
    <link href="https://v1.fontapi.ir/css/Vazir" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body class="{body_class}">
    <main class="card">
        <button id="theme-toggle" class="theme-toggle" aria-label="تغییر تم">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sun-icon"><path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="moon-icon"><path d="M10 7C10 10.866 13.134 14 17 14C18.9584 14 20.729 13.1957 21.9995 11.8995C22 11.933 22 11.9665 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.0335 2 12.067 2 12.1005 2.00049C10.8043 3.27098 10 5.04157 10 7ZM4 12C4 16.4183 7.58172 20 12 20C15.0583 20 17.7158 18.2839 19.062 15.7621C18.3945 15.9187 17.7035 16 17 16C12.0294 16 8 11.9706 8 7C8 6.29648 8.08133 5.60547 8.2379 4.938C5.71611 6.28423 4 8.9417 4 12Z"></path></svg>
        </button>
        <header class="profile-section">
            <img src="pic/{html.escape(profile_image_name, quote=True)}" alt="عکس پروفایل {name}" class="profile-img">
            <h1>{name}</h1>
            <p class="subtitle">{subtitle1}</p>
            <p class="subtitle">{subtitle2}</p>
        </header>
        <section class="contact-section">
            {contacts_html}
        </section>
    </main>
    <script>
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        themeToggle.addEventListener('click', () => {{
            body.classList.toggle('dark-mode');
        }});
    </script>
</body>
</html>"""


def to_bytes_map(files: Iterable) -> Dict[str, Dict[str, bytes]]:
    blobs: Dict[str, Dict[str, bytes]] = {}
    for file in files:
        name = Path(file.filename).name
        if not name:
            continue
        content = file.read()
        blobs[name.lower()] = {"name": name, "content": content}
    return blobs


def write_profile_image(pic_dir: Path, image_bytes: bytes, filename: str):
    pic_dir.mkdir(parents=True, exist_ok=True)
    dest = pic_dir / filename
    with open(dest, "wb") as f:
        f.write(image_bytes)
    return filename


def generate_export_archive(
    config: dict,
    profile_upload,
    images_files,
    font_file,
) -> Tuple[bytes, List[str]]:
    """
    Build the export zip file. Returns (zip_bytes, warnings).
    """
    theme = normalize_theme(config.get("theme", {}))
    rows = config.get("rows", [])
    icons = config.get("icons", {})
    data = config.get("data", {})
    mode = config.get("mode", "single")

    font_bytes = None
    font_filename = None
    if font_file:
        font_filename = Path(font_file.filename).name
        font_bytes = font_file.read()

    images_map = to_bytes_map(images_files or [])
    placeholder_bytes = PLACEHOLDER_IMAGE.read_bytes() if PLACEHOLDER_IMAGE.exists() else b""

    warnings: List[str] = []
    with tempfile.TemporaryDirectory() as tmpdir:
        root = Path(tmpdir) / "export"
        root.mkdir(parents=True, exist_ok=True)
        used_folders: List[str] = []

        def create_person_folder(person: dict, row_values: Dict[str, dict]):
            folder_name = safe_folder_name(person.get("name", "person"), used_folders)
            used_folders.append(folder_name)
            folder = root / folder_name
            folder.mkdir(parents=True, exist_ok=True)

            font_rel = None
            if font_bytes and font_filename:
                fonts_dir = folder / "fonts"
                fonts_dir.mkdir(exist_ok=True)
                font_dest = fonts_dir / font_filename
                with open(font_dest, "wb") as f:
                    f.write(font_bytes)
                font_rel = f"fonts/{font_filename}"

            contacts = build_contacts(rows, icons, row_values)

            expected_profile = person.get("profileImageFile") or "profile.png"
            profile_file_name = expected_profile
            profile_bytes = placeholder_bytes
            # Single upload overrides everything
            if mode == "single" and profile_upload:
                profile_file_name = Path(profile_upload.filename).name or "profile.png"
                profile_bytes = profile_upload.read()
            elif profile_file_name and profile_file_name.lower() in images_map:
                entry = images_map[profile_file_name.lower()]
                profile_file_name = entry["name"]
                profile_bytes = entry["content"]
            else:
                if mode == "batch":
                    warnings.append(f"{folder_name} -> {expected_profile}")
                profile_file_name = "profile.png"

            pic_dir = folder / "pic"
            write_profile_image(pic_dir, profile_bytes, profile_file_name)

            css = build_style(theme, font_rel)
            (folder / "style.css").write_text(css, encoding="utf-8")
            html_content = render_profile_html(person, contacts, theme, profile_file_name)
            (folder / "index.html").write_text(html_content, encoding="utf-8")

        if mode == "single":
            single = data.get("single") or {}
            row_values = single.get("rowValues") or {}
            create_person_folder(single, row_values)
        else:
            batch = data.get("batch") or []
            for person in batch:
                row_values = person.get("rowValues") or {}
                create_person_folder(person, row_values)

            if warnings:
                (root / "missing.txt").write_text("\n".join(warnings), encoding="utf-8")

        zip_bytes = zip_directory(root)

    return zip_bytes, warnings
