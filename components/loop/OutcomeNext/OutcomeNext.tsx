"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { NEXT_STEP_COPY as C, type AfterAnswer } from "@/mock/toolbox";

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
  /** One thing more, asked before the offers. */
  ask?: AfterAnswer["ask"];
  /** She has answered it (or skipped it). */
  asked?: boolean;
  onAsk?: (value: string) => void;
  offers: readonly OutcomeNextOffer[];
  /** A line under the offers: "ExecHQ will ask how it went on Friday." */
  note?: string;
  /** Set it all aside: the card folds to one line. */
  onNotNow?: () => void;
  folded?: boolean;
  headingId?: string;
  /** Catalogue only: opens with this typed into the question. */
  typed?: string;
  /** Catalogue only: opens as if she pressed on with nothing typed. */
  startError?: boolean;
  className?: string;
}

/**
 * What comes after she says how something went (the Situation Brief first,
 * 13 October). Her answer is said back; ExecHQ may ask one thing more ("What's
 * the next step?"); then it offers what to do next, each with one action: the
 * Plan step her words point to (added only when she says so), the follow-up
 * email to send, a new brief, or her Plan. The first offer leads. "Not now"
 * folds the card to one line, and nothing is lost.
 */
export function OutcomeNext({
  readback,
  ask,
  asked = false,
  onAsk,
  offers,
  note,
  onNotNow,
  folded = false,
  headingId = "outcome-next",
  typed,
  startError = false,
  className,
}: OutcomeNextProps) {
  const [value, setValue] = useState(typed ?? "");
  const [tried, setTried] = useState(startError);

  if (folded) {
    return (
      <p className={["outcome-next__logged", className].filter(Boolean).join(" ")}>
        <Icon name="check" size={16} />
        {C.logged(readback)}
      </p>
    );
  }

  const asking = Boolean(ask && !asked);
  const submit = () => {
    if (!ask?.optional && !value.trim()) {
      setTried(true);
      return;
    }
    onAsk?.(value.trim());
  };

  return (
    <section className={["outcome-next", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <h2 className="outcome-next__heading" id={headingId} tabIndex={-1}>
        {C.heading}
      </h2>
      <p className="outcome-next__readback">
        <Icon name="check" size={16} />
        {readback}
      </p>

      {asking && ask ? (
        <form
          className="outcome-next__ask"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <Input
            label={ask.label}
            hint={ask.hint}
            placeholder={ask.placeholder}
            type={ask.kind === "date" ? "date" : undefined}
            value={value}
            error={tried && !value.trim() ? C.answerFirst : undefined}
            onChange={(event) => {
              setTried(false);
              setValue(event.target.value);
            }}
          />
          <div className="outcome-next__row">
            <Button type="submit" size="sm">
              {ask.submit}
            </Button>
            {ask.optional ? (
              <button type="button" className="link link--standalone" onClick={() => onAsk?.("")}>
                {C.skip}
              </button>
            ) : null}
          </div>
        </form>
      ) : (
        <>
          {offers.length ? (
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
          ) : null}
          {note ? <p className="outcome-next__note">{note}</p> : null}
          {offers.length && onNotNow ? (
            <button type="button" className="link link--standalone outcome-next__not-now" onClick={onNotNow}>
              {C.notNow}
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}

export default OutcomeNext;
