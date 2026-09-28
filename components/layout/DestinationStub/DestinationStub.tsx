import { Badge } from "@/components/primitives/Badge";

export interface DestinationStubProps {
  /** The destination's own heading, as the product would title it. */
  heading: string;
  /** One line in product voice: what will be here. */
  body: string;
  /** The sprint that designs it, shown as a quiet reviewer's note. */
  sprint: number;
}

/**
 * A signed-in destination that a later sprint designs: Plan, Toolbox,
 * Briefing. It reads as a real, quiet page — a heading and one line — so the
 * navigation can be judged against destinations that look intentional,
 * without committing that sprint to any layout.
 *
 * Different from `PlaceholderState`, which is review scaffolding for a page
 * still being designed in the current sprint.
 */
export function DestinationStub({ heading, body, sprint }: DestinationStubProps) {
  return (
    <div className="destination-stub">
      <h1 className="destination-stub__heading">{heading}</h1>
      <p className="destination-stub__body">{body}</p>
      <Badge tone="sprint">Designed in Sprint {sprint}</Badge>
    </div>
  );
}

export default DestinationStub;
