import { Badge } from "@/components/primitives/Badge";

export interface PlaceholderStateProps {
  /** Sprint the screen is designed in. Drives the headline. */
  sprint: number;
  title: string;
  description?: string;
  /** Path to the interaction spec, shown so it is easy to find. */
  specPath?: string;
}

/**
 * The "Not yet built — Sprint N" state that fills the content area of every
 * placeholder page. This is the whole of a placeholder page's content: nothing
 * else is designed until that sprint.
 */
export function PlaceholderState({
  sprint,
  title,
  description,
  specPath,
}: PlaceholderStateProps) {
  return (
    <div className="placeholder">
      <Badge tone="sprint">Sprint {sprint}</Badge>
      <p className="placeholder__headline">Not yet built — Sprint {sprint}</p>
      <p className="placeholder__title t-editorial">{title}</p>
      {description ? <p className="placeholder__description">{description}</p> : null}
      {specPath ? (
        <p className="placeholder__spec">
          Interaction spec: <code>{specPath}</code>
        </p>
      ) : null}
    </div>
  );
}

export default PlaceholderState;
