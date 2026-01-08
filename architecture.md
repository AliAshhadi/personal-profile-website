# Architecture Document - Personal Profile Link Page Generator

## Purpose
A Persian-first web app that generates a single-page, RTL personal/business link page with the same look as the current template. It supports single-person generation and batch production from CSV/Excel, while keeping the layout consistent and only allowing controlled customization (colors, font, rows, icons).

## Goals
- Preserve the current visual design and layout; customization must not break the overall look.
- Provide an easy UI for non-technical users to configure theme, icons, and rows.
- Support single-person output and batch generation via a mode toggle.
- Export per-person folders containing `index.html` and `style.css`.
- Provide a built-in icon library (SVG-only) with search and the ability to add custom icons.

## Non-goals (v1)
- No redesign of the UI template.
- No multi-page output or server-side hosting.
- No multi-language UI (Persian-first only).

## Core UX (Current)
The app runs as a single-page UI (served by Flask) with 3 tabs and a backend for import/export and icon persistence:

1) Design Tab
- Row builder first: add/remove/reorder rows, choose row type (`phone`/`email`/`link`), set button label, pick icon via a visual icon picker (searchable).
- Icons are SVG code only (inline SVG), no PNG uploads.
- Built-in icon library with search and preview; users can paste custom SVG and add it to the library (can delete custom icons, not built-in ones). Custom icons persist to disk (`app/data/custom_icons.json`) and are fetched via API.
- Advanced section at the end for theme/colors/font and default mode. If `Custom` font is selected, user can upload a font file to bundle with export.

2) Data Tab
- Mode toggle: Single vs Batch.
- Batch mode: `.xlsx` upload, images folder picker, “Download sample” button at top (generated from current row selection).
- Single mode: base info (name, subtitles, profile image) + per-row value inputs derived from row builder.

3) Export Tab
- Validate inputs and generate output folders; download comes as a ZIP.
- Batch export creates a folder per person with `index.html`, `style.css`, and `pic/`.
- Warnings surface for missing images (also written to `missing.txt` in batch root).

## Data Model (Minimal Schema)
The UI edits a single configuration object used for both single and batch generation.

```
{
  "meta": { "language": "fa", "dir": "rtl", "template": "personal-profile-v1" },
  "theme": {
    "defaultMode": "dark",
    "font": "Vazir" | "Custom",
    "fontFile": null,
    "accent": { "style": "gradient", "color": "#2e7bc8", "solidColor": "#2e7bc8" },
    "text": {
      "light": { "title": "#444444", "subtitle": "#666666" },
      "dark": { "title": "#ffffff", "subtitle": "#cccccc" }
    },
    "background": {
      "light": { "page": "#f6f6f7", "card": "#ffffff" },
      "dark": { "page": "#1a1a1a", "card": "#333333" }
    }
  },
  "rows": [
    { "id": "r1", "label": "تلفن", "type": "phone", "icon": "phone" },
    { "id": "r2", "label": "ایمیل", "type": "email", "icon": "email" },
    { "id": "r3", "label": "لینکدین", "type": "link", "icon": "linkedin" }
  ],
  "icons": { "phone": "<svg...>", "email": "<svg...>", "website": "<svg...>", ... },
  "data": {
    "single": {
      "name": "...",
      "subtitle1": "...",
      "subtitle2": "...",
      "profileImageFile": "profile.png",
      "rowValues": { "<slug>": "<value>" }
    },
    "batch": [
      {
        "name": "...",
        "subtitle1": "...",
        "subtitle2": "...",
        "profileImageFile": "profile.png",
        "rowValues": { "<slug>": { "value": "...", "href?": "...", "label?": "...", "normalized?": "..." } }
      }
    ]
  }
}
```

Notes:
- Rows are dynamic; each row has `label` (button text), `type` (phone/email/link), and `icon` (key into icon library). Duplicates are allowed (e.g., multiple phones).
- Missing row values in batch or single mode are skipped (not rendered for that person).
- Inline SVG is stored per contact type and injected into the output HTML.
- Profile images are exported into a `pic/` folder and referenced in HTML as `pic/<profileImageFile>`.
- Theme fields above are high-level controls; exporter derives the final CSS variables used by the template.
- If a custom font is provided, bundle the font file with export and inject the @font-face into CSS.
- Icon store lives server-side: built-ins are static; custom icons are persisted in `app/data/custom_icons.json` and loaded via API.

## Theme & Color Controls (UI -> CSS Variables)
The generator should keep the current look by using the same CSS variable approach as the template, but expose safe, high-level controls in the UI.

### Accent (Buttons/Links/Focus)
Controls:
- Accent style: `gradient` or `solid`.
- When `gradient`: single color input (`accent.color`) used to derive start/end/hover/link tokens.
- When `solid`: single color input (`accent.solidColor`) used for buttons/links.
- A reset button restores the default color set from the base template.

Derived CSS variables (examples; naming matches the current template):
- `--accent-start`, `--accent-end`
- `--accent-hover-start`, `--accent-hover-end`
- `--link-color`
- Focus outline color

### Text Colors (Per Mode)
Controls:
- Light mode: `theme.text.light.title` and `theme.text.light.subtitle`
- Dark mode: `theme.text.dark.title` and `theme.text.dark.subtitle`

Derived CSS variables:
- `--title-color` and `--subtitle-color` per mode (or reuse `--text-color`/`--subtitle-color` but treat them as title/subtitle tokens in generation).

### Background
Controls:
- Light mode: `theme.background.light.page` (page background) and `theme.background.light.card` (card color).
- Dark mode: fixed defaults (`page`/`card`) with no brightness slider (keep base template look).

Notes:
- Keep card contrast stable; warn on low-contrast combinations (especially button foreground and title/subtitle).

## Icon Library
- The program ships with a built-in icon library file (SVG-only) that the UI can search and insert from.
- Row selection must not delete icons; it only changes which rows are rendered.
- Users can add their own SVG icons to a custom library (persisted server-side) for reuse later.
- Users can delete custom icons, but not built-in ones.
- Built-in icons (v1): `phone`, `email`, `linkedin`, `whatsapp`, `telegram` (from the current template) plus `website` (globe icon).
- Export always inlines the selected SVG into the generated HTML, same as the current template.
- Icon picker should highlight the currently selected icon.

## Batch Import Rules (Implemented)
- Batch import accepts `.xlsx` with columns mapped by header name.
- Missing data in a row can be indicated by empty cell, `none`, or `-` (case-insensitive). That row is skipped for that person.
- If a contact row is skipped, it is omitted from the generated HTML for that person.
- Profile images are matched by filename from a selected images folder; if missing or not found, a default placeholder (`pic/profile.png`) is used and a warning is shown.
- Workbook handling: read the first sheet by default and map columns by header name (not position).

### CSV/Excel Template (Dynamic)
The app generates an example Excel file based on which rows are selected in the Design tab. The "Download sample" button appears only in Batch mode (Data tab).

Always included columns:
- `name`, `subtitle1`, `subtitle2`, `profileImageFile`

Generated per row (using the row's slugified label):
- For `phone`: `<slug>Label`
- For `email`: `<slug>Label`
- For `link`: `<slug>Href` (button label always comes from the Design tab row label)

## Phone/Email Handling
- Phone label is user-facing (e.g., `09123456789`).
- Phone href is auto-generated as `tel:<normalized>`.
- Normalization rule: if the number starts with `+`, keep it; if it starts with `0`, keep it; otherwise prefix a `0`.
- Email href is auto-generated as `mailto:<email>`.

## Profile Image Handling
- Single mode: upload an image; exporter copies it into `pic/` in the output folder.
- Batch mode: CSV provides `profileImageFile`; user selects an images folder for matching.
- If the filename is blank or not found, use the default placeholder image (`pic/profile.png`).
- When any images are missing, warn in the UI before export; on proceed, write a single `missing.txt` at the batch root listing `personFolderName -> expectedFilename` for each missing image.

## Export Output (Implemented)
- Single: one folder with `index.html` and `style.css`.
- Batch: one folder per person, same file structure.
- Each output folder includes a `pic/` subfolder for profile images.
- Folder naming: full name with spaces replaced by underscores (e.g., `علی_اشهدی`).
- If a folder name collides, append `_2`, `_3`, ... to make it unique.
- Optional ZIP download of batch output.
- Write a single `missing.txt` at batch root listing `personFolderName -> expectedFilename` for missing images.
- Bundle custom font file if provided; inject @font-face.
- Exporter injects inline SVG icons and text content into the fixed template.

## Backend Services (Flask)
- `/api/icons` GET/POST/DELETE: list built-in + custom icons, add custom SVG, delete custom icon; custom icons persisted in `app/data/custom_icons.json`.
- `/api/template` POST: generate dynamic `.xlsx` sample based on current rows.
- `/api/import` POST: parse uploaded `.xlsx` using provided rows; returns people + warnings.
- `/api/export` POST: build export ZIP (single or batch) with `index.html`, `style.css`, `pic/`, optional fonts, and `missing.txt` when images are absent.

## Constraints
- Layout and visual style must remain consistent with the current template.
- Only allow controlled changes: colors, fonts, row selection, icon SVGs.
- Theme colors are global only (no per-person overrides).

## Template Fidelity Requirements
- Preserve `lang="fa"` and `dir="rtl"` on the root HTML element.
- Keep `body` default class set by the chosen default mode (dark or light) and the theme toggle behavior.
- Phone and email labels should be wrapped with `dir="ltr"` for correct number/email ordering.
- External links open in a new tab with `rel="noopener noreferrer"`.
- Icons remain inline SVG with `currentColor` for color inheritance.
- Keep the profile image `alt` text and the `pic/` image path convention.
