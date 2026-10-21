import { FacebookLogoIcon, PhoneCallIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SourceLink } from "@/components/site/section"
import type { Hotline } from "@/data/civic"

/** Copy for the card. Keep it in the data layer, e.g. `emergencyPage.card` in data/civic.ts. */
export type HotlineCardCopy = {
  /** Prefix for each call button's accessible name, e.g. "Call". */
  call: string
  /** Shown when the number was only published on the agency's Facebook page. */
  facebookNote: string
}

/** One agency with tap-to-call numbers and its source. `featured` is for 911 at the top of /emergency. */
export function HotlineCard({ hotline, copy, featured }: { hotline: Hotline; copy: HotlineCardCopy; featured?: boolean }) {
  return (
    <Card className={cn("h-full gap-4", featured && "border-emergency/40 bg-emergency/5")}>
      <CardHeader>
        <CardTitle className={cn("text-lg", featured && "text-2xl")}>{hotline.name}</CardTitle>
        <CardDescription className="text-pretty">{hotline.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-2">
        {hotline.numbers.map((n) => (
          <Button
            key={n.dial}
            asChild
            size="lg"
            variant={featured ? "emergency" : "outline"}
            className="h-auto min-h-11 w-full justify-start py-2 text-left whitespace-normal"
          >
            <a href={`tel:${n.dial}`} aria-label={`${copy.call} ${hotline.name}${n.label ? `, ${n.label}` : ""}: ${n.display}`}>
              <PhoneCallIcon weight="fill" aria-hidden />
              <span className="flex-1 text-base tabular-nums">{n.display}</span>
              {n.label && <span className="text-xs font-medium opacity-75">{n.label}</span>}
            </a>
          </Button>
        ))}
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 border-t [.border-t]:pt-4">
        {hotline.sourceKind === "agency-facebook" && (
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <FacebookLogoIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {copy.facebookNote}
          </p>
        )}
        <SourceLink href={hotline.source.href} label={hotline.source.label} className="text-left" />
      </CardFooter>
    </Card>
  )
}
