/**
 * The portal's LGU config and the labels that depend on the LGU type.
 * Copy to src/lib/lgu.ts. Components read names and type-dependent words from
 * here, never from hardcoded strings, so a fork only edits config/lgu.config.json.
 */

import raw from "../../config/lgu.config.json"

export type LguType = "barangay" | "municipality" | "city" | "province"

export type LguConfig = {
  lgu: {
    type: LguType
    name: string
    fullName: string
    province: string
    region: string
    regionCode: string
    /** Philippine Standard Geographic Code, when known. */
    psgc: string
    officialWebsite: string
    officialFacebook: string
    timeZone: string
    coordinates: { lat: number; lon: number }
  }
  portal: {
    name: string
    footerName: string
    domain: string
    baseUrl: string
    tagline: string
    /** OKLCH hue the brand tokens in index.css are built on (see references/rebranding.md). */
    brandHue: number
    /** Hex of --brand, for the web manifest and <meta name="theme-color"> only. */
    themeColor: string
    volunteerEmail: string
    githubUrl: string
    logoPath: string
  }
  languages: { default: string; available: string[]; planned: string[] }
  features: Record<
    "services" | "emergency" | "government" | "legislative" | "transparency" | "weather" | "tourism",
    boolean
  >
}

export const config = raw as LguConfig

type Labels = {
  /** "Mayor", "Governor", "Punong Barangay" */
  head: string
  /** "Vice Mayor", "Vice Governor"; empty for a barangay, which has none */
  vice: string
  /** "Sangguniang Bayan" */
  council: string
  /** "SB" */
  councilShort: string
  /** "Councilor", "Board Member", "Barangay Kagawad" */
  councilMember: string
  /** "Barangays", "Municipalities and cities", "Puroks and sitios" */
  subdivisions: string
  /** "Municipal", "City", "Provincial", "Barangay": for "Municipal Hall", "City Treasurer" */
  adjective: string
  /** "Municipal Hall", "City Hall", "Provincial Capitol", "Barangay Hall" */
  seat: string
}

// RA 7160 (Local Government Code) names for each level
const LABELS: Record<LguType, Labels> = {
  barangay: {
    head: "Punong Barangay",
    vice: "",
    council: "Sangguniang Barangay",
    councilShort: "SB",
    councilMember: "Barangay Kagawad",
    subdivisions: "Puroks and sitios",
    adjective: "Barangay",
    seat: "Barangay Hall",
  },
  municipality: {
    head: "Mayor",
    vice: "Vice Mayor",
    council: "Sangguniang Bayan",
    councilShort: "SB",
    councilMember: "Councilor",
    subdivisions: "Barangays",
    adjective: "Municipal",
    seat: "Municipal Hall",
  },
  city: {
    head: "Mayor",
    vice: "Vice Mayor",
    council: "Sangguniang Panlungsod",
    councilShort: "SP",
    councilMember: "Councilor",
    subdivisions: "Barangays",
    adjective: "City",
    seat: "City Hall",
  },
  province: {
    head: "Governor",
    vice: "Vice Governor",
    council: "Sangguniang Panlalawigan",
    councilShort: "SP",
    councilMember: "Board Member",
    subdivisions: "Municipalities and cities",
    adjective: "Provincial",
    seat: "Provincial Capitol",
  },
}

export const lguLabels = LABELS[config.lgu.type] ?? LABELS.municipality

/** "Naguilian, La Union"; a province is just its name. */
export const placeName =
  config.lgu.type === "province" ? config.lgu.name : `${config.lgu.name}, ${config.lgu.province}`
