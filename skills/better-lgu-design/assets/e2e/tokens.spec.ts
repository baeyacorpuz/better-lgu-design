import { expect, test } from "@playwright/test"

/**
 * Rendered-page token check: copy into the project's e2e/ folder.
 * Catches raw colors in classes built at runtime, which the static
 * check-tokens.mjs can't see. Only <main> is checked; <pre> examples are skipped.
 * (BetterLB runs a similar check for Kapwa tokens.)
 */

const ROUTES = ["/", "/services", "/emergency", "/about"]

const PALETTE =
  /(?<![\w-])(?:bg|text|border|ring|outline|fill|stroke|from|via|to|divide|decoration|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/
const ARBITRARY_HEX = /\[#[0-9a-fA-F]{3,8}\]/

for (const path of ROUTES) {
  test(`${path} uses semantic color tokens only`, async ({ page }) => {
    await page.goto(path)
    const offenders = await page.locator("main [class]").evaluateAll(
      (els, [palette, hex]) => {
        const p = new RegExp(palette)
        const h = new RegExp(hex)
        return els
          .filter((el) => !el.closest("pre, [data-tokens-allow]"))
          .map((el) => el.getAttribute("class") ?? "")
          .filter((c) => p.test(c) || h.test(c))
      },
      [PALETTE.source, ARBITRARY_HEX.source] as const,
    )
    expect(offenders).toEqual([])
  })
}
