"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { Checkbox } from "@/components/form/Checkbox";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { addDays, aheadPhrase, datePhrase, shortDate, whenPhrase } from "@/lib/loop";
import { OUTLET_COPY, SEND_STEPS_COPY as C, type Outlet, type PitchPart, type PitchType } from "@/mock/toolbox";

/** What a Copy button copies: a part of the draft, or the outlet's address. */
export type SendCopy = PitchPart | "address";

export interface SendStepsProps {
  /** Where she is pitching, as she named it. */
  name: string;
  type?: PitchType;
  /** The outlet's published page, when ExecHQ has it. */
  outlet?: Outlet;
  /** The day it is, ISO. */
  today: string;
  /** Words in the part the outlet limits, as the draft stands. */
  words?: number;
  /** Questions still open in the draft. */
  openQuestions?: number;
  /** The day she marked it sent, ISO: step 4 is done. */
  sentOn?: string;
  /** Where and to whom she says it went, once sent. */
  sentTo?: string;
  /** Days until ExecHQ asks what came of it. */
  checkBackDays?: number;
  /** Where a bio is made (Positioning Builder). */
  bioHref?: string;
  /** Copies a part of the draft, or the address. */
  onCopy?: (what: SendCopy, label: string) => void;
  /** Catalogue only: the steps she has ticked, 1 to 3. */
  ticked?: readonly number[];
  className?: string;
}

/**
 * Send it in four steps (Kate, 14 Oct): under the pitch draft, filled in from
 * Where it goes. Check it against their ask, get the extras, send it their
 * way with a Copy on each part, then mark it sent. Ticks are hers alone;
 * nothing is sent from here.
 */
export function SendSteps({
  name,
  type,
  outlet,
  today,
  words,
  openQuestions = 0,
  sentOn,
  sentTo = "",
  checkBackDays = 5,
  bioHref,
  onCopy,
  ticked = [],
  className,
}: SendStepsProps) {
  const headingId = useId();
  const [done, setDone] = useState<readonly number[]>(ticked);
  const toggle = (n: number) => setDone((d) => (d.includes(n) ? d.filter((x) => x !== n) : [...d, n]));
  const kind: PitchType = outlet?.type ?? type ?? "Speaking";
  const ask = outlet?.ask;
  const contact = outlet?.contact;
  const internal = Boolean(outlet?.internal);
  const partName = (part: PitchPart) => OUTLET_COPY.partNames[part];

  const copyButton = (what: SendCopy, label: string) => (
    <Button variant="ghost" size="sm" onClick={() => onCopy?.(what, label)}>
      <Icon name="copy" size={14} />
      {C.send.copy}
      <span className="u-visually-hidden"> {label.toLowerCase()}</span>
    </Button>
  );

  // 1. Check it against what they asked for.
  const check: ReactNode[] = [];
  if (internal) check.push(C.check.internal);
  else if (ask) {
    check.push(C.check.wants(outlet?.name ?? name, ask.format, ask.topics));
    if (ask.limit && words !== undefined) check.push(C.check.words(partName(ask.limit.part), words, ask.limit.words));
  } else check.push(C.check.noAsk(OUTLET_COPY.watchFor[kind]));
  if (openQuestions > 0) check.push(C.check.open(openQuestions));

  // 2. The extras they ask for; a bio links to where it is made.
  const extras =
    internal ? (
      <p className="send-steps__text">{C.extras.none}</p>
    ) : ask ? (
      ask.include.length ? (
        <ul className="send-steps__extras">
          {ask.include.map((item) => (
            <li key={item}>
              {item}
              {bioHref && /\bbio\b/i.test(item) ? (
                <>
                  {" · "}
                  <Link href={bioHref} className="link">
                    {C.extras.makeBio}
                  </Link>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="send-steps__text">{C.extras.none}</p>
      )
    ) : (
      <p className="send-steps__text">{C.extras.unknown}</p>
    );

  // 3. The route, spelled out, with a Copy on each part.
  let send: ReactNode;
  if (contact?.route === "form") {
    send = (
      <>
        <p className="send-steps__text">{C.send.form(contact.label, contact.url)}</p>
        <ul className="send-steps__copies">
          {contact.fields.map((f) => (
            <li key={f.field}>
              <span>{C.send.field(f.field, partName(f.part))}</span>
              {copyButton(f.part, partName(f.part))}
            </li>
          ))}
        </ul>
      </>
    );
  } else {
    const parts: PitchPart[] = internal ? ["pitch"] : ["subjects", "pitch"];
    send = (
      <>
        <p className="send-steps__text">
          {internal ? C.send.internal : contact?.route === "email" ? C.send.email(contact.person ? C.send.emailTo(contact.person, contact.address) : contact.address) : C.send.noContact}
        </p>
        <ul className="send-steps__copies">
          {contact?.route === "email" ? (
            <li>
              <span>{contact.address}</span>
              {copyButton("address", C.send.address)}
            </li>
          ) : null}
          {parts.map((part) => (
            <li key={part}>
              <span>{partName(part)}</span>
              {copyButton(part, partName(part))}
            </li>
          ))}
        </ul>
      </>
    );
  }
  const closes = ask?.deadline && ask.deadline >= today ? <p className="send-steps__text send-steps__deadline">{C.send.before(shortDate(ask.deadline))}</p> : null;

  // 4. Mark it sent, and the follow-up.
  const sent = sentOn
    ? C.sent.after(whenPhrase(sentOn, today), sentTo, datePhrase(addDays(sentOn, 7)), aheadPhrase(addDays(sentOn, checkBackDays), today))
    : C.sent.before(checkBackDays);

  const steps: { title: string; body: ReactNode }[] = [
    { title: C.check.title, body: check.map((line, i) => <p key={i} className="send-steps__text">{line}</p>) },
    { title: C.extras.title, body: extras },
    { title: C.send.title, body: <>{send}{closes}</> },
    { title: C.sent.title, body: <p className="send-steps__text">{sent}</p> },
  ];

  return (
    <section className={["send-steps", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <h2 className="send-steps__heading" id={headingId}>
        {C.heading}
      </h2>
      <p className="send-steps__note">{C.note}</p>
      <ol className="send-steps__list">
        {steps.map((step, i) => {
          const n = i + 1;
          const isDone = n === 4 ? Boolean(sentOn) : done.includes(n);
          return (
            <li key={step.title} className={["send-steps__step", isDone ? "is-done" : null].filter(Boolean).join(" ")}>
              {/* Steps 1 to 3 are hers to tick. Step 4 ticks itself when she
                  marks it sent, so it is a mark, not a control. */}
              {n === 4 ? (
                <p className="send-steps__mark">
                  <span className="send-steps__box" aria-hidden="true">
                    {isDone ? <Icon name="check" size={14} /> : null}
                  </span>
                  <span>
                    {`${n}. ${step.title}`}
                    {isDone ? <span className="u-visually-hidden"> {C.sent.done}</span> : null}
                  </span>
                </p>
              ) : (
                <Checkbox label={`${n}. ${step.title}`} checked={isDone} onChange={() => toggle(n)} className="send-steps__tick" />
              )}
              <div className="send-steps__body">{step.body}</div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default SendSteps;
