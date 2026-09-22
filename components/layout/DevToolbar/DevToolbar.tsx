"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { ViewportToggle } from "@/components/hub/ViewportToggle";
import { Icon } from "@/components/primitives/Icon";
import {
  clampToolbarPosition,
  getServerToolbarCollapsed,
  getServerToolbarPosition,
  getToolbarCollapsed,
  getToolbarPosition,
  setToolbarCollapsed,
  setToolbarPosition,
  subscribeToToolbarCollapsed,
  subscribeToToolbarPosition,
  toolbarCornerPositions,
  TOOLBAR_CORNERS,
  type ToolbarCorner,
  type ToolbarPosition,
} from "@/lib/toolbar";

/** Pointer movement, in px, before a press counts as a drag rather than a click. */
const DRAG_THRESHOLD = 3;
/** How far an arrow key moves the dock, and how far with Shift held. */
const NUDGE = 8;
const NUDGE_LARGE = 32;

export interface DevToolbarProps {
  hubOpen: boolean;
  onToggleHub: () => void;
  hubTriggerRef: RefObject<HTMLButtonElement | null>;
}

/**
 * The prototype's controls: the viewport toggle and the hub button, stacked in
 * a dock against the edge of the window.
 *
 * A dock rather than a bar because everything on the canvas — headings,
 * navigation, body copy — runs horizontally, so a tall narrow strip covers far
 * less of what is being reviewed than a wide one does. It defaults to the right
 * edge, since the hub panel opens from the left.
 *
 * It can be dragged anywhere and collapsed to just its handle. Dragging is never
 * the only way to move it (WCAG 2.2 SC 2.5.7): pressing the handle without
 * dragging cycles it through the four corners, and with the handle focused the
 * arrow keys nudge it and Home returns it to the anchored default.
 */
export function DevToolbar({ hubOpen, onToggleHub, hubTriggerRef }: DevToolbarProps) {
  const position = useSyncExternalStore(
    subscribeToToolbarPosition,
    getToolbarPosition,
    getServerToolbarPosition
  );
  const collapsed = useSyncExternalStore(
    subscribeToToolbarCollapsed,
    getToolbarCollapsed,
    getServerToolbarCollapsed
  );
  const dockRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    moved: boolean;
    fromHandle: boolean;
  } | null>(null);
  const cornerRef = useRef(0);
  const [announcement, setAnnouncement] = useState("");
  const hintId = useId();
  const contentId = useId();

  const measure = useCallback(() => {
    const rect = dockRef.current?.getBoundingClientRect();
    return {
      rect,
      size: { width: rect?.width ?? 0, height: rect?.height ?? 0 },
      windowSize: { width: window.innerWidth, height: window.innerHeight },
    };
  }, []);

  const move = useCallback(
    (next: ToolbarPosition, persist = true) => {
      const { size, windowSize } = measure();
      setToolbarPosition(clampToolbarPosition(next, size, windowSize), persist);
    },
    [measure]
  );

  /** Where the dock is right now, whether it is anchored or placed. */
  const currentPosition = useCallback((): ToolbarPosition => {
    const stored = getToolbarPosition();
    if (stored) return stored;
    const { rect } = measure();
    return { x: rect?.left ?? 0, y: rect?.top ?? 0 };
  }, [measure]);

  // A window that shrinks, or a collapse that changes the dock's size, must not
  // leave it stranded off-screen. An anchored dock is placed by CSS and looks
  // after itself.
  useEffect(() => {
    function reclamp() {
      const stored = getToolbarPosition();
      if (!stored) return;
      const { size, windowSize } = measure();
      setToolbarPosition(clampToolbarPosition(stored, size, windowSize), false);
    }
    reclamp();
    window.addEventListener("resize", reclamp);
    return () => window.removeEventListener("resize", reclamp);
  }, [collapsed, measure]);

  function moveToCorner(corner: ToolbarCorner) {
    const { size, windowSize } = measure();
    setToolbarPosition(toolbarCornerPositions(size, windowSize)[corner], true);
    const label = TOOLBAR_CORNERS.find((item) => item.key === corner)?.label;
    setAnnouncement(`Dock moved to the ${label}.`);
  }

  function cycleCorner() {
    cornerRef.current = (cornerRef.current + 1) % TOOLBAR_CORNERS.length;
    moveToCorner(TOOLBAR_CORNERS[cornerRef.current].key);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const target = event.target as Element;
    const fromHandle = Boolean(target.closest(".devtools__handle"));
    // A press that lands on the viewport toggle or the hub button belongs to
    // that control, not to the drag.
    if (!fromHandle && target.closest("button, a, input, label, select")) return;

    const rect = dockRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      fromHandle,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    if (
      !drag.moved &&
      Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) <
        DRAG_THRESHOLD
    ) {
      return;
    }
    drag.moved = true;
    move({ x: event.clientX - drag.offsetX, y: event.clientY - drag.offsetY }, false);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (drag.moved) {
      move(currentPosition(), true);
    } else if (drag.fromHandle) {
      // A press on the handle without a drag: the no-dragging way to move it.
      cycleCorner();
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    const step = event.shiftKey ? NUDGE_LARGE : NUDGE;
    const current = currentPosition();

    switch (event.key) {
      case "ArrowUp":
        move({ ...current, y: current.y - step });
        break;
      case "ArrowDown":
        move({ ...current, y: current.y + step });
        break;
      case "ArrowLeft":
        move({ ...current, x: current.x - step });
        break;
      case "ArrowRight":
        move({ ...current, x: current.x + step });
        break;
      case "Home":
        cornerRef.current = 0;
        setToolbarPosition(null, true);
        setAnnouncement("Dock returned to the right edge.");
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  const classes = [
    "devtools",
    position ? null : "is-anchored",
    collapsed ? "is-collapsed" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      ref={dockRef}
      style={position ? { left: `${position.x}px`, top: `${position.y}px` } : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <button
        type="button"
        className="devtools__handle"
        aria-describedby={hintId}
        onKeyDown={handleKeyDown}
      >
        <span className="devtools__grip" aria-hidden="true" />
        <span className="u-visually-hidden">Move the prototype dock</span>
      </button>
      <p className="u-visually-hidden" id={hintId}>
        Drag the dock to move it anywhere. Press this handle to cycle it through
        the four corners. With the handle focused, the arrow keys nudge it and
        Home returns it to the right edge.
      </p>

      {/* `hidden` rather than CSS, so the controls leave the tab order when the
          dock is folded away. */}
      <div className="devtools__content" id={contentId} hidden={collapsed}>
        <ViewportToggle />

        <span className="devtools__rule" aria-hidden="true" />

        <button
          type="button"
          className="devtools__hub-button"
          ref={hubTriggerRef}
          onClick={onToggleHub}
          aria-expanded={hubOpen}
          title={hubOpen ? "Close the hub" : "Open the hub"}
        >
          <Icon name="hub" size={17} />
          <span className="u-visually-hidden">
            {hubOpen ? "Close the prototype hub" : "Open the prototype hub"}
          </span>
        </button>
      </div>

      <button
        type="button"
        className="devtools__collapse"
        aria-expanded={!collapsed}
        aria-controls={contentId}
        title={collapsed ? "Expand the dock" : "Collapse the dock"}
        onClick={() => setToolbarCollapsed(!collapsed)}
      >
        <Icon name="chevron" size={14} />
        <span className="u-visually-hidden">
          {collapsed ? "Expand the prototype dock" : "Collapse the prototype dock"}
        </span>
      </button>

      <output className="u-visually-hidden">{announcement}</output>
    </div>
  );
}

export default DevToolbar;
