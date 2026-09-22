import { initialState, type OnboardingState } from "./state";
import { ONBOARDING_STEPS, type OnboardingStep } from "./steps";

/**
 * Session resume.
 *
 * An abandoned session is a required state: someone starts onboarding, closes
 * the tab, and comes back. The flow keeps its answers in localStorage so it can
 * offer to pick up where it stopped rather than starting again.
 *
 * Keyed per concept so walking concept 1 does not leave state sitting in front
 * of concept 2. Every read is defensive: storage can throw in a private window,
 * and a stored shape from an older build must never crash the page.
 */
function storageKey(conceptId: string): string {
  return `exechq.onboarding.${conceptId}`;
}

function isStep(value: unknown): value is OnboardingStep {
  return (
    typeof value === "string" &&
    (ONBOARDING_STEPS as readonly string[]).includes(value)
  );
}

/** Narrow enough to reject an old or hand-edited shape, loose enough that
 *  adding an answer field does not invalidate every stored session. */
function isOnboardingState(value: unknown): value is OnboardingState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<OnboardingState>;
  return (
    isStep(candidate.step) &&
    typeof candidate.answers === "object" &&
    candidate.answers !== null &&
    Array.isArray(candidate.skipped) &&
    Array.isArray(candidate.visited)
  );
}

export function readSession(conceptId: string): OnboardingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(conceptId));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isOnboardingState(parsed)) return null;
    // Merge over the initial state so a stored session missing a newer field
    // resumes with that field's default rather than undefined.
    return {
      ...initialState,
      ...parsed,
      answers: { ...initialState.answers, ...parsed.answers },
    };
  } catch {
    return null;
  }
}

export function writeSession(conceptId: string, state: OnboardingState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(conceptId), JSON.stringify(state));
  } catch {
    // A full or blocked store must not break the flow. Resume is a convenience,
    // never a dependency.
  }
}

export function clearSession(conceptId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(storageKey(conceptId));
  } catch {
    // Same reasoning as writeSession.
  }
}

/** A session worth offering to resume: started, but not finished. */
export function isResumable(state: OnboardingState): boolean {
  return state.step !== "account" && state.step !== "complete";
}

/* -----------------------------------------------------------------------------
   READING THE STORED SESSION DURING RENDER
   -----------------------------------------------------------------------------
   The stored session is client-only, so it cannot be read while rendering on
   the server without the two disagreeing on the first paint. Same shape as the
   viewport and toolbar stores: a tiny external store behind
   useSyncExternalStore, with a server snapshot of null.

   The snapshot is cached because useSyncExternalStore compares it by identity
   on every render — returning a freshly parsed object each time would loop.
   -------------------------------------------------------------------------- */

const listeners = new Set<() => void>();
const cache = new Map<string, OnboardingState | null>();

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSessionSnapshot(conceptId: string): OnboardingState | null {
  if (!cache.has(conceptId)) cache.set(conceptId, readSession(conceptId));
  return cache.get(conceptId) ?? null;
}

export function getServerSessionSnapshot(): OnboardingState | null {
  return null;
}

/** Drops the cached session and tells subscribers. Called when a session is
 *  cleared, so a restarted flow does not keep offering to resume itself. */
export function invalidateSession(conceptId: string): void {
  cache.set(conceptId, null);
  listeners.forEach((listener) => listener());
}
