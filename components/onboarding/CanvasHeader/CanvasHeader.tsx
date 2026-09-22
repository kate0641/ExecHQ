"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";

export interface CanvasHeaderProps {
  /** Small label above the sentence. Names what the sentence is. */
  label: string;
  /** The interpreted direction. Null until the user has given one. */
  sentence: string | null;
  /** Shown in place of the sentence before there is one. */
  placeholder: string;
  /** Short facts gathered so far — the refinement answers, as they arrive. */
  meta?: readonly string[];
  onEdit?: () => void;
  editLabel?: string;
  /** Replaces the sentence with whatever is editing it. */
  children?: ReactNode;
  className?: string;
}

/**
 * The canvas's persistent header: the direction the whole page is about.
 *
 * It is present from the first paint, before there is anything to put in it.
 * That is deliberate — a page that shows its own title waiting to be filled is
 * the clearest possible statement of what the canvas is doing, and it gives the
 * document a stable h1 rather than growing one part way down the flow.
 *
 * It sticks to the top once the page is long enough to scroll, because every
 * decision below it is made in reference to this sentence. The sentence is
 * clamped rather than truncated with an ellipsis: an executive's direction is
 * the one thing here that should never be abbreviated by the interface, so it
 * stays readable in full when the header is not competing for room.
 *
 * Set in the serif. This is the page's subject and one of the few genuinely
 * editorial moments in the product.
 */
export function CanvasHeader({
  label,
  sentence,
  placeholder,
  meta,
  onEdit,
  editLabel = "Change",
  children,
  className,
}: CanvasHeaderProps) {
  return (
    <header className={["canvas-header", className].filter(Boolean).join(" ")}>
      <p className="canvas-header__label">{label}</p>

      {children ? (
        <div className="canvas-header__editor">{children}</div>
      ) : (
        <>
          <h1
            className={`canvas-header__sentence${sentence ? "" : " is-placeholder"}`}
          >
            {sentence ?? placeholder}
          </h1>

          {meta?.length ? (
            <ul className="canvas-header__meta">
              {meta.map((item) => (
                <li className="canvas-header__meta-item" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          {sentence && onEdit ? (
            <div className="canvas-header__actions">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Icon name="pencil" size={15} />
                {editLabel}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </header>
  );
}

export default CanvasHeader;
