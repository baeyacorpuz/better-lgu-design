# Rebranding for another LGU

The structure stays; the brand hue, logo, place names and copy change. Ask the user for the LGU's colors (seal, flag, tourism branding) before choosing a hue, and don't reuse the reference forest green without asking. Record the hue in `portal.brandHue` in `config/lgu.config.json`. In a Kapwa project, follow "Rebranding a Kapwa project" in [kapwa.md](kapwa.md) instead of step 2.

## 1. Pick a hue

The reference palette is built on one hue around **155–160** (forest green), with warm neutrals at hue 120–140. In OKLCH you can change the hue and keep the lightness (L) and chroma (C), and contrast stays almost the same.

| Brand | Hue (H) | Notes |
| --- | --- | --- |
| Forest green (reference) | 155–160 | |
| Teal / sea | 190–200 | Coastal towns |
| Blue | 240–255 | Lower chroma slightly (`C` × 0.9) for the dark `--brand` |
| Indigo / violet | 270–290 | |
| Maroon / wine | 10–20 | Keep it clearly darker and bluer than `--emergency` (hue 25); never use red as the brand if it competes with emergency red |
| Amber / gold | 70–85 | Use for `--brand-muted` and charts; too light for `--primary` text contrast |

## 2. Swap the tokens

In `src/index.css`, change the hue in these tokens, in `:root` and `.dark`:

- Brand family (full hue): `--primary`, `--ring`, `--brand`, `--brand-muted`, `--accent`, `--accent-foreground`, `--secondary`, `--secondary-foreground`, `--chart-1`, `--chart-2`.
- Neutrals (keep the chroma very low, ≤ 0.02, and either keep the warm hue or move them within ±20° of the new hue): `--background`, `--foreground`, `--card-foreground`, `--muted`, `--muted-foreground`, `--border`, `--input`.
- Don't change: `--destructive`, `--emergency`, `--emergency-foreground`, `--radius`, or anything in `.high-contrast` (it ignores the brand on purpose).

Keep the comment above `:root` naming the palette (`/* Town blue: … */`).

## 3. Check contrast

In both themes, verify at least:

| Pair | Minimum |
| --- | --- |
| `--primary-foreground` on `--primary` | 4.5:1 |
| `--foreground` on `--background` | 4.5:1 |
| `--muted-foreground` on `--muted`, `--accent` and `--card` | 4.5:1 |
| `--brand-foreground` (and its `/70` step) on `--brand` | 4.5:1 |
| `--brand-muted` on `--brand` | 3:1 (large text and icons only) |
| `--emergency-foreground` on `--emergency` | 4.5:1 |
| `--ring` at `/50` against `--background` | 3:1 for the visible focus ring |

Use axe in light and dark mode (see [accessibility.md](accessibility.md)) as the final check.

## 4. Replace identity and copy

- Logo: a simple mark of your own (not the LGU seal), as SVG, 36px in the header. Update the PWA icons and `theme_color` (use the `--brand` value converted to hex for the manifest only, and store it as `portal.themeColor`).
- Place names: top bar location, wordmark, page titles, meta description, `og:` tags.
- Data files: offices, hotlines, officials, barangays, services, sources, `lastChecked`. Start empty and mark placeholders; don't carry over another town's facts.
- Independence notice and volunteer contact.
- Time zone stays `Asia/Manila`.

## 5. Document it

Update the project's own design doc (for example `docs/design/design-system.md`) with the new token values, and note that it follows the better-lgu-design system.
