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
import {
  DEFAULT_TOOLBAR_POSITION,
  TOOLBAR_CORNERS,
  clampToolbarPosition,
  getServerToolbarPosition,
  getToolbarPosition,
  setToolbarPosition,
  subscribeToToolbarPosition,
  toolbarCornerPositions,
  type ToolbarCorner,
  type ToolbarPosition,
} from "@/lib/toolbar-position";

/** Pointer movement, in px, before a press counts as a drag rather than a click. */
const DRAG_THRESHOLD = 3;
/** How far an arrow key moves the toolbar, and how far with Shift held. */
const NUDGE = 8;
const NUDGE_LARGE = 32;

export interface DevToolbarProps {
  hubOpen: boolean;
  onToggleHub: () => void;
  hubTriggerRef: RefObject<HTMLButtonElement | null>;
}

/**
 * The prototype's own controls: viewport toggle and hub button.
 *
 * Floats above the canvas and can be moved out of the way. Dragging is not the
 * only way to move it (WCAG 2.2 SC 2.5.7): pressing the handle without dragging
 * cycles it through the four corners, which is a single-pointer alternative, and
 * the arrow keys nudge it while the handle has focus, which is the keyboard one.
 */
export function DevToolbar({ hubOpen, onToggleHub, hubTriggerRef }: DevToolbarProps) {
  const position = useSyncExternalStore(
    subscribeToToolbarPosition,
    getToolbarPosition,
    getServerToolbarPosition
  );
  const barRef = useRef<HTMLDivElement>(null);
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

  const measure = useCallback(() => {
    const rect = barRef.current?.getBoundingClientRect();
    return {
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

  // A window that shrinks must not leave the toolbar stranded off-screen.
  useEffect(() => {
    function handleResize() {
      const { size, windowSize } = measure();
      setToolbarPosition(
        clampToolbarPosition(getToolbarPosition(), size, windowSize),
        false
      );
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measure]);

  function moveToCorner(corner: ToolbarCorner) {
    const { size, windowSize } = measure();
    const positions = toolbarCornerPositions(size, windowSize);
    setToolbarPosition(positions[corner], true);
    const label = TOOLBAR_CORNERS.find((item) => item.key === corner)?.label;
    setAnnouncement(`Toolbar moved to the ${label}.`);
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

    const rect = barRef.current?.getBoundingClientRect();
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
    move(
      { x: event.clientX - drag.offsetX, y: event.clientY - drag.offsetY },
      false
    );
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (drag.moved) {
      move(getToolbarPosition(), true);
    } else if (drag.fromHandle) {
      // A press on the handle without a drag: the no-dragging way to move it.
      cycleCorner();
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    const step = event.shiftKey ? NUDGE_LARGE : NUDGE;
    const current = getToolbarPosition();

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
        setToolbarPosition(DEFAULT_TOOLBAR_POSITION, true);
        setAnnouncement("Toolbar returned to the top left.");
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  return (
    <div
      className="devtools"
      ref={barRef}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
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
        <span className="u-visually-hidden">Move the prototype toolbar</span>
      </button>
      <p className="u-visually-hidden" id={hintId}>
        Drag the toolbar to move it anywhere. Press this handle to cycle it
        through the four corners. With the handle focused, the arrow keys nudge
        it and Home returns it to the top left.
      </p>

      {/* Plain text, not a link: it doubles as the drag surface, and a press
          that starts on a link is ambiguous. The route home is "File hub" at the
          top of the hub panel. */}
      <p className="devtools__brand">ExecHQ prototype</p>

      <ViewportToggle />

      <button
        type="button"
        className="devtools__hub-button"
        ref={hubTriggerRef}
        onClick={onToggleHub}
        aria-expanded={hubOpen}
      >
        {hubOpen ? "Close hub" : "Open hub"}
      </button>

      <output className="u-visually-hidden">{announcement}</output>
    </div>
  );
}

export default DevToolbar;
