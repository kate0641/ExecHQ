import type { ReactNode } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { ToolIllustration } from "@/components/playbook/ToolIllustration";
import { USE_CASE_COPY as C, type ToolUseCase as Tool } from "@/mock/playbook";

export interface UseCaseChoice {
  /** The tool's first question: "What are you pitching for?" */
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  /** A line under it: that her plan step chose it. */
  note?: string;
  /** With `choiceStarts`: the answer her plan step chose, marked in its row. */
  fromPlan?: string;
  /** What marks it, where it came from somewhere else: "From your pitch". */
  fromLabel?: string;
  /** She can pick several (Positioning Builder's introductions, CEO 19
   *  Oct): chips and the start button, even with `choiceStarts`. The value
   *  holds them one a line. */
  many?: boolean;
  /** A line under the question: "Pick any, or none." */
  hint?: string;
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
  /** Each answer to the first question is a row that starts the tool with
   *  it, so there is no separate button (Concept 1, 13 October). */
  choiceStarts?: boolean;
  /** The button's words. Defaults to the tool's own ("Start a pitch"). */
  startLabel?: string;
  onStart?: () => void;
  /** Leaves the start button out, where the page has its own (Concept 2's
   *  workspace, whose inputs write the draft). */
  noStart?: boolean;
  /** What this work goes with: a `List` of at most two rows, each with one
   *  small action. Shown under the button. */
  goesWith?: ReactNode;
  /** Leaves the drawing out (Playbook flow Concept 2, 13 October). */
  noPicture?: boolean;
  /** The name and what it makes only: no "when", no "You'll need", where
   *  the questions follow on the same page (Concept 2, 13 October). */
  brief?: boolean;
  headingLevel?: 1 | 2;
  headingId?: string;
  /** Catalogue only: shows the first answer row in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * The first screen of every tool (option C, chosen 11 October): the tool's
 * detailed drawing, then the decision. Its name set large, one sentence on
 * what it makes and one on when to use it, what she'll need, the step on her
 * plan it serves, the tool's first question beside the button, and one button
 * that says what it will make (or, with `choiceStarts`, the answers as rows
 * that each start it). Under it, what this work goes with: what it draws on or leads
 * to. No feature tour, and nothing that sells or ranks.
 *
 * Beside each other on web; the drawing on top on a phone and tablet.
 */
export function ToolUseCase({
  tool,
  planStep,
  source,
  choice,
  choiceStarts = false,
  startLabel,
  onStart,
  noStart = false,
  goesWith,
  noPicture = false,
  brief = false,
  headingLevel = 1,
  headingId,
  demo,
  className,
}: ToolUseCaseProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section className={["tool-use-case", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      {noPicture ? null : (
        <div className="tool-use-case__picture">
          <ToolIllustration tool={tool.kind} level="detailed" size={200} />
        </div>
      )}
      <div className="tool-use-case__decide">
        <Heading className="tool-use-case__name" id={headingId} tabIndex={-1}>
          {tool.name}
        </Heading>
        <p className="tool-use-case__makes">{tool.makes}</p>
        {brief ? null : (
          <>
            <p className="tool-use-case__when">{tool.when}</p>
            <p className="tool-use-case__needs">
              <span className="tool-use-case__needs-label">{C.needsHeading}: </span>
              {tool.needs.join(" · ")}
            </p>
          </>
        )}
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
        {choice?.many ? (
          <div className="tool-use-case__choice">
            <ChipGroup
              label={choice.label}
              note={choice.hint}
              options={choice.options}
              value={choice.value.split("\n").filter(Boolean)}
              max={choice.options.length}
              onChange={(next) => choice.onChange(choice.options.filter((o) => next.includes(o)).join("\n"))}
            />
            {choice.note ? <p className="tool-use-case__from-plan">{choice.note}</p> : null}
          </div>
        ) : choice && choiceStarts ? (
          <fieldset className="tool-use-case__choice tool-use-case__choice--starts">
            <legend className="tool-use-case__question">{choice.label}</legend>
            <ul className="tool-use-case__options">
              {choice.options.map((option, i) => (
                <li key={option}>
                  <button
                    type="button"
                    className={["tool-use-case__option", i === 0 && demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
                    onClick={() => {
                      choice.onChange(option);
                      onStart?.();
                    }}
                  >
                    <span className="tool-use-case__option-text">
                      {option}
                      {option === choice.value && option !== choice.fromPlan ? (
                        <span className="tool-use-case__option-plan">{C.yourAnswer}</span>
                      ) : option === choice.fromPlan ? (
                        <span className="tool-use-case__option-plan">{choice.fromLabel ?? C.fromPlanShort}</span>
                      ) : null}
                    </span>
                    <Icon name="chevron" size={16} className="tool-use-case__option-go" />
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>
        ) : choice ? (
          <div className="tool-use-case__choice">
            <ChipGroup label={choice.label} options={choice.options} value={choice.value ? [choice.value] : []} onChange={(next) => choice.onChange(next[0] ?? "")} />
            {choice.note ? <p className="tool-use-case__from-plan">{choice.note}</p> : null}
          </div>
        ) : null}
        {noStart || (choice && choiceStarts && !choice.many) ? null : (
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
