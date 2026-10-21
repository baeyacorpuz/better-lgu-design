# Languages

Residents read English, Filipino and a regional language. Plan for all three from the first page, even when only English ships. betterlocalgov and BetterLB use i18next with locale files; BetterSolano keeps a translations script for its static pages.

## Which languages

- **English** first, in plain language (about grade 8).
- **Filipino** (`fil`) second.
- The **regional language** of the LGU third: Ilocano (`ilo`), Cebuano (`ceb`), Hiligaynon (`hil`), Bikol (`bik`), Waray (`war`), Kapampangan (`pam`), Pangasinan (`pag`), Tausug (`tsg`), Maguindanao (`mdh`), … Ask the user; don't assume from the region.
- List them in `languages` in `config/lgu.config.json` (`available` ships, `planned` shows as "coming soon").

## What gets translated

| Translate | Keep as printed |
| --- | --- |
| UI strings: nav, buttons, labels, empty states, errors | Official names: "Sangguniang Bayan", "Mayor's Clearance", "Cedula / Community Tax Certificate", office names |
| Page intros and plain-language explanations | Citizen's Charter text (requirements, steps, fees) as transcribed: it's a quotation of the source |
| Hotline descriptions | Phone numbers, addresses, people's names |

Add a plain-language gloss beside an official name rather than replacing it. When the charter exists only in English, say so on translated pages ("The Citizen's Charter is published in English") instead of machine-translating it.

## How to build it

- **Strings in locale files**, one file per language and namespace (`public/locales/<lang>/common.json`), loaded with i18next and `react-i18next` (or a typed `Record<Lang, Strings>` in `src/data/` for a small site). Components call `t("services.searchPlaceholder")`, never a literal.
- **Data that varies by language** (page intros, hotline descriptions) gets per-language fields: `description: { en: "…", fil: "…" }`. Fall back to `en` when a field is missing, and mark the fallback passage with `lang="en"`.
- **Routing:** keep the default language at the root (`/services`) and prefix the others (`/fil/services`). Keep the same path slugs in every language, so links and service ids are shared.
- **`<html lang>`** follows the current language. A passage in another language gets its own `lang` attribute, so screen readers switch voice.
- **SEO:** `<link rel="alternate" hreflang="…">` for every available language plus `x-default`.
- **Switcher:** in the header, labeled by each language's own name ("English", "Filipino", "Iloko"), not flags. Remember the choice in `localStorage`; never redirect by browser language without a way back.
- **Not ready yet:** show a planned language as disabled with a tooltip ("Coming soon") rather than shipping a partial translation that mixes languages on one screen.
- **Formats:** `₱` before amounts with `en-PH` number formatting in every language, Philippine Standard Time (`Asia/Manila`), dates like "21 October 2026" (or the Filipino month names in `fil`).

## Layout

Filipino and regional-language labels are often much longer than the English. Buttons, nav items, chips and card titles must wrap, not truncate. Test each new screen with the longest available language at 320px.

## Translators

Translations come from volunteers who speak the language. Record who translated and reviewed each locale file and when (a comment at the top or a `CONTRIBUTORS` list), the same way facts carry a `lastChecked` date.
