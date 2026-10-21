import * as React from "react"

// Copy to src/hooks/use-contrast.ts and rename the key with the portal's prefix.
const STORAGE_KEY = "portal-contrast"

function readContrast(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "high" || stored === "normal") return stored === "high"
  } catch {
    // storage unavailable; fall through to system preference
  }
  return window.matchMedia("(prefers-contrast: more)").matches
}

/** Toggles `.high-contrast` on <html>; the tokens live in index.css. */
export function useContrast() {
  const [high, setHigh] = React.useState<boolean>(readContrast)

  React.useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", high)
    try {
      localStorage.setItem(STORAGE_KEY, high ? "high" : "normal")
    } catch {
      // ignore
    }
  }, [high])

  const toggle = React.useCallback(() => setHigh((h) => !h), [])

  return { high, toggle }
}
