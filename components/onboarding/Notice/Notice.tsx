import type { ElementType, ReactNode } from "react";

export type NoticeTone = "info" | "explain" | "problem";

export interface NoticeProps {
  title?: string;
  children: ReactNode;
  tone?: NoticeTone;
  /** Actions offered by the notice, e.g. retry and carry on. */
  actions?: ReactNode;
  /** Announces the notice politely when it appears as a result of an action.
   *  Leave off for notices that are present from the first paint. */
  live?: boolean;
  className?: string;
}

/**
 * A short block of explanation attached to whatever the user just did.
 *
 * `explain` is the one that matters in onboarding: a rejected corporate email
 * and an unrecognised invite code are both states where a bare validation error
 * would be the wrong answer. The user is told what happened and why the rule
 * exists, in the product's voice, not in the browser's.
 *
 * Tone never carries meaning on its own — every notice states its situation in
 * words, so the greyscale treatment is emphasis rather than information.
 */
export function Notice({
  title,
  children,
  tone = "info",
  actions,
  live = false,
  className,
}: NoticeProps) {
  // A live notice is an <output>: the platform's element for the result of
  // what the user just did, with polite-live semantics already on it. A notice
  // that is simply present from the first paint announces nothing and is a
  // plain container.
  const Wrapper: ElementType = live ? "output" : "div";

  return (
    <Wrapper
      className={["notice", `notice--${tone}`, className].filter(Boolean).join(" ")}
    >
      {title ? <p className="notice__title">{title}</p> : null}
      <div className="notice__body">{children}</div>
      {actions ? <div className="notice__actions">{actions}</div> : null}
    </Wrapper>
  );
}

export default Notice;
