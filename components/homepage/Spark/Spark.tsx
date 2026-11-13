import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";

export interface SparkItem {
  id: string;
  /** Where it came from, in small capitals: "Podcast", "LinkedIn". */
  source: string;
  /** What moved, in a sentence that names the thing and stops. */
  text: string;
  /** A second, quieter button beside the dismiss: "Hide it". */
  actionLabel?: string;
}

export interface SparkProps {
  items: readonly SparkItem[];
  /** Read out for the list: "Recent movement". */
  label: string;
  dismissLabel: string;
  /** The name of one dismiss button: "Dismiss: You’re on The Modern CMO." */
  dismissName: (text: string) => string;
  onDismiss: (id: string) => void;
  /** What the item's `actionLabel` button does. */
  onAction?: (id: string) => void;
  /** Dismiss with an × rather than the word (Home's Signal Picture strip). */
  closeIcon?: boolean;
  /** A word before the source, set off by a dot: "Great job! · Press". */
  kicker?: string;
  className?: string;
}

/**
 * A small note on the homepage when something she can see has moved: a
 * podcast she added, her LinkedIn numbers arriving. It names the thing
 * and says so warmly (the no-praise rule was dropped on 2026-10-02), but
 * never says her work caused it, and there are no streaks.
 *
 * It sits inline at the top of the signals section, never blocks anything,
 * and goes for good when dismissed. With nothing to note it is not there.
 */
export function Spark({ items, label, dismissLabel, dismissName, onDismiss, onAction, closeIcon, kicker, className }: SparkProps) {
  if (items.length === 0) return null;
  return (
    <ul className={["spark", className].filter(Boolean).join(" ")} aria-label={label}>
      {items.map((item) => (
        <li key={item.id} className="spark__note">
          <span className="spark__mark" aria-hidden="true">
            <Icon name="spark" size={20} />
          </span>
          <div className="spark__text">
            <span className="spark__source">
              {kicker ? (
                <>
                  {kicker}
                  <span aria-hidden="true"> · </span>
                  {/* A pause for screen readers, unless the word ends in its own. */}
                  <span className="u-visually-hidden">{/[.!?]$/.test(kicker) ? " " : ", "}</span>
                </>
              ) : null}
              {item.source}
            </span>
            <p>{item.text}</p>
          </div>
          <div className="spark__actions">
            {item.actionLabel && onAction ? (
              <Button variant="ghost" size="sm" aria-label={`${item.actionLabel}: ${item.text}`} onClick={() => onAction(item.id)}>
                {item.actionLabel}
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="sm"
              className={closeIcon ? "spark__close" : undefined}
              aria-label={dismissName(item.text)}
              onClick={() => onDismiss(item.id)}
            >
              {closeIcon ? <Icon name="close" size={16} /> : dismissLabel}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Spark;
