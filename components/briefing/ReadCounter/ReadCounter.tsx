import { Icon } from "@/components/primitives/Icon";
import { BRIEFING_COPY } from "@/mock/briefing";

const C = BRIEFING_COPY.oneAtATime;

export interface ReadCounterProps {
  /** 1-based. */
  at: number;
  of: number;
  /** Back to the read before. Left out on the first. */
  onBack?: () => void;
  /** Straight to the end of the set, so Next is never the only way through. */
  onToEnd?: () => void;
  /** Catalogue only: shows Back focused. */
  demo?: "focus";
  className?: string;
}

/**
 * Concept B's place in the day's set: "1 of 3" at the top, a quiet Back
 * beside it and a way straight to the end. The count says the set is
 * finished at three; nothing here suggests more.
 */
export function ReadCounter({ at, of, onBack, onToEnd, demo, className }: ReadCounterProps) {
  return (
    <div className={["read-counter", className].filter(Boolean).join(" ")}>
      {onBack ? (
        <button type="button" className={["read-counter__back", demo ? `is-${demo}` : null].filter(Boolean).join(" ")} onClick={onBack}>
          <Icon name="chevron" size={16} className="read-counter__back-icon" />
          {C.back}
        </button>
      ) : (
        <span className="read-counter__spacer" />
      )}
      <span className="read-counter__count" aria-live="polite">
        {C.count(at, of)}
      </span>
      {onToEnd ? (
        <button type="button" className="read-counter__end" onClick={onToEnd}>
          {C.toEnd}
        </button>
      ) : (
        <span className="read-counter__spacer" />
      )}
    </div>
  );
}

export default ReadCounter;
