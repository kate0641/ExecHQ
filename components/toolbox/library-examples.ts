/**
 * Library rows for the catalogue: Maya's artifacts as the homepage's states
 * hold them, run through the same `libraryItems` the Toolbox uses.
 */
import { libraryItems, type LibraryItem } from "@/lib/library";
import { HOME_STATES } from "@/mock/homepage";

const pick = (state: keyof typeof HOME_STATES, id: string): LibraryItem =>
  libraryItems(HOME_STATES[state].records).find((i) => i.record.id === id)!;

export const EXAMPLE_TODAY = "2026-10-22";
export const STORY_DRAFT = pick("first-return", "story");
export const BRIEF_READY = pick("drafted-not-used", "check-in-brief");
export const PITCH_WAITING = pick("drafted-not-used", "pitch");
export const STORY_CLOSED = pick("drafted-not-used", "story");
export const STORY_OUTCOME = pick("just-answered", "story");
