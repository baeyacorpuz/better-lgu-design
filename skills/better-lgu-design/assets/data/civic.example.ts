/**
 * Starting point for a portal's data layer: copy to src/data/civic.ts and fill it in.
 *
 * Every entry carries the source it was taken from, and `lastChecked` is the
 * date a volunteer last verified the file against those sources. Update it
 * whenever a fact changes. Leave fields the source doesn't give out rather
 * than guessing, and keep `#` as the href of any link that isn't confirmed yet.
 */

export const lastChecked = "1 January 2026"

export type Source = { label: string; href: string }

const sources = {
  province911: { label: "Provincial Government of <Province>: emergency hotlines", href: "#" },
  mdrrmo: { label: "MDRRMO <Town> (official Facebook page)", href: "#" },
  charter: { label: "<Year> Citizen’s Charter", href: "/docs/citizens-charter.pdf" },
} satisfies Record<string, Source>

/* ── Emergency ─────────────────────────────────────────────────────────── */

export type Hotline = {
  id: string
  name: string
  description: string
  /** `display` is what residents read, `dial` is what goes in the tel: link. */
  numbers: { label?: string; display: string; dial: string }[]
  source: Source
  sourceKind?: "agency-facebook"
  /** Shown in the top bar on every page, labelled with `shortName`. */
  pinned?: true
  shortName?: string
}

export const hotlines: Hotline[] = [
  {
    id: "911",
    name: "Emergency 911",
    description: "Nationwide hotline for police, fire, medical and disaster emergencies. Free from any phone.",
    numbers: [{ display: "911", dial: "911" }],
    source: sources.province911,
    pinned: true,
  },
  {
    id: "mdrrmo",
    name: "MDRRMO <Town>",
    description: "Municipal Disaster Risk Reduction and Management Office: rescue, floods, landslides and typhoons.",
    // placeholder: replace with the verified number
    numbers: [{ display: "0900 000 0000", dial: "09000000000" }],
    source: sources.mdrrmo,
    sourceKind: "agency-facebook",
    pinned: true,
    shortName: "MDRRMO",
  },
]

export const emergencyPage = {
  title: "Emergency hotlines",
  card: {
    call: "Call",
    facebookNote: "This number is published on the agency’s own Facebook page.",
  },
}

/* ── Offices and Citizen's Charter services ────────────────────────────── */

export type OfficeId = "mayor" | "treasury" | "civil-registry"

export type Office = {
  id: OfficeId
  name: string
  phone: string
  email?: string
  address: string
}

export const offices: Office[] = []

export type ServiceCategoryId =
  | "business"
  | "certificates"
  | "tax"
  | "health"
  | "social"
  | "agriculture"
  | "building"
  | "transport"
  | "records"
  | "environment"
  | "facilities"

export type ServiceAction = {
  /** Agency action. Absent when the charter gives only a fee/time/person for the client step. */
  action?: string
  fee?: string
  time?: string
  responsible?: string
}

export type ServiceStep = {
  /** What the client does. Empty when the charter lists only agency actions for the step. */
  client: string
  actions: ServiceAction[]
}

export type Requirement = {
  item: string
  whereToSecure?: string
  /** Heading the charter lists the requirement under, e.g. "For scholarship". */
  group?: string
}

export type Service = {
  id: string
  name: string
  category: ServiceCategoryId
  /** Department that publishes the service; joins to `offices`. */
  department: OfficeId
  /** "Office or Division" as printed. */
  office: string
  classification?: string
  transactionTypes: string[]
  whoMayAvail?: string
  requirements: Requirement[]
  steps: ServiceStep[]
  totalTime?: string
  totalFees?: string
  notes?: string[]
  /** 1-based PDF page where the service starts, for `#page=` links. */
  page: number
  keywords?: string[]
}

export const charterPage = (page: number) => `${sources.charter.href}#page=${page}`

/* ── Government ────────────────────────────────────────────────────────── */

export type Official = { name: string; position: string; committees?: string[]; source: Source }

export type Barangay = {
  name: string
  population?: number
  /** e.g. "PSA CBMS, July 2025" */
  populationSource?: string
  /** Leave empty until the municipality publishes them. */
  officials: Official[]
}
