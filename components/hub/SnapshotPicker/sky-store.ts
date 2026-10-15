/**
 * The sky the reviewer picked in the dock, for Home's header. `null` until
 * they pick one, so Home follows the clock (or `?sky=` in the address) as
 * before. A reviewer tool: kept for the visit only, never stored.
 */
export type Sky = "dawn" | "day" | "dusk" | "night";
export const SKIES: Sky[] = ["dawn", "day", "dusk", "night"];

let picked: Sky | null = null;
const listeners = new Set<() => void>();

export function pickSky(next: Sky): void {
  picked = next;
  listeners.forEach((listener) => listener());
}

export function pickedSky(): Sky | null {
  return picked;
}

export function subscribeSky(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The sky her clock gives, as Home works it out: dawn 5–9, day 9–17, dusk 17–20, night after. */
export function clockSky(hour = new Date().getHours()): Sky {
  if (hour >= 5 && hour < 9) return "dawn";
  if (hour >= 9 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

/** The sky showing now: the dock's pick, else `?sky=` in the address, else her clock. */
export function currentSky(): Sky {
  const asked = SKIES.find((s) => s === new URLSearchParams(window.location.search).get("sky"));
  return pickedSky() ?? asked ?? clockSky();
}
