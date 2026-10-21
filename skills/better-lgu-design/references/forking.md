# Forking for another LGU

A portal built with this system should fork for another LGU by changing data, not components. The idea comes from BetterLB's `config/lgu.config.json` and type-aware labels, and from betterlocalgov's setup script.

## 1. One config file

[`assets/config/lgu.config.example.json`](../assets/config/lgu.config.example.json) holds everything that names the LGU:

| Key | What it holds |
| --- | --- |
| `lgu.type` | `barangay`, `municipality`, `city` or `province`. Decides the labels below |
| `lgu.name`, `lgu.fullName` | `"Naguilian"`, `"Municipality of Naguilian"` (as the LGU styles itself) |
| `lgu.province`, `lgu.region`, `lgu.regionCode` | `"La Union"`, `"Ilocos Region"`, `"Region I"` |
| `lgu.psgc` | Philippine Standard Geographic Code, if known. Useful for PSA data joins |
| `lgu.officialWebsite`, `lgu.officialFacebook` | The official channels the independence notice links to. `#` until confirmed |
| `lgu.coordinates` | For weather and maps. Leave `0, 0` with `features.weather: false` until known |
| `portal.*` | Portal name, footer name, domain, tagline, brand hue, theme color, volunteer contact, repo, logo |
| `languages` | Which locales ship and which are planned (see [languages.md](languages.md)) |
| `features` | Turn whole sections on or off. A disabled feature hides its nav item and route, not just its content |

Load it through [`assets/lib/lgu.ts`](../assets/lib/lgu.ts), which types it and exports `config`, `lguLabels` and `placeName`. Use it in page titles (`` `${page} · ${config.portal.name}` ``), meta tags, the top bar, the footer and the independence notice.

Keep facts with sources (hotlines, offices, officials, services) in the data files, not the config. The config holds identity; data files hold facts with a `source` and `lastChecked`.

## 2. Labels that follow the LGU type

Never hardcode "Mayor", "Sangguniang Bayan" or "Municipal Hall". Use `lguLabels`:

| Label | Barangay | Municipality | City | Province |
| --- | --- | --- | --- | --- |
| `head` | Punong Barangay | Mayor | Mayor | Governor |
| `vice` | (none) | Vice Mayor | Vice Mayor | Vice Governor |
| `council` | Sangguniang Barangay | Sangguniang Bayan | Sangguniang Panlungsod | Sangguniang Panlalawigan |
| `councilMember` | Barangay Kagawad | Councilor | Councilor | Board Member |
| `subdivisions` | Puroks and sitios | Barangays | Barangays | Municipalities and cities |
| `adjective` | Barangay | Municipal | City | Provincial |
| `seat` | Barangay Hall | Municipal Hall | City Hall | Provincial Capitol |

```tsx
import { config, lguLabels } from "@/lib/lgu"

<SectionHeading eyebrow="Government" title={`The ${lguLabels.council}`} />
<p>Office of the {lguLabels.head}, {lguLabels.seat}, {config.lgu.name}</p>
```

Where the LGU's own documents use a different name for an office (for example "Municipal Treasurer's Office" versus "Treasury Office"), print it as the source does and keep it in the data file.

Route paths stay the same for every LGU type (`/government/officials`, `/government/barangays`), so forks can share fixes. For a province, the `barangays` page lists component municipalities and cities instead.

## 3. What a fork replaces

| Replace | With |
| --- | --- |
| `config/lgu.config.json` | The new LGU's identity |
| Brand tokens in `src/index.css` | The new hue (see [rebranding.md](rebranding.md)) |
| Logo, favicon, PWA icons, manifest `name`, `theme_color` | The new portal's own mark (never the LGU seal) |
| `src/data/*` | Empty arrays and `#` links. Fill them only from the new LGU's own sources, with fresh `lastChecked` dates |
| `public/docs/` | The new LGU's Citizen's Charter PDF |
| Locale files | Keep the UI strings; replace any that name the old LGU |

Don't carry over the old LGU's facts as placeholders, even temporarily: a resident who sees another town's hotline number may call it.

## 4. Setup prompt

When the user asks to start or fork a portal, ask for these before writing files, and leave anything they don't know as a marked placeholder:

1. LGU type, name, province (and region)
2. Official website and Facebook page
3. Brand color: from the LGU's seal, flag or tourism branding, or a hue the user picks
4. Portal name and domain
5. Languages to plan for (English plus Filipino, and the regional language: Ilocano, Cebuano, Hiligaynon, Bikol, Waray, Kapampangan, Pangasinan, …)
6. Which sections to enable
7. Volunteer contact for corrections

A project can wrap these questions in a `scripts/setup-lgu` script (BetterLB and betterlocalgov both ship one), so volunteers without Claude can fork too.

## 5. Keeping forks in sync

Forks share fixes more easily when they keep the same file layout, route paths and component names. When a fix in one fork applies to all, open it upstream (in this plugin, or in the shared template the fork came from).
