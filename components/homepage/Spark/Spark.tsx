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
  className?: string;
}

/**
 * A small note on the homepage when something she can see has moved: a
 * podcast she added, her LinkedIn numbers arriving. It is the platform
 * noticing, not cheering: it names the thing and stops, with no exclamation
 * marks, streaks or praise, and never says her work caused it.
 *
 * It sits inline at the top of the signals section, never blocks anything,
 * and goes for good when dismissed. With nothing to note it is not there.
 */
export function Spark({ items, label, dismissLabel, dismissName, onDismiss, className }: SparkProps) {
  if (items.length === 0) return null;
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
