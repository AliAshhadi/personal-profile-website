# This document is designed for AI chatbots or agents to understand the project structure, design decisions, and implementation details of this personal profile website template.

# Architecture Document — Personal Profile Website Template

**Overview:**  
A reusable single-file, mobile-first personal business profile website template in Persian (Farsi). Plain HTML5 + CSS3 only, RTL layout, accessible, minimal-professional aesthetic, centered card-based design. Designed for easy customization by replacing placeholders with individual data.

**File Structure:**  
- `index.html` : Main HTML file (UTF-8, `dir="rtl"`, embeds the exact inline SVGs).  
- `style.css` : Main stylesheet (organized, commented, mobile-first).  
- `README.md` : Brief documentation and customization notes.

**Component Breakdown:**  
- Header:
  - Purpose: optional small top area (kept light/minimal or omitted to emphasize card). Could contain small logo or invisible skip link for accessibility.
- Main Card (centered):
  - Profile Section:
    - Circular profile image (pic/account-circle-line(1).png) with `alt="عکس پروفایل"`.
    - Full name: `نام و نام خانوادگی` — large, bold.
    - Two-line subtitle/description:
      - Line 1: `خط اول توضیح`
      - Line 2: `خط دوم توضیح`
  - Contact Buttons Section:
    - A horizontal (wraps on small screens) group of five accessible anchor-buttons:
      1. Phone (tel:+989123456789) — shows `09123456789`
      2. Email (mailto:email@example.com) — shows `email@example.com`
      3. LinkedIn (https://www.linkedin.com/) — opens new tab
      4. WhatsApp (https://whatsapp.com) — opens new tab
      5. Telegram (https://t.me/) — opens new tab
    - Each button contains the exact inline SVG provided, an accessible label (`aria-label`) and a small display text.
  - Footer inside card:
    - "Made by aliahhadi/Copilot" as a clickable link to the project repository.
- Footer (page-level):
  - Minimal, center-aligned small text (repeat or keep only card footer).

**Accessibility & Semantic Notes:**  
- Use semantic elements: `<main>`, `<header>`, `<footer>`, `<figure>` for profile image, `<nav>` or `<section>` for contact group if desired.  
- Use anchors `<a>` for actionable items (tel/mailto/external links). Style anchors as buttons.  
- `aria-label` on links for screen readers (explicit Persian labels).  
- `alt` text for image.  
- Ensure >= WCAG contrast for text & buttons.  
- Minimum touch target: 44x44px; use padding to achieve it.  
- Keyboard focus styles (visible outline).  
- Use `rel="noopener noreferrer"` on external `target="_blank"` links.

**Color Scheme & Typography:**  
- Font:
  - Use Vazir CDN: `<link href="https://v1.fontapi.ir/css/Vazir" rel="stylesheet">`.
  - CSS: `font-family: 'Vazir', sans-serif;` (fallback: system sans).
- Palette (suggested; used in CSS):
  - Neutral background: very-light warm gray — `#f6f6f7` or `#fbfbfb`.
  - Card background: white `#ffffff`.
  - Accent 1 (primary): Light blue gradient start — `#4db8e6`.
  - Accent 2: Deep blue accent end — `#0095da`.
  - Muted text: `#444` for body; secondary text `#666`.
  - Subtle shadow: `rgba(16, 24, 40, 0.06)` for depth.
  - Buttons: use accent gradient with hover to darker blue.
- Effects:
  - Subtle glassy gradient on header or page background: diagonal soft gradient using Accent 1->Accent 2 with low opacity.
  - Smooth transitions: `transition: transform .18s ease, box-shadow .18s ease, background-color .18s ease;`
- Spacing:
  - Use a small scale based on 8px rhythm: padding/margins 8/12/16/24/32.

**Responsive Breakpoints Strategy (Mobile-first):**  
- Base (mobile): default styles assume single-column, stacked layout with contact buttons in a vertical column, text centered relative to icon position, icons on the right with margin.  
- Breakpoint 1 — `@media (min-width: 600px)` (sm / tablet):
  - Increase paddings, horizontally center card with more margin, arrange contact buttons in a centered row with wrapping.
- Breakpoint 2 — `@media (min-width: 900px)` (md / small desktop):
  - Card width constrained (max-width ~720–900px), larger avatar, increase typography scale.
- Breakpoint 3 — `@media (min-width: 1200px)` (lg / large desktop):
  - Optional minor layout tweaks (more whitespace, subtle two-column possibilities if content grows).
- Mobile-first notes:
  - Start with stacked vertical flow; progressively adjust to horizontal button row and larger typography at breakpoints.

**RTL Considerations (Persian):**  
- Mark document: `<html lang="fa" dir="rtl">` and set `body { direction: rtl; }` to ensure correct cursor and punctuation flow.  
- Use logical CSS properties (margin-inline-start/end, padding-inline) when appropriate, or rely on symmetric center alignment to avoid horizontal flips.  
- Icons: keep icon preceding text visually — in RTL the icon should appear to the right of the label if following natural flow; but for centered button layout with icon above/beside label, ensure visual alignment is consistent. We'll place icon above or to the side but centered to avoid mirrored confusion.  
- Use `text-align: center` for most card content to avoid mirrored layouts; for left-to-right elements such as phone numbers, preserve LTR numerals by wrapping them in `<span dir="ltr">09123456789</span>` so the number reads correctly.  
- Input or copyable LTR text (like emails and URLs) should be inside `dir="ltr"` or `unicode-bidi: embed` to preserve correct ordering and avoid punctuation issues.

**Performance & Optimizations:**  
- Keep CSS scoped and minimal — only the classes used.  
- Inline SVGs avoid extra HTTP requests for small icons. Since we embed provided SVGs, they render fast and inherit `currentColor`.  
- Use a single small CSS file; avoid heavy gradients or images. Profile image uses `object-fit: cover` for efficient circular display.  
- Defer any heavy images; compress profile photo if added later.

**ARIA & Semantic Markup (examples):**  
- `<figure><img alt="عکس پروفایل"></figure>`  
- Contact links: `<a href="tel:..." class="contact-btn" aria-label="تماس">...</a>`  
- Footer link: `<a href="https://github.com" target="_blank" rel="noopener noreferrer">aliahhadi/Copilot</a>`

**Polish & Microinteractions:**  
- Hover and active states: subtle `transform: translateY(-4px)` and shadow increase on hover; `:active` compress slightly.  
- Focus state: 3px outline in accent color for keyboard users.  
- Button icon uses `currentColor` so color changes propagate naturally.  
- Small subtle background pattern (CSS radial-gradient or SVG pattern with low opacity) to add depth without affecting performance.