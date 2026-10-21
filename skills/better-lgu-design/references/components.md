# Components

Primitives are shadcn/ui (`radix-mira` style, Radix underneath, Phosphor icons). Ready-to-copy versions of the customized ones are in [`assets/components/`](../assets/components/).

## Button

[`assets/components/ui/button.tsx`](../assets/components/ui/button.tsx)

| Variant | Use |
| --- | --- |
| `default` | The one primary action in a region |
| `secondary` | Supporting action on light surfaces |
| `outline` | Neutral alternative, filters, hotline numbers that aren't featured |
| `ghost` | Toolbar, nav and icon actions |
| `link` | Inline text actions |
| `destructive` | Irreversible or error actions |
| `emergency` | Tap-to-call emergency hotlines (911) |
| `inverse` | Primary action **on brand surfaces** |
| `inverse-outline` | Secondary action **on brand surfaces** |

Sizes: `sm` (32px), `default` (36px), `lg` (40px), `icon` (36px), `icon-sm` (32px). Every size uses the `md` radius and `font-semibold`. Focus is `ring-[3px] ring-ring/50`. For links styled as buttons, use `asChild` around the router's `<Link>` or an `<a>`. Prefer `lg` for touch-first actions, and give call buttons `min-h-11` so they reach 44px.

## Card

[`assets/components/ui/card.tsx`](../assets/components/ui/card.tsx)

- Anatomy: `CardHeader` (icon tile, `CardTitle`, `CardDescription`, optional `CardAction` arrow) → `CardContent` (`mt-auto` pins it to the bottom) → `CardFooter` (`border-t` + `SourceLink`).
- **Whole-card link.** Give the card `group relative`, and put the real link inside the title with a stretched pseudo-element. Raise any secondary link in the card with `relative z-10`.

```tsx
<Card className="group relative gap-4 transition-all hover:-translate-y-0.5 hover:border-ring/50 hover:shadow-md">
  <CardHeader>
    <span className="mb-2 flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
      <ReceiptIcon className="size-5" />
    </span>
    <CardAction>
      <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </CardAction>
    <CardTitle className="text-base">
      <Link
        to="/services"
        search={{ category: "tax" }}
        className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50"
      >
        {category.name}
      </Link>
    </CardTitle>
    <CardDescription>{category.description}</CardDescription>
  </CardHeader>
</Card>
```

- **Feature card:** `border-transparent bg-primary text-primary-foreground`, icon tile `bg-white/10`, focus ring `after:ring-white/50`. At most one per grid.

## Badge

[`assets/components/ui/badge.tsx`](../assets/components/ui/badge.tsx)

- Variants: `default`, `secondary`, `outline`, `destructive`. Badges default to the `md` radius.
- **Eyebrow:** `variant="secondary"` + `rounded-full px-2.5 text-[11px] font-semibold uppercase tracking-wider`. On brand: `bg-white/10 text-brand-foreground`.
- **Chip** (clickable): `asChild` around a `<button>`, `variant="secondary"` + `rounded-full px-3 py-1 cursor-pointer`.

## Layout helpers

[`assets/components/site/section.tsx`](../assets/components/site/section.tsx)

| Helper | What it does |
| --- | --- |
| `Container` | `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8` |
| `Section` | `py-16 sm:py-20`; `tone` = `default`, `muted` (`bg-muted/60`) or `brand` (`bg-brand text-brand-foreground`) |
| `SectionHeading` | Eyebrow + H2 on the left, `max-w-sm` description on the right from `md` up; `invert` on brand bands |
| `SourceLink` | `text-xs` muted link with `ArrowUpRightIcon`; external URLs and PDFs open in a new tab |
| `PageHero` | Muted band at the top of inner pages: eyebrow, H1, lead, optional actions |
| `SourcesNote` | "Where these facts come from" aside: a note (with the checked date) and a list of `SourceLink`s |

## Shell

Order inside the root layout: skip link → top bar → header → offline banner → `<main id="main" className="flex-1">` → footer, all in `flex min-h-dvh flex-col`.

```tsx
<a
  href="#main"
  className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
>
  Skip to content
</a>
```

- **Top bar** (`bg-brand text-brand-foreground`), two rows:
  1. Emergency strip: `bg-emergency text-emergency-foreground`, `SirenIcon weight="fill"`, the pinned hotlines as `tel:` links (`font-bold tabular-nums`, focus `ring-2 ring-emergency-foreground`), and a link to `/emergency`. Show one number on mobile, more from `sm` and `md` up; never let the strip wrap into a tall block.
  2. Place row (`h-8 text-xs`): `MapPinIcon weight="fill"` in `text-brand-muted` with the town and province, and local time on `sm` and up.
- **Header:** `sticky top-0 z-40 h-16 border-b bg-background/85 backdrop-blur`. `Logo` = 36px icon (`rounded-lg`, `alt=""`) + two-line wordmark (`text-sm font-bold` name over a `text-[11px] text-muted-foreground` tagline). Desktop `NavigationMenu` from `xl`; below that a `Sheet` menu. Dropdown items: `text-sm font-semibold` title over a `text-xs text-muted-foreground line-clamp-2` description.
- **Language toggle:** `ToggleGroup` with `text-xs font-semibold` items. A locale that isn't ready is disabled and wrapped in a focusable span with a tooltip that says why.
- **Footer:** muted or brand band with the independence notice, quick links, sources, the checked date, and links to the official site.

## Search

- A provider exposes `open(query?)` from anywhere; a ⌘K `CommandDialog` holds the results.
- Search "fields" on pages are **buttons that open the dialog** (`h-12 rounded-lg border border-input bg-background`), not free inputs. Popular-search chips open the dialog prefilled.
- Rank with a weighted index: name > keywords > office and office aliases > category name > category description. Every query token must match; whole word > prefix > substring (substring only for tokens of 4+ characters). Add aliases residents actually use (`"MSWDO"`, `"munisipyo"`, `"cedula"`).
- Keep result counts, empty states with a next step, and keyboard behavior.
- On a listing page, keep filter state in the URL (`?category=&q=`) and update it with `replace` so Back works.

## Live data cards (weather, sun and moon)

- One compact row: a `size-11 rounded-lg bg-accent` icon tile (decorative), a `text-2xl font-bold` value over a `text-base text-muted-foreground` label, a 1px divider, then a `text-base` facts line separated by middle dots over a `text-xs` note. Below `sm` it stacks and the divider turns horizontal.
- Sections holding only these cards use `py-10 sm:py-12` and `mb-6`.
- Attribute the data source in the note (for example Open-Meteo, CC BY 4.0), and say plainly that a model forecast is not an official PAGASA advisory.
- Loading state keeps the same footprint (`Skeleton`, `role="status"`, `motion-reduce:animate-none`). Error state is inline with a "Try again" link button. Flag stale data in the "As of" line.

## Other primitives

Accordion, Alert, Avatar, Checkbox, Command, Dialog, Input, Label, NavigationMenu, Progress, RadioGroup, Separator, Sheet, Skeleton, Textarea, Toggle / ToggleGroup and Tooltip come from shadcn and are used as is. Change their look through tokens or a new CVA variant.

## Data visualization

Use `--chart-1` … `--chart-5` in order (brand first). Every chart needs a text alternative or a visible data summary and must stay legible in both themes.
