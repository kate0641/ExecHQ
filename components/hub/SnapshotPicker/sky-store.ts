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
