# Foundations

Tokens, type, spacing, shape, elevation, motion and icons. The values shown are the reference palette (forest green, from Better Naguilian). In a Kapwa project, translate token names with [kapwa.md](kapwa.md). [`assets/index.css`](../assets/index.css) is the source of truth: when this file and the CSS disagree, the CSS wins.

## Color

Every color is a semantic CSS variable in OKLCH, exposed to Tailwind through `@theme inline`. Components use only the semantic utilities (`bg-primary`, `text-muted-foreground`, `border-border`, …).

### Roles (light)

| Token | Reference value | Role |
| --- | --- | --- |
| `--background` | `oklch(0.987 0.004 120)` | Warm off-white page canvas |
| `--foreground` | `oklch(0.2 0.02 160)` | Primary text, icon strokes |
| `--card` / `--popover` | `oklch(1 0 0)` | Card, input and overlay surfaces |
| `--primary` | `oklch(0.36 0.075 158)` | Brand color: main action, selected state, links |
| `--primary-foreground` | `oklch(0.985 0.005 140)` | Text on primary |
| `--secondary` | `oklch(0.955 0.012 150)` | Tinted neutral: chips, eyebrows, secondary buttons |
| `--muted` | `oklch(0.962 0.007 130)` | Quiet section bands (`Section tone="muted"`) |
| `--muted-foreground` | `oklch(0.5 0.02 160)` | Metadata, descriptions, captions |
| `--accent` | `oklch(0.945 0.02 152)` | Hover and selected surfaces, icon tiles |
| `--destructive` | `oklch(0.55 0.2 25)` | Errors and destructive actions only |
| `--border` / `--input` | `oklch(0.91 0.01 140)` / `oklch(0.89 0.012 140)` | Dividers and card outlines / control borders |
| `--ring` | `oklch(0.55 0.09 158)` | Focus ring (used at `/50`) |
| `--emergency` / `--emergency-foreground` | `oklch(0.5 0.19 25)` / `oklch(0.99 0.005 25)` | Emergency strip and tap-to-call buttons |
| `--brand` | `oklch(0.29 0.06 160)` | Deep brand band: hero, top bar, `Section tone="brand"` |
| `--brand-foreground` | `oklch(0.97 0.01 140)` | Text on brand |
| `--brand-muted` | `oklch(0.78 0.06 155)` | Highlight text and icons on brand (place name, map pin) |
| `--chart-1` … `--chart-5` | brand → lighter brand → olive → amber | Data visualization only |

### Dark

Every token except `--radius` and the chart colors is redefined in `.dark`. Primary flips to a light tint of the brand hue with dark text. Borders and inputs become white at 10% and 15%. `--emergency` stays a deep red (`oklch(0.47 0.17 25)`) so white text keeps 4.5:1 contrast.

Theme switching: toggle `.dark` on `<html>`, store the choice in `localStorage`, and fall back to `prefers-color-scheme`. Apply the stored theme with a tiny inline script in `index.html` before first paint to avoid a flash.

### High contrast

`.high-contrast` on `<html>` overrides both themes: black surfaces, white text, yellow (`oklch(0.93 0.19 103)`) primary and ring, solid white borders, underlined links. Emergency red stays. The `contrast:` variant is for the rare thing tokens can't express. See [accessibility.md](accessibility.md).

### Status colors

The reference palette has no success, warning or info tokens: state is shown with an icon and label on neutral or accent surfaces, and red is kept for errors and emergencies. If a project needs status colors (BetterLB's dashboards use Kapwa's), add `--success`, `--warning`, `--info` and their `-foreground` pairs as full tokens (`:root`, `.dark`, `.high-contrast`, `@theme inline`), never as palette classes.

### Usage rules

- **Inverse surfaces** (`bg-brand`, `bg-primary` cards): use `text-brand-foreground` / `text-primary-foreground` and their opacity steps (`/80` body, `/70` captions). Translucent white (`bg-white/10`, `border-white/15`, `border-white/30`) is the approved way to layer chips and outline buttons on brand.
- **Emergency:** the top strip is `bg-emergency text-emergency-foreground`, and call buttons use the `emergency` Button variant. Emergency and destructive red are for emergencies and errors only.
- **Opacity steps:** `/90` hover on solid fills, `/60` muted band, `/50` ring and subtle accent, `/15` decorative line art on brand. Keep to these.
- Never encode meaning in color alone. Pair it with an icon, label, weight or underline.

## Typography

One family: **Manrope Variable** (`@fontsource-variable/manrope`, self-hosted so it works offline) for both `--font-sans` and `--font-heading`. The root sets `antialiased`, `font-synthesis: none` and `text-rendering: optimizeLegibility`.

| Role | Classes | Where |
| --- | --- | --- |
| Display (H1) | `text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance` | Homepage hero |
| Page title (H1) | `text-3xl sm:text-5xl font-extrabold tracking-tight text-balance` | `PageHero` |
| Section title (H2) | `text-3xl sm:text-4xl font-bold tracking-tight text-balance` | `SectionHeading` |
| Card title, large | `text-xl font-semibold` | Feature and inverse cards, service page cards |
| Card title | `text-base`–`text-lg font-semibold` | Content cards |
| Lead | `text-base sm:text-lg leading-relaxed` | Hero and intro paragraphs |
| Body | `text-sm leading-relaxed text-pretty` | Descriptions, card copy |
| Reading text | `text-base leading-relaxed` | Service steps, requirements, anything a resident follows at a counter |
| UI label | `text-sm font-semibold` | Buttons, nav items |
| Meta / caption | `text-xs font-medium text-muted-foreground` | Sources, counts, timestamps |
| Eyebrow | `text-[11px] font-semibold uppercase tracking-wider` in a pill `Badge` | Section kickers |

- Weights: 500 for labels and metadata, 600 for actions and titles, 700 for section titles, 800 for display only.
- `tracking-tight` only on 3xl and larger; `tracking-wider` only on uppercase eyebrows.
- `text-balance` on headings, `text-pretty` on paragraphs.
- 11px eyebrows are the smallest text allowed. Don't set reading text in `text-xs`.
- Long unbroken strings (office names, addresses, URLs) get `[overflow-wrap:anywhere]` and `min-w-0` on their flex parent.
- Phone numbers, times and counts use `tabular-nums`.

## Spacing and layout

Tailwind's 4px scale.

| Concern | Value |
| --- | --- |
| Content container | `Container`: `max-w-7xl` (1280px), centered |
| Gutters | `px-4` → `sm:px-6` → `lg:px-8` |
| Section rhythm | `Section`: `py-16 sm:py-20`; hero `py-16 sm:py-24`; compact data sections `py-10 sm:py-12` |
| Section heading → content | `mb-10` (`mb-6` for compact sections) |
| Card grid | `gap-4`; 1 → `sm:grid-cols-2` → `lg:grid-cols-3` |
| Inline groups | `gap-1`–`gap-2` (icon + label, chips); `gap-3` (button rows) |
| Large two-column layouts | `gap-10 lg:gap-16` |
| Sticky header | `h-16`; anchors offset with `scroll-padding-top: 5rem` on `html` |
| Top bar rows | `min-h-8`, `text-xs` |

Layouts wrap and stack; nothing may overflow horizontally at 320px.

## Shape

`--radius: 0.625rem` (10px) drives the scale.

| Utility | Size | Role |
| --- | --- | --- |
| `rounded-sm` | 6px | Small inner elements, menu items, focus rings on inline links |
| `rounded-md` | 8px | **Controls**: buttons, inputs, toggles, inner action tiles |
| `rounded-lg` | 10px | Icon tiles, logo, search field |
| `rounded-xl` | 14px | **Cards** and a card's stretched-link focus ring |
| `rounded-full` | pill | Chips, eyebrows, avatars, status dots, step numbers |

## Elevation and motion

| Level | Classes | Use |
| --- | --- | --- |
| Resting | `shadow-xs` | Cards, buttons, inputs |
| Hover lift | `hover:-translate-y-0.5 hover:shadow-md hover:border-ring/50` | Interactive cards only |
| Overlay | `shadow-lg` | Menus, sheets, dialogs, command palette |
| Showcase | `shadow-2xl shadow-black/30` | One hero card on the brand band |

The sticky header uses translucency instead of a shadow: `bg-background/85 backdrop-blur border-b`.

Motion is short and functional: `transition-colors` / `transition-all` at the default duration, accordion keyframes (0.2s ease-out), `tw-animate-css` enter and exit on overlays, and a small arrow nudge (`translate-x-0.5 -translate-y-0.5`) on hover. Use `scroll-smooth`. Anything more must respect `prefers-reduced-motion` (`motion-reduce:` variants).

## Iconography

- **Phosphor** (`@phosphor-icons/react`), always imported with the `Icon` suffix (`ArrowRightIcon`, not `ArrowRight`).
- Sizes: `size-3` / `size-3.5` next to `text-xs`, `size-4` by default (buttons size their icons automatically), `size-5` inside icon tiles.
- `weight="fill"` for status and emphasis glyphs (siren, map pin, phone call, shield). Everything else stays regular.
- `ArrowRightIcon` = in-app navigation. `ArrowUpRightIcon` = opens a source or another site.
- **Icon tile:** `flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground` (`size-11` in data cards). On card hover it flips to `bg-primary text-primary-foreground`; on brand surfaces it uses `bg-white/10`.
- Decorative SVG gets `aria-hidden`. Keep ornamental line art (contour rings, map lines) to brand bands at `/15` opacity.
