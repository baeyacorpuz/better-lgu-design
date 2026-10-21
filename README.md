# better-lgu-design

A [Claude Code](https://claude.com/claude-code) plugin with a shared design system and civic patterns for community-built portals of Philippine local government units (LGUs). It takes what works from four volunteer projects in the Better&lt;LGU&gt; family:

| Project | What this plugin takes from it |
| --- | --- |
| [Better Naguilian](https://github.com/baeyacorpuz/betternaguilianlu) (Naguilian, La Union) | The base system: OKLCH semantic tokens with dark mode, shadcn/ui variants, layout helpers, sourced facts, hotlines, Citizen's Charter service pages, axe/Lighthouse checks |
| [BetterSolano](https://github.com/BetterSolano/bettersolano) (Solano, Nueva Vizcaya) | High-contrast mode, an accessibility statement page, an offline fallback page, validating service data |
| [BetterLB](https://github.com/BetterLosBanos/betterlb) (Los Baños, Laguna) | One LGU config file for forking, labels that adapt to the LGU type (Mayor or Governor, Sangguniang Bayan, Panlungsod or Panlalawigan), the [Kapwa](https://www.npmjs.com/package/@bettergov/kapwa) token vocabulary, a rendered-page token check |
| [betterlocalgov](https://github.com/iyanski/betterlocalgov) | Task-first entry points (Apply, Report, Pay, Book, Find), a fixed set of questions every service page answers, an owner and "last updated" date on every page, multilingual support |

It's for building a portal for another town, city, province or barangay that feels calm, sourced and accessible, in that LGU's own colors. It works whether the project uses shadcn/ui (the default) or BetterGov's Kapwa components.

## What's inside

```
skills/better-lgu-design/
├── SKILL.md                    principles, rules, setup and review checklist
├── references/
│   ├── foundations.md          color, type, spacing, shape, elevation, motion, icons
│   ├── components.md           Button, Card, Badge, layout helpers, shell, search, data cards
│   ├── civic-patterns.md       task entry points, the service page contract, sources, hotlines, officials, transparency
│   ├── forking.md              one LGU config, LGU-type labels, what to replace when forking
│   ├── kapwa.md                mapping between these tokens and Kapwa's, rebranding a Kapwa project
│   ├── languages.md            English, Filipino and regional languages: routing, strings, fallbacks
│   ├── rebranding.md           swapping the brand hue and identity
│   └── accessibility.md        WCAG 2.1 AA checklist, high-contrast mode, accessibility statement, CI checks
├── assets/
│   ├── index.css               OKLCH tokens (light, dark, high contrast) for Tailwind CSS v4
│   ├── components.json         shadcn/ui config (radix-mira, Phosphor icons)
│   ├── components/ui/          button, badge, card with the extra variants
│   ├── components/site/        Container, Section, SectionHeading, SourceLink, PageHero, SourcesNote
│   ├── components/civic/       HotlineCard
│   ├── config/lgu.config.example.json   the single file a fork edits first
│   ├── lib/lgu.ts              typed config loader and LGU-type labels
│   ├── hooks/use-contrast.ts   high-contrast toggle
│   ├── data/civic.example.ts   typed data layer: sources, hotlines, offices, charter services
│   └── e2e/tokens.spec.ts      Playwright check for raw colors in the rendered page
└── scripts/check-tokens.mjs    fails on raw colors in components or missing theme tokens (shadcn or Kapwa)
```

Stack: React, TypeScript, Tailwind CSS v4, shadcn/ui on Radix (or Kapwa), Phosphor icons, Manrope. The rules themselves (sourcing, tokens, radius by role, accessibility) apply to any stack, including a static HTML site like BetterSolano's.

## Install

In Claude Code:

```
/plugin marketplace add baeyacorpuz/better-lgu-design
/plugin install better-lgu-design@better-lgu-design
```

Then ask for what you need, for example:

- "Start a portal for San Juan, La Union with the Better LGU design, in a teal brand color."
- "Fork this portal for the City of San Fernando." (labels switch to Sangguniang Panlungsod)
- "Build the emergency hotlines page."
- "Add a Citizen's Charter service page."
- "Review this page against the Better LGU design." (works on Kapwa projects too)

Claude loads the skill when the task matches. You can also copy `skills/better-lgu-design/` into a project's `.claude/skills/` folder to use it without the plugin.

## Check tokens without Claude

```sh
# shadcn/ui project (tokens in src/index.css)
node skills/better-lgu-design/scripts/check-tokens.mjs src src/index.css

# Kapwa project
node skills/better-lgu-design/scripts/check-tokens.mjs src --kapwa
```

## Relationship to civic-portal-design

[civic-portal-design](https://github.com/baeyacorpuz/civic-portal-design) stays Better Naguilian's own packaged system. This plugin is the community-wide version and may move faster. When a rule here proves itself, it can flow back.

## Contributing

Issues and pull requests are welcome, especially patterns from other community-built LGU portals. Credit the project a pattern comes from in [CREDITS.md](CREDITS.md).

This plugin is not affiliated with any government office, nor with BetterGov.ph.

## License

[MIT](LICENSE). See [CREDITS.md](CREDITS.md) for the projects it learns from and their licenses.
