#!/usr/bin/env node
// Checks a project against the better-lgu-design token rules.
//
//   node check-tokens.mjs [src-dir] [css-file]     shadcn project (defaults: src, src/index.css)
//   node check-tokens.mjs [src-dir] --kapwa        Kapwa (@bettergov/kapwa) project
//
// 1. Components use semantic utilities only: no arbitrary hex classes (bg-[#123456]),
//    no oklch()/rgb()/hsl(), no hex colors in inline styles, and no Tailwind palette
//    classes (bg-blue-500, text-slate-700).
// 2. shadcn mode: every color token in :root is redefined in .dark (except --chart-*)
//    and mapped in @theme inline as --color-<name>; .high-contrast, if present, only
//    redefines tokens that exist in :root.
// 3. Kapwa mode: Kapwa primitives (text-kapwa-blue-600) are warned about, since a
//    semantic alias (text-kapwa-text-info) should be used instead. The CSS block checks
//    are skipped.
// A line is skipped when it or the line above contains `tokens-allow` (for third-party
// brand marks such as a Facebook logo tile). Say why next to it.
// Exits 1 and lists every problem when a rule is broken. Warnings don't fail.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const args = process.argv.slice(2)
const kapwa = args.includes('--kapwa')
const positional = args.filter((a) => !a.startsWith('--'))
const srcDir = resolve(positional[0] ?? 'src')
const cssFile = resolve(positional[1] ?? join(srcDir, 'index.css'))
const problems = []
const warnings = []

const utility = '(?:bg|text|border(?:-[trblxy])?|ring|ring-offset|outline|fill|stroke|from|via|to|divide|decoration|shadow|accent|caret|placeholder)'
const palette = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'

// translucent white/black (bg-white/10) is allowed; only literal colors are flagged
const rawColor = [
  { re: /\[#[0-9a-fA-F]{3,8}\]/g, why: 'arbitrary hex class' },
  { re: /\b(?:oklch|oklab|rgba?|hsla?)\(/g, why: 'raw color function' },
  { re: /\b(?:color|background|backgroundColor|fill|stroke|borderColor)\s*:\s*["'`]#[0-9a-fA-F]{3,8}\b/g, why: 'hex color in inline style' },
  { re: new RegExp(`(?<![\\w-])${utility}-(?:${palette})-\\d{2,3}\\b`, 'g'), why: 'Tailwind palette class' },
]
const kapwaPrimitive = new RegExp(`(?<![\\w-])${utility}-kapwa-(?:brand|gray|neutral|blue|green|red|orange|yellow|purple)-\\d{2,3}\\b`, 'g')

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (/\.(tsx|jsx|ts|js|html|vue|svelte|astro)$/.test(name) && !/\.d\.ts$/.test(name)) checkComponent(path)
  }
}

function checkComponent(path) {
  const lines = readFileSync(path, 'utf8').split('\n')
  const where = (i) => `${relative(process.cwd(), path)}:${i + 1}`
  lines.forEach((line, i) => {
    if (line.includes('tokens-allow') || lines[i - 1]?.includes('tokens-allow')) return
    for (const { re, why } of rawColor) {
      re.lastIndex = 0
      if (re.test(line)) problems.push(`${where(i)}  ${why}: ${line.trim().slice(0, 100)}`)
    }
    if (kapwa) {
      kapwaPrimitive.lastIndex = 0
      const hit = line.match(kapwaPrimitive)
      if (hit) warnings.push(`${where(i)}  Kapwa primitive ${hit[0]}: use a semantic alias, or mark tokens-allow`)
    }
  })
}

function block(css, selector) {
  const start = css.search(selector)
  if (start === -1) return null
  const open = css.indexOf('{', start)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}' && --depth === 0) return css.slice(open + 1, i)
  }
  return null
}

const vars = (text) => new Set([...(text ?? '').matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]))

function checkTokens() {
  const css = readFileSync(cssFile, 'utf8')
  const root = block(css, /:root\s*\{/)
  const dark = block(css, /\.dark\s*\{/)
  const theme = block(css, /@theme\s+inline\s*\{/)
  const contrast = block(css, /(?<![\w-])\.high-contrast\s*\{/)
  if (!root || !dark || !theme) {
    problems.push(`${cssFile}: expected :root, .dark and @theme inline blocks`)
    return
  }
  const rootVars = [...vars(root)].filter((v) => v !== '--radius')
  const darkVars = vars(dark)
  const themeVars = vars(theme)
  for (const v of rootVars) {
    if (!v.startsWith('--chart-') && !darkVars.has(v)) problems.push(`${v} is in :root but not in .dark`)
    if (!themeVars.has(`--color-${v.slice(2)}`)) problems.push(`${v} has no --color-${v.slice(2)} mapping in @theme inline`)
  }
  for (const v of darkVars) {
    if (!rootVars.includes(v)) problems.push(`${v} is in .dark but not in :root`)
  }
  for (const v of vars(contrast)) {
    if (!rootVars.includes(v)) problems.push(`${v} is in .high-contrast but not in :root`)
  }
}

walk(srcDir)
if (!kapwa) checkTokens()

for (const w of warnings) console.warn(`  warning: ${w}`)
if (problems.length) {
  console.error(`better-lgu-design: ${problems.length} problem(s)\n`)
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}
console.log(`better-lgu-design: tokens and components look good${kapwa ? ' (Kapwa mode)' : ''}`)
