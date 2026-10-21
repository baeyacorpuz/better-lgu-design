---
name: better-lgu-design
description: Shared design system and content patterns for community-built local government portals in the Philippines (municipal, city, provincial or barangay sites in the Better<LGU> / BetterGov.ph family, such as Better Naguilian, BetterSolano, BetterLB and betterlocalgov). Use when starting, forking or restyling such a site, or building any page of one, including services or Citizen's Charter pages, emergency hotlines, officials, barangays, transparency or legislative pages, the homepage, header, footer or top bar. Also use when someone asks to "use the Better LGU design", fork a portal for another LGU, set up an LGU config or LGU-type labels, add languages or a high-contrast mode, map tokens to or from Kapwa (@bettergov/kapwa), rebrand the palette, or check a page against these rules. Covers OKLCH semantic tokens with dark and high-contrast modes, shadcn/ui (Radix) variants, the Kapwa crosswalk, Phosphor icons, layout helpers, source-and-date rules for facts, and WCAG 2.1 AA checks. Default stack is React + Tailwind CSS v4 + shadcn/ui; the rules carry to Kapwa projects and static HTML sites.
---

# Better LGU design

A shared design system for volunteer-built LGU portals. It starts from [Better Naguilian](https://github.com/baeyacorpuz/betternaguilianlu) and adds patterns from [BetterSolano](https://github.com/BetterSolano/bettersolano), [BetterLB](https://github.com/BetterLosBanos/betterlb) and [betterlocalgov](https://github.com/iyanski/betterlocalgov). Use it to build a portal that feels like a calm, trustworthy public service rather than a brochure, and that works on a cheap phone on mobile data.

## Principles

1. **People and tasks first.** Organize around what residents do (Apply, Report, Pay, Book, Find), not the org chart. Every screen helps someone finish a task: find a service, reach an office, call a hotline, check a source. Decoration never pushes those actions down the page.
2. **Verified and sourced.** Every fact links to where it came from, and every page or data set shows who keeps it and when it was last checked. If something isn't verified, say so on the page. Never invent a phone number, fee, name or URL. Leave a clearly marked placeholder and tell the user.
3. **One restrained brand color.** The LGU's hue is for meaningful actions, selected states, focus and at most one brand band per page. Neutral surfaces carry the rest.
4. **Accessible by default.** Visible focus, a skip link, real labels, no meaning carried by color alone, 320px width, 200% zoom, light, dark and high-contrast modes. Long English, Filipino and regional-language labels must wrap, not overflow.
5. **Forkable.** LGU-specific facts live in one config file and the data files, never in components. Another LGU should be able to fork the portal by editing data, not code.
6. **Reuse before you invent.** Extend a CVA variant or a layout helper. Don't copy long class strings or add one-off colors.
7. **Honest about what it is.** A community-built site says it is independent and not an official government website, and links to the official channels.

## Non-negotiable rules

- Components use **semantic utilities only**: `bg-primary`, `text-muted-foreground`, `bg-brand`, `border-border` in a shadcn project, or `bg-kapwa-bg-surface`, `text-kapwa-text-strong`, `border-kapwa-border-weak` in a Kapwa project. No raw hex, `oklch()` or Tailwind palette classes (`bg-blue-500`, `text-gray-700`) in components. The one exception is translucent white on brand surfaces (`bg-white/10`, `border-white/15`, `border-white/30`).
- A new token gets a value in `:root`, `.dark` (and `.high-contrast` if it carries text or borders), a mapping in `@theme inline`, and a line in the project's design doc, all in the same change.
- **Radius follows role:** `rounded-xl` for cards, `rounded-md` for controls (buttons, inputs, toggles), `rounded-lg` for icon tiles, `rounded-full` only for chips, eyebrows, avatars and status dots.
- **Elevation has meaning:** cards rest at `border` + `shadow-xs`. Only interactive cards lift on hover. Overlays use `shadow-lg`.
- Use the Button variants **`inverse`** and **`inverse-outline`** on brand surfaces, and **`emergency`** only for tap-to-call hotlines. Emergency and destructive red never appear as decoration.
- Change how a primitive looks with a CVA variant or tokens, never with overrides at each call site.
- Icons come from **Phosphor**, always imported with the `Icon` suffix. Use `ArrowRightIcon` for in-app navigation and `ArrowUpRightIcon` for anything that opens a source or another site. Decorative icons get `aria-hidden`. (Kapwa projects that already use Lucide keep it; don't mix the two.)
- Factual content gets a **`SourceLink`**, or a **`SourcesNote`** with the date it was checked.
- LGU name, type, province, URLs and brand live in `config/lgu.config.json`. Labels that depend on the LGU type (Mayor or Governor, Sangguniang Bayan, Panlungsod or Panlalawigan) come from `lguLabels`, never a hardcoded string. Other copy lives in data or locale files. Placeholder links are `#` until the official URL is confirmed.
- Keep the skip link to `#main` as the first focusable element.

## Pick the path

Look at the project first.

- **New portal, or a shadcn/ui project** (`components.json` present): follow "Starting a new portal" below. This is the default.
- **Kapwa project** (`@bettergov/kapwa` in `package.json`, `kapwa-*` classes): keep Kapwa. Use [references/kapwa.md](references/kapwa.md) to translate every rule here into Kapwa tokens, and run the token check with `--kapwa`. Don't migrate a Kapwa project to shadcn, or the reverse, unless the user asks.
- **Static HTML site** (BetterSolano style): the principles, civic patterns, accessibility and language rules apply as written. Express tokens as CSS custom properties with a dark and a high-contrast set, and skip the React assets.
- **Forking an existing portal for another LGU:** start with [references/forking.md](references/forking.md).

## Starting a new portal

1. Scaffold Vite + React + TypeScript with Tailwind CSS v4 and shadcn/ui (`style: "radix-mira"`, `iconLibrary: "phosphor"`). Use [`assets/components.json`](assets/components.json) as the starting config.
2. Install `@phosphor-icons/react`, `@fontsource-variable/manrope`, `tw-animate-css`, `class-variance-authority` and `radix-ui`.
3. Copy [`assets/config/lgu.config.example.json`](assets/config/lgu.config.example.json) to `config/lgu.config.json` and [`assets/lib/lgu.ts`](assets/lib/lgu.ts) to `src/lib/lgu.ts`. Fill the config with the user, following [references/forking.md](references/forking.md).
4. Copy [`assets/index.css`](assets/index.css) to `src/index.css`. Rebrand it for the LGU by following [references/rebranding.md](references/rebranding.md). Never ship the reference forest green for another LGU without asking the user.
5. Add the shadcn primitives you need with the shadcn CLI, then replace `button.tsx`, `badge.tsx` and `card.tsx` with the versions in [`assets/components/ui/`](assets/components/ui/). They add the `emergency`, `inverse` and `inverse-outline` variants and the card styling.
6. Copy [`assets/components/site/section.tsx`](assets/components/site/section.tsx) (`Container`, `Section`, `SectionHeading`, `SourceLink`, `PageHero`, `SourcesNote`), [`assets/hooks/use-contrast.ts`](assets/hooks/use-contrast.ts) and, if the site lists hotlines, [`assets/components/civic/hotline-card.tsx`](assets/components/civic/hotline-card.tsx).
7. Start the data layer from [`assets/data/civic.example.ts`](assets/data/civic.example.ts): typed sources, a `lastChecked` date, hotlines, offices and Citizen's Charter services.
8. Build the shell (top bar, header, skip link, `<main id="main">`, footer with the independence notice) and pages as described in [references/components.md](references/components.md) and [references/civic-patterns.md](references/civic-patterns.md). Plan languages from the start with [references/languages.md](references/languages.md), even if only English ships first.
9. Set up the checks in [references/accessibility.md](references/accessibility.md), copy [`assets/e2e/tokens.spec.ts`](assets/e2e/tokens.spec.ts) into the Playwright suite, and run [`scripts/check-tokens.mjs`](scripts/check-tokens.mjs).

The asset files import from `@/lib/utils`, `@/components/...`, `@/data/...` and `@/hooks/...`, and `lgu.ts` imports `../../config/lgu.config.json`. Adjust the paths if the project's aliases differ, and make sure `cn` is exported from `@/lib/utils` (shadcn creates it).

## Building a page or section

- Homepage blocks follow `<Section id tone>` → `<Container>` → `<SectionHeading eyebrow title description>` → content. Alternate `tone="default"` and `tone="muted"`. Use `tone="brand"` (with `SectionHeading invert`) at most once between the hero and the footer.
- Put the top tasks near the top of the homepage as verbs (see "Task-first entry points" in [references/civic-patterns.md](references/civic-patterns.md)).
- Inner pages start with `PageHero` (eyebrow, `h1`, lead paragraph) and end with a `SourcesNote` (source, owner, last checked) when they present facts.
- Every service page answers the same questions in the same order (see "The service page contract").
- Card grids: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`.
- Check every new screen at 320px, in dark and high-contrast modes, with only the keyboard, and with a long Filipino label.

## Reference files

Read the one you need; they aren't all needed for every task.

| File | Read it when |
| --- | --- |
| [references/foundations.md](references/foundations.md) | Choosing colors, type, spacing, radius, elevation, motion or icons |
| [references/components.md](references/components.md) | Using Button, Card, Badge, layout helpers, the header, top bar, search, or live data cards |
| [references/civic-patterns.md](references/civic-patterns.md) | Building task entry points, services or Citizen's Charter pages, hotlines, officials, barangays, transparency, legislative, about/independence, feedback or offline support |
| [references/forking.md](references/forking.md) | Starting a portal for a new LGU, setting up `lgu.config.json`, or using LGU-type labels |
| [references/kapwa.md](references/kapwa.md) | Working in a project that uses `@bettergov/kapwa`, or moving tokens between Kapwa and shadcn |
| [references/languages.md](references/languages.md) | Adding Filipino or a regional language, a language switcher, or locale files |
| [references/rebranding.md](references/rebranding.md) | Adapting the palette, logo and copy for a different LGU |
| [references/accessibility.md](references/accessibility.md) | Reviewing a page, adding high-contrast mode or an accessibility statement, or setting up axe, Playwright and Lighthouse checks |

## Reviewing a change

When asked to check a page or diff against this system, go through:

- [ ] Semantic color utilities only (shadcn or Kapwa names); no palette classes; any new token is in `:root`, `.dark`, `.high-contrast` where needed, `@theme inline` and the doc.
- [ ] Radius and shadow match the role.
- [ ] Brand surfaces use `inverse` / `inverse-outline` buttons and `text-brand-foreground` steps.
- [ ] Every fact has a source link; the page shows its owner and last checked date.
- [ ] Service pages follow the contract; missing answers say "Not stated in the charter" rather than being guessed.
- [ ] LGU name and type-dependent labels come from the config and `lguLabels`.
- [ ] Phosphor icons with the `Icon` suffix; correct arrow direction; decorative icons hidden.
- [ ] Copy and URLs come from data or locale files; `lang` is set on the page and on any passage in another language.
- [ ] Works at 320px, 200% zoom, dark and high-contrast modes and keyboard only; focus ring visible.
- [ ] `node scripts/check-tokens.mjs <src-dir> <css-file>` (or `<src-dir> --kapwa`) passes.
