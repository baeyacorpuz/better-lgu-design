# Working with Kapwa

[Kapwa](https://www.npmjs.com/package/@bettergov/kapwa) (`@bettergov/kapwa`, CC0) is BetterGov.ph's design system. BetterLB uses it. This file maps this system's tokens to Kapwa's so the rules apply in a Kapwa project, and says how to rebrand one. Checked against Kapwa **1.2.4**; recheck `dist/kapwa.css` after upgrading.

## How Kapwa is set up

- `@import "@bettergov/kapwa/styles"` plus `@source '../node_modules/@bettergov/kapwa/dist'` in `src/index.css`.
- **Primitive scales** in `@theme`: `--color-kapwa-{brand,gray,neutral,blue,green,red,orange,yellow,purple}-{50…950}` (hex). These become global CSS variables.
- **Semantic aliases** in `@theme inline`, pointing at primitives: `--color-kapwa-text-strong: var(--color-kapwa-gray-950)`. Because they're `inline`, the utility compiles to the primitive variable, so **override primitives, not aliases**.
- Typography utilities: `kapwa-heading-xl`, `kapwa-heading-lg`, `kapwa-heading-md`, `kapwa-body-*`. Font: `--font-kapwa-sans` (Inter by default).
- Components: `@bettergov/kapwa/button`, `/input`, `/label`, `/card`, `/table`, `/list`, `/banner`, `/strip-banner`, `/civic-tech-banner`, `/official-biography`, `/article`.
- **No dark mode for Kapwa tokens.** Kapwa's `.dark` block only covers the legacy shadcn HSL variables. See "Dark and high contrast" below.

## Token crosswalk

Use the right-hand column wherever this skill names a left-hand token.

| This system (shadcn) | Kapwa | Notes |
| --- | --- | --- |
| `bg-background` | `bg-kapwa-bg-surface` | Page canvas |
| `bg-card`, `bg-popover` | `bg-kapwa-bg-surface-raised` | Kapwa's raised surface is a light gray, not white; keep the card border |
| `bg-muted` (quiet band) | `bg-kapwa-bg-surface-adaptive` or `bg-kapwa-bg-gray-default` | |
| `text-foreground` | `text-kapwa-text-strong` | |
| `text-muted-foreground` | `text-kapwa-text-support` | |
| `bg-primary` | `bg-kapwa-bg-brand-default` | Hover: `bg-kapwa-bg-brand-hover`; pressed: `bg-kapwa-bg-brand-active` |
| `text-primary-foreground` | `text-kapwa-text-inverse` | |
| `text-primary` (links, selected) | `text-kapwa-text-brand`, links `text-kapwa-text-link` | Kapwa links are blue by default whatever the brand; rebrand them (below) or accept it |
| `bg-secondary`, `bg-accent` | `bg-kapwa-bg-brand-weak` or `bg-kapwa-bg-surface-brand` | Chips, icon tiles, selected rows |
| `text-accent-foreground` | `text-kapwa-text-brand-bold` | |
| hover surface (`hover:bg-accent`) | `hover:bg-kapwa-bg-hover` | |
| `bg-brand` (hero, top bar, brand band) | `bg-kapwa-bg-surface-bold` or `bg-kapwa-bg-brand-default` | `surface-bold` is near-black; use brand-default for a colored band |
| `text-brand-foreground` (`/80`, `/70`) | `text-kapwa-text-inverse`, `text-kapwa-text-inverse-subtle` | |
| `text-brand-muted` | `text-kapwa-brand-300` | Primitive; acceptable only on brand surfaces |
| `border-border` | `border-kapwa-border-weak` | |
| `border-input` | `border-kapwa-border-strong` | |
| `ring-ring/50` (focus) | `ring-kapwa-border-focus` (+ `bg-kapwa-bg-focus` for skip links) | Kapwa's focus is blue ring, yellow fill |
| `bg-destructive`, `text-destructive` | `bg-kapwa-bg-danger-default`, `text-kapwa-text-danger` | |
| `bg-emergency` | `bg-kapwa-bg-danger-default` | Keep emergency use only; no separate token in Kapwa |
| success, warning, info | `*-kapwa-*-success`, `*-warning`, `*-info` (text, bg `-default`/`-weak`, border) | This system has no status tokens; Kapwa does, so use them |
| `--chart-1…5` | `kapwa-bg-accent-{blue,green,orange,purple,red,yellow}-default` | Charts only |

Rules that carry over unchanged: radius by role, elevation, Phosphor icons (or the project's existing Lucide, not both), sources and dates, independence notice, every accessibility rule.

Prefer semantic aliases to primitives. A primitive (`text-kapwa-blue-600`) in a component is the Kapwa equivalent of a raw color: allowed only where no semantic alias fits (charts, brand-surface highlights), with a `tokens-allow` comment.

## Rebranding a Kapwa project

Kapwa's brand scale is BetterGov blue (`--color-kapwa-brand-600: #005df5`). Override the primitive scale after the import, keeping the same lightness steps:

```css
@import "@bettergov/kapwa/styles";

/* <Town> green, hue 158; steps follow Kapwa's lightness ramp */
:root {
  --color-kapwa-brand-50: oklch(0.97 0.02 158);
  --color-kapwa-brand-100: oklch(0.94 0.04 158);
  --color-kapwa-brand-300: oklch(0.82 0.08 158);
  --color-kapwa-brand-600: oklch(0.45 0.09 158);
  --color-kapwa-brand-700: oklch(0.39 0.085 158);
  --color-kapwa-brand-800: oklch(0.33 0.075 158);
  --color-kapwa-brand-950: oklch(0.2 0.04 158);
  /* links follow the brand */
  --color-kapwa-blue-500: var(--color-kapwa-brand-600);
}
```

Override every brand step the project uses (search for `kapwa-brand-` and the aliases that point at it). Check `text-kapwa-text-inverse` on `bg-kapwa-bg-brand-default` (4.5:1) and the other pairs in [rebranding.md](rebranding.md). Changing `--color-kapwa-blue-*` also changes `info` colors; check them.

## Dark and high contrast

Kapwa 1.2.4 has no dark values for its semantic tokens. To offer dark mode (principle 4), redefine the primitive scales under `.dark`: invert `gray` and `neutral` (50 ↔ 950, 100 ↔ 900, …), and move `brand` to lighter steps for text and darker for fills. Then run axe in both themes. If that's more than the project wants to maintain, say so to the user rather than shipping a half-dark page. The high-contrast set in [accessibility.md](accessibility.md) works the same way.

## Token check

```sh
node <skill-dir>/scripts/check-tokens.mjs src --kapwa
```

In Kapwa mode the script flags raw hex, color functions and Tailwind palette classes (`bg-blue-500`, `text-slate-700`), and warns on Kapwa primitives (`text-kapwa-blue-600`) without a `tokens-allow` comment. It skips the `:root`/`.dark` block checks, which describe shadcn-style tokens. [`assets/e2e/tokens.spec.ts`](../assets/e2e/tokens.spec.ts) checks the rendered page the same way (BetterLB runs a similar `assertKapwaTokens`).
