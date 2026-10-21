# Accessibility and quality checks

The target is WCAG 2.1 AA in light, dark and high-contrast modes.

## Checklist

- Visible `focus-visible` ring on everything interactive, including stretched card links (ring on `after:`) and focusable wrappers around disabled controls.
- Contrast: 4.5:1 for text, 3:1 for large text and control boundaries. Check `muted-foreground` on `muted` / `accent`, and `/70` text on `brand`, in **both** themes.
- Icon-only controls have an `aria-label`. Decorative SVG has `aria-hidden`. The logo image has `alt=""` next to the visible wordmark.
- Tap-to-call and other touch-first actions reach 44px (`size="lg"` + `min-h-11`).
- Text reflows at 320px and at 200% zoom. Long labels wrap instead of truncating, except one-line status strips, which keep the full text available (for example in an `aria-label`).
- One `h1` per page; headings in order; landmarks (`header`, `nav` with labels, `main#main`, `footer`); a skip link first.
- Lists of things are real lists (`ul`/`ol`); key–value facts are `dl`; visually hidden labels (`sr-only`) where an icon stands in for a word.
- Forms have real `<label>`s, error text tied with `aria-describedby`, and never rely on color alone.
- Live data (loading, errors, offline) is announced with `role="status"` or `role="alert"`.
- Anything beyond small hover movements respects `prefers-reduced-motion`.
- Each page sets a descriptive `<title>` ("Business permit · Better Town").

## High-contrast mode

From BetterSolano, which ships a yellow-on-black mode beside its accessibility page.

- [`assets/index.css`](../assets/index.css) has a `.high-contrast` token set: black surfaces, white text, yellow primary and focus ring, solid white borders, underlined links. It overrides light and dark, and ignores the brand hue on purpose.
- [`assets/hooks/use-contrast.ts`](../assets/hooks/use-contrast.ts) toggles the class on `<html>`, remembers the choice in `localStorage`, and follows `prefers-contrast: more` until the resident chooses.
- Put the toggle next to the theme toggle in the header (an icon button with `aria-pressed` and an `aria-label` like "High contrast"), and on the accessibility page.
- Use the `contrast:` variant only for things tokens can't express (hiding a decorative background image, thickening a border). Never hardcode colors in it.
- A token that carries text, borders or focus needs a `.high-contrast` value. Decorative tokens (charts) can stay out.
- Images of text and photos behind text lose their overlay contrast here; give them a solid `bg-background` fallback.

## Accessibility statement

A page at `/accessibility`, linked from the footer, written plainly:

- The standard the site aims for (WCAG 2.1 AA) and how it's checked (automated axe and Lighthouse runs, plus manual keyboard and screen reader checks), with the date of the last check.
- What residents can adjust: dark mode, high contrast, text size (browser zoom to 200% works), language.
- Known problems that aren't fixed yet, honestly listed (for example a third-party map or a scanned PDF that isn't tagged).
- How to report a barrier: the volunteer email and the issue tracker, and a promise of what happens next.
- It's a community site: barriers on the LGU's official website or offices should go to the LGU, with the official contact.

## Automated checks

### axe with Playwright

Run every route in both color schemes and fail on any violation.

```ts
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const ROUTES = ['/', '/services', '/emergency', '/about', '/accessibility']
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

for (const theme of ['light', 'dark', 'high-contrast'] as const) {
  for (const path of ROUTES) {
    test(`${path} has no WCAG A/AA violations (${theme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme === 'dark' ? 'dark' : 'light' })
      await page.goto(path)
      if (theme === 'high-contrast') await page.evaluate(() => document.documentElement.classList.add('high-contrast'))
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const results = await new AxeBuilder({ page })
        .withTags(TAGS)
        // third-party embeds such as an OpenStreetMap iframe
        .exclude('iframe[title^="Map"]')
        .analyze()
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
    })
  }
}
```

Run the suite on a desktop and a mobile project. Also fail tests on uncaught page errors and console errors.

### Lighthouse CI

`.lighthouserc.json` assertions used by the reference project:

```json
{
  "categories:accessibility": ["error", { "minScore": 0.95 }],
  "categories:best-practices": ["error", { "minScore": 0.9 }],
  "categories:seo": ["warn", { "minScore": 0.9 }],
  "categories:performance": ["warn", { "minScore": 0.8 }]
}
```

### Token check

[`scripts/check-tokens.mjs`](../scripts/check-tokens.mjs) fails when a component uses a raw hex, `oklch()` or Tailwind palette color, or when a token is missing from `:root`, `.dark` or `@theme inline` (or `.high-contrast` defines one `:root` doesn't):

```sh
node <skill-dir>/scripts/check-tokens.mjs src src/index.css
node <skill-dir>/scripts/check-tokens.mjs src --kapwa      # Kapwa project
```

[`assets/e2e/tokens.spec.ts`](../assets/e2e/tokens.spec.ts) does the same on the rendered `<main>` of each route, which catches classes built at runtime.

## CI order

lint → typecheck and build → Playwright (axe + page tests) on desktop and mobile → Lighthouse against the built site.
