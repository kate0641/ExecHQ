import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";

export interface SparkItem {
  id: string;
  /** Where it came from, in small capitals: "Podcast", "LinkedIn". */
  source: string;
  /** What moved, in a sentence that names the thing and stops. */
  text: string;
}

export interface SparkProps {
  items: readonly SparkItem[];
  /** Read out for the list: "Recent movement". */
  label: string;
  dismissLabel: string;
  /** The name of one dismiss button: "Dismiss: You’re on The Modern CMO." */
  dismissName: (text: string) => string;
  onDismiss: (id: string) => void;
  /** `note` is the quiet default. `celebrate` is a navy card with no mark:
   *  the first sentence is a yellow headline beside the source, the rest sits
   *  under it, and an × dismisses it (Homepage). */
  tone?: "note" | "celebrate";
  className?: string;
}

/** The first sentence, said as a headline, and the rest. The words are
 *  unchanged: "Great job!" and "You're on The Modern CMO, …". */
function splitFirst(text: string): [string, string] {
  const m = /^([^]+?[.!?])\s+(\S[^]*)$/.exec(text);
  return m ? [m[1], m[2]] : [text, ""];
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
export function Spark({ items, label, dismissLabel, dismissName, onDismiss, tone = "note", className }: SparkProps) {
  if (items.length === 0) return null;
  if (tone === "celebrate") {
    return (
      <ul className={["spark", "spark--celebrate", className].filter(Boolean).join(" ")} aria-label={label}>
        {items.map((item) => {
          const [headline, rest] = splitFirst(item.text);
          return (
            <li key={item.id} className="spark__note">
              <div className="spark__head">
                <p className="spark__headline">{headline}</p>
                <span className="spark__source">{item.source}</span>
                <Button variant="ghost" size="sm" className="spark__close" aria-label={dismissName(item.text)} onClick={() => onDismiss(item.id)}>
                  <Icon name="close" size={20} />
                </Button>
              </div>
              {rest ? <p className="spark__body">{rest}</p> : null}
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <ul className={["spark", className].filter(Boolean).join(" ")} aria-label={label}>
      {items.map((item) => (
        <li key={item.id} className="spark__note">
          <span className="spark__mark" aria-hidden="true">
            <Icon name="spark" size={18} />
          </span>
          <div className="spark__text">
            <span className="spark__source">{item.source}</span>
            <p>{item.text}</p>
          </div>
          <Button variant="ghost" size="sm" aria-label={dismissName(item.text)} onClick={() => onDismiss(item.id)}>
            {dismissLabel}
          </Button>
        </li>
      ))}
    </ul>
  );
}

export default Spark;
