import type { ReactNode } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { USE_CASE_COPY as C, type ToolUseCase as Tool } from "@/mock/toolbox";

export interface ToolUseCaseProps {
  tool: Tool;
  /** The action step it serves, when she came from one or it is on her plan. */
  planStep?: string;
  /** Where she came from, when it carries something: today's Briefing read
   *  (`SourceLabel`). */
  source?: ReactNode;
  onStart?: () => void;
  /** Leaves the start button out, where the page has its own (a guided
   *  flow's footer, say). */
  noStart?: boolean;
  headingLevel?: 1 | 2;
  headingId?: string;
  className?: string;
}

/**
 * The first screen of every tool: one sentence on what it makes and one on
 * when to use it, what she will need, and the step on her plan it serves.
 * No feature tour. The same screen for all four tools: only the words differ.
 */
export function ToolUseCase({ tool, planStep, source, onStart, noStart = false, headingLevel = 1, headingId, className }: ToolUseCaseProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section className={["tool-use-case", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <Heading className="tool-use-case__name" id={headingId} tabIndex={-1}>
        {tool.name}
      </Heading>
      <p className="tool-use-case__makes">{tool.makes}</p>
      <p className="tool-use-case__when">{tool.when}</p>
      {source}
      <div className="tool-use-case__facts">
        <div className="tool-use-case__fact">
          <span className="tool-use-case__fact-label">{C.needsHeading}</span>
          <ul className="tool-use-case__needs">
            {tool.needs.map((need) => (
              <li key={need}>{need}</li>
            ))}
          </ul>
        </div>
        {planStep ? (
          <div className="tool-use-case__fact">
            <span className="tool-use-case__fact-label">{C.planHeading}</span>
            <span className="tool-use-case__plan">
              <Icon name="compass" size={16} />
              {planStep}
            </span>
          </div>
        ) : null}
      </div>
      {noStart ? null : (
        <Button fullWidth onClick={onStart}>
          {tool.start}
        </Button>
      )}
    </section>
  );
}

export default ToolUseCase;
