/**
 * The prototype toolbar's own state: where it sits, and whether it is collapsed.
 *
 * Same shape as the viewport store in `lib/viewport-context.tsx`: a tiny
 * external store read through useSyncExternalStore, so the position can be read
 * synchronously on the client without a setState-in-effect on mount.
 *
 * Position is in pixels from the top left of the window, or `null` for "not
 * placed yet" — in which case the dock sits at its anchored default (the right
 * edge, vertically centred) from CSS alone. That keeps the default free of any
 * measurement, so the server and the client agree on the first paint.
 *
 * A placed position is persisted on drop rather than on every pointer move, so
 * dragging never writes to localStorage mid-gesture.
 */
export interface ToolbarPosition {
  x: number;
  y: number;
}

/** Matches --space-md. The gap the toolbar keeps from the window edges. */
export const TOOLBAR_EDGE_MARGIN = 16;

const STORAGE_KEY = "exechq.toolbar-position";

const listeners = new Set<() => void>();
/** `undefined` means "not read from storage yet"; `null` is a real value. */
let cached: ToolbarPosition | null | undefined;

function isPosition(value: unknown): value is ToolbarPosition {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as ToolbarPosition).x === "number" &&
    typeof (value as ToolbarPosition).y === "number" &&
    Number.isFinite((value as ToolbarPosition).x) &&
    Number.isFinite((value as ToolbarPosition).y)
  );
}

function readStoredPosition(): ToolbarPosition | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (isPosition(parsed)) return parsed;
    }
  } catch {
    // Storage disabled, or something else wrote nonsense there. Stay anchored.
  }
  return null;
}

/** `null` means the dock has not been moved and sits at its anchored default. */
export function getToolbarPosition(): ToolbarPosition | null {
  if (cached === undefined) cached = readStoredPosition();
  return cached;
}

export function getServerToolbarPosition(): ToolbarPosition | null {
  return null;
}

export function subscribeToToolbarPosition(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * @param next `null` returns the dock to its anchored default.
 * @param persist false while a drag is in flight, true when it is dropped.
 */
export function setToolbarPosition(
  next: ToolbarPosition | null,
  persist = true
): void {
  cached = next;
  if (persist) {
    try {
      if (next === null) window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Not being able to persist is not worth failing over.
    }
  }
  for (const listener of listeners) listener();
}

/** Keeps the toolbar fully inside the window, whatever the window is doing. */
export function clampToolbarPosition(
  position: ToolbarPosition,
  size: { width: number; height: number },
  windowSize: { width: number; height: number }
): ToolbarPosition {
  const maxX = Math.max(
    TOOLBAR_EDGE_MARGIN,
    windowSize.width - size.width - TOOLBAR_EDGE_MARGIN
  );
  const maxY = Math.max(
    TOOLBAR_EDGE_MARGIN,
    windowSize.height - size.height - TOOLBAR_EDGE_MARGIN
  );
  return {
    x: Math.min(Math.max(position.x, TOOLBAR_EDGE_MARGIN), maxX),
    y: Math.min(Math.max(position.y, TOOLBAR_EDGE_MARGIN), maxY),
  };
}

export const TOOLBAR_CORNERS = [
  { key: "top-left", label: "top left" },
  { key: "top-right", label: "top right" },
  { key: "bottom-right", label: "bottom right" },
  { key: "bottom-left", label: "bottom left" },
] as const;

export type ToolbarCorner = (typeof TOOLBAR_CORNERS)[number]["key"];

/** The four corner positions for a toolbar of this size in this window. */
export function toolbarCornerPositions(
  size: { width: number; height: number },
  windowSize: { width: number; height: number }
): Record<ToolbarCorner, ToolbarPosition> {
  const right = Math.max(
    TOOLBAR_EDGE_MARGIN,
    windowSize.width - size.width - TOOLBAR_EDGE_MARGIN
  );
  const bottom = Math.max(
    TOOLBAR_EDGE_MARGIN,
    windowSize.height - size.height - TOOLBAR_EDGE_MARGIN
  );
  return {
    "top-left": { x: TOOLBAR_EDGE_MARGIN, y: TOOLBAR_EDGE_MARGIN },
    "top-right": { x: right, y: TOOLBAR_EDGE_MARGIN },
    "bottom-right": { x: right, y: bottom },
    "bottom-left": { x: TOOLBAR_EDGE_MARGIN, y: bottom },
  };
}

/* -----------------------------------------------------------------------------
   Collapsed state. The toolbar overlays the canvas, so it can be folded down to
   just its handle when it is in the way of the screen being reviewed.
   -------------------------------------------------------------------------- */

const COLLAPSED_STORAGE_KEY = "exechq.toolbar-collapsed";

const collapsedListeners = new Set<() => void>();
let collapsedCache: boolean | null = null;

export function getToolbarCollapsed(): boolean {
  if (collapsedCache === null) {
    try {
      collapsedCache = window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true";
    } catch {
      collapsedCache = false;
    }
  }
  return collapsedCache;
}

export function getServerToolbarCollapsed(): boolean {
  return false;
}

export function subscribeToToolbarCollapsed(listener: () => void): () => void {
  collapsedListeners.add(listener);
  return () => {
    collapsedListeners.delete(listener);
  };
}

export function setToolbarCollapsed(next: boolean): void {
  collapsedCache = next;
  try {
    window.localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of collapsedListeners) listener();
}
