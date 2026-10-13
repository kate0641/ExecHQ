import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { NEXT_STEP_COPY as C } from "@/mock/toolbox";

export interface OutcomeNextOffer {
  id: string;
  /** A quiet line above the title: "Next on your plan". */
  eyebrow?: string;
  title: string;
  body?: ReactNode;
  /** The one thing to do. A link, or a button. */
  action: { label: string; href?: string; onClick?: () => void };
  /** Once done: says so in place of the action, with an optional link on. */
  done?: { said: string; link?: { label: string; href: string } };
}

export interface OutcomeNextProps {
  /** What she answered, said back. */
  readback: string;
  /** The next step, first, and at most one more. Never empty. */
  offers: readonly OutcomeNextOffer[];
  /** A line under them: "ExecHQ will ask how it went on Friday." */
  note?: string;
  /** Set it aside: the card folds to one line. */
  onNotNow?: () => void;
  folded?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * What comes after she says how something went (the Situation Brief first,
 * 13 October). Her one-tap answer is all the feedback there is: ExecHQ asks
 * nothing more. It says her answer back and gives the next step whatever it
 * was, built from her answer, the work's own goal and her Plan, each with one
 * action: a Plan step (added only when she says so), the follow-up email, a
 * new brief, or what's next on her Plan. "Not now" folds it to one line.
 */
export function OutcomeNext({ readback, offers, note, onNotNow, folded = false, headingId = "outcome-next", className }: OutcomeNextProps) {
  if (folded) {
    return (
      <p className={["outcome-next__logged", className].filter(Boolean).join(" ")}>
        <Icon name="check" size={16} />
        {C.logged(readback)}
      </p>
    );
  }

  return (
    <section className={["outcome-next", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <p className="outcome-next__readback">
        <Icon name="check" size={16} />
        {readback}
      </p>
      <h2 className="outcome-next__heading" id={headingId} tabIndex={-1}>
        {C.heading}
      </h2>
      <ul className="outcome-next__offers">
        {offers.map((offer, i) => (
          <li key={offer.id} className="outcome-next__offer">
            {offer.eyebrow ? <span className="outcome-next__eyebrow">{offer.eyebrow}</span> : null}
            <span className="outcome-next__title">{offer.title}</span>
            {offer.body ? <span className="outcome-next__body">{offer.body}</span> : null}
            {offer.done ? (
              <span className="outcome-next__done">
                <Icon name="check" size={16} />
                <output>{offer.done.said}</output>
                {offer.done.link ? (
                  <Link href={offer.done.link.href} className="link link--standalone">
                    {offer.done.link.label}
                  </Link>
                ) : null}
              </span>
            ) : offer.action.href ? (
              <Link
                href={offer.action.href}
                className={`btn ${i === 0 ? "btn--primary" : "btn--secondary"} btn--sm outcome-next__action`}
                onClick={offer.action.onClick}
              >
                {offer.action.label}
              </Link>
            ) : (
              <Button size="sm" variant={i === 0 ? "primary" : "secondary"} className="outcome-next__action" onClick={offer.action.onClick}>
                {offer.action.label}
              </Button>
            )}
          </li>
        ))}
      </ul>
      {note ? <p className="outcome-next__note">{note}</p> : null}
      {onNotNow ? (
        <button type="button" className="link link--standalone outcome-next__not-now" onClick={onNotNow}>
          {C.notNow}
        </button>
      ) : null}
    </section>
  );
}

export default OutcomeNext;
