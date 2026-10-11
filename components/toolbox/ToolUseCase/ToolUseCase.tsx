import type { ReactNode } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { ToolIllustration } from "@/components/toolbox/ToolIllustration";
import { USE_CASE_COPY as C, type ToolUseCase as Tool } from "@/mock/toolbox";

export interface UseCaseChoice {
  /** The tool's first question: "What are you pitching for?" */
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  /** A line under it: that her plan step chose it. */
  note?: string;
}

export interface ToolUseCaseProps {
  tool: Tool;
  /** The action step it serves, when she came from one or it is on her plan. */
  planStep?: string;
  /** Where she came from, when it carries something: today's Briefing read
   *  (`SourceLabel`), or her statement from onboarding. */
  source?: ReactNode;
  /** The tool's first question, answered here so the flow does not ask it. */
  choice?: UseCaseChoice;
  /** The button's words. Defaults to the tool's own ("Start a pitch"). */
  startLabel?: string;
  onStart?: () => void;
  /** Leaves the start button out, where the page has its own (Concept 2's
   *  workspace, whose inputs write the draft). */
  noStart?: boolean;
  /** What this work goes with: a `List` of at most two rows, each with one
   *  small action. Shown under the button. */
  goesWith?: ReactNode;
  headingLevel?: 1 | 2;
  headingId?: string;
  className?: string;
}

/**
 * The first screen of every tool (option C, chosen 11 October): the tool's
 * detailed drawing, then the decision. Its name set large, one sentence on
 * what it makes and one on when to use it, what she'll need, the step on her
 * plan it serves, the tool's first question beside the button, and one button
 * that says what it will make. Under it, what this work goes with: what it draws on or leads
 * to. No feature tour, and nothing that sells or ranks.
 *
 * Beside each other on web; the drawing on top on a phone and tablet.
 */
export function ToolUseCase({
  tool,
  planStep,
  source,
  choice,
  startLabel,
  onStart,
  noStart = false,
  goesWith,
  headingLevel = 1,
  headingId,
  className,
}: ToolUseCaseProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section className={["tool-use-case", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="tool-use-case__picture">
        <ToolIllustration tool={tool.kind} level="detailed" size={200} />
      </div>
      <div className="tool-use-case__decide">
        <Heading className="tool-use-case__name" id={headingId} tabIndex={-1}>
          {tool.name}
        </Heading>
        <p className="tool-use-case__makes">{tool.makes}</p>
        <p className="tool-use-case__when">{tool.when}</p>
        <p className="tool-use-case__needs">
          <span className="tool-use-case__needs-label">{C.needsHeading}: </span>
          {tool.needs.join(" · ")}
        </p>
        {source}
        {planStep ? (
          <p className="tool-use-case__plan">
            <Icon name="compass" size={16} />
            <span>
              <span className="tool-use-case__plan-label">{C.planHeading}</span>
              {planStep}
            </span>
          </p>
        ) : null}
        {choice ? (
          <div className="tool-use-case__choice">
            <ChipGroup label={choice.label} options={choice.options} value={choice.value ? [choice.value] : []} onChange={(next) => choice.onChange(next[0] ?? "")} />
            {choice.note ? <p className="tool-use-case__from-plan">{choice.note}</p> : null}
          </div>
        ) : null}
        {noStart ? null : (
          <Button fullWidth onClick={onStart}>
            {startLabel ?? tool.start}
          </Button>
        )}
        {goesWith ? (
          <section className="tool-use-case__goes" aria-label={C.goesWith}>
            <h2 className="tool-use-case__goes-heading">{C.goesWith}</h2>
            {goesWith}
          </section>
        ) : null}
      </div>
    </section>
  );
}

export default ToolUseCase;
