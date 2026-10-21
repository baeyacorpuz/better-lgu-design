import * as React from "react"
import { ArrowUpRightIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />
}

export function Section({
  className,
  tone = "default",
  ...props
}: React.ComponentProps<"section"> & { tone?: "default" | "muted" | "brand" }) {
  return (
    <section
      className={cn(
        "py-16 sm:py-20",
        tone === "muted" && "bg-muted/60",
        tone === "brand" && "bg-brand text-brand-foreground",
        className
      )}
      {...props}
    />
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  invert,
}: {
  eyebrow?: string
  title: string
  description?: React.ReactNode
  className?: string
  invert?: boolean
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12",
        className
      )}
    >
      <div className="space-y-3">
        {eyebrow && (
          <Badge
            variant="secondary"
            className={cn(
              "rounded-full px-2.5 text-[11px] font-semibold tracking-wider uppercase",
              invert && "bg-white/10 text-brand-foreground"
            )}
          >
            {eyebrow}
          </Badge>
        )}
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
      </div>
      {description && (
        <p
          className={cn(
            "max-w-sm text-sm leading-relaxed text-pretty",
            invert ? "text-brand-foreground/75" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export function SourceLink({
  href,
  label = "Source",
  className,
}: {
  href: string
  label?: string
  className?: string
}) {
  // external sites and documents (like the charter PDF) open in a new tab
  const newTab = href.startsWith("http") || /\.pdf(#.*)?$/.test(href)
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel="noreferrer"
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline",
        className
      )}
    >
      {label}
      <ArrowUpRightIcon className="size-3" />
    </a>
  )
}

/** Top band for inner pages: eyebrow, h1, lead paragraph and optional actions. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string
  title: string
  description: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("bg-muted/60", className)}>
      <Container className="space-y-5 py-12 sm:py-16">
        <Badge variant="secondary" className="rounded-full px-2.5 text-[11px] font-semibold tracking-wider uppercase">
          {eyebrow}
        </Badge>
        <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">{title}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{description}</p>
        {children}
      </Container>
    </section>
  )
}

/** "How we checked this" note plus the list of sources behind a page. */
export function SourcesNote({
  note,
  sources,
  title = "Where these facts come from",
}: {
  note: string
  sources: { label: string; href: string }[]
  title?: string
}) {
  return (
    <aside aria-labelledby="sources-title" className="space-y-3 rounded-xl border bg-card p-6 text-sm">
      <h2 id="sources-title" className="font-semibold">
        {title}
      </h2>
      <p className="text-pretty text-muted-foreground">{note}</p>
      <ul className="space-y-1.5">
        {sources.map((s) => (
          <li key={s.href}>
            <SourceLink href={s.href} label={s.label} className="text-left text-sm" />
          </li>
        ))}
      </ul>
    </aside>
  )
}
