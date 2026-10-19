import { Icon } from "@/components/primitives/Icon";
import { daysBetween, shortDate } from "@/lib/loop";
import { OUTLET_COPY as C, OUTLET_STALE_DAYS, type Outlet, type PitchType } from "@/mock/playbook";

export interface OutletCardProps {
  /** Where she is pitching, as she named it. */
  name: string;
  /** What she is pitching for, when no outlet is matched. */
  type?: PitchType;
  /** The outlet's published page, when ExecHQ has it. */
  outlet?: Outlet;
  /** The day it is, ISO: an old check or a passed deadline says so. */
  today: string;
  className?: string;
}

/** A gap only she can fill, marked as the draft marks its questions. */
function Question({ children }: { children: string }) {
  return (
    <p className="outlet-card__question">
      <span className="u-visually-hidden">Question for you: </span>
      {children}
    </p>
  );
}

/**
 * Where a pitch goes (Kate, 14 Oct): the outlet, what it asks for, who
 * receives it and how to send it, above the draft, so she reads where it is
 * going before what it says. Every fact is from the outlet's own page, linked
 * and dated; what the page doesn't say is a question to her, never a guess.
 */
export function OutletCard({ name, type, outlet, today, className }: OutletCardProps) {
  const classes = ["outlet-card", className].filter(Boolean).join(" ");
  const kind: PitchType = outlet?.type ?? type ?? "Speaking";
  const watch = C.watchFor[kind];
  const ask = outlet?.ask;
  const contact = outlet?.contact;
  const closed = Boolean(ask?.deadline && ask.deadline < today);
  const stale = Boolean(outlet?.source && daysBetween(outlet.source.checked, today) > OUTLET_STALE_DAYS);

  return (
    <aside className={classes} aria-label={C.heading}>
      <p className="outlet-card__eyebrow">
        <Icon name="send" size={14} />
        {C.heading}
      </p>
      <p className="outlet-card__name">{outlet?.name ?? name}</p>
      {outlet?.part ? <p className="outlet-card__part">{`${outlet.part} · ${outlet.type}`}</p> : null}

      {outlet?.internal ? (
        <>
          <p className="outlet-card__text">{C.internal.note}</p>
          {C.internal.questions.map((q) => (
            <Question key={q}>{q}</Question>
          ))}
        </>
      ) : (
        <>
          {closed || stale ? (
            <p className="outlet-card__notice">
              <Icon name="clock" size={14} />
              {closed ? C.closed : C.stale}
            </p>
          ) : null}

          <section className="outlet-card__part-block" aria-label={C.ask}>
            <p className="outlet-card__label">{C.ask}</p>
            {ask ? (
              <dl className="outlet-card__facts">
                <dt>{C.topics}</dt>
                <dd>{ask.topics}</dd>
                <dt>{C.format}</dt>
                <dd>{ask.format}</dd>
                {ask.limit ? (
                  <>
                    <dt>{C.length}</dt>
                    <dd>{C.limit(ask.limit.words, C.partNames[ask.limit.part])}</dd>
                  </>
                ) : null}
                <dt>{C.include}</dt>
                <dd>{ask.include.join("; ")}</dd>
                {ask.deadline || ask.cycle ? (
                  <>
                    <dt>{C.when}</dt>
                    <dd>{ask.deadline ? C.deadline(shortDate(ask.deadline)) : ask.cycle}</dd>
                  </>
                ) : null}
              </dl>
            ) : (
              <p className="outlet-card__text">{outlet ? C.noAsk(watch) : C.notFound(watch)}</p>
            )}
          </section>

          <section className="outlet-card__part-block" aria-label={C.contact}>
            <p className="outlet-card__label">{C.contact}</p>
            {contact?.route === "email" ? (
              <p className="outlet-card__text">
                {contact.person ? (
                  <>
                    {contact.person}
                    <br />
                  </>
                ) : null}
                <span className="outlet-card__address">{contact.address}</span>
              </p>
            ) : contact?.route === "form" ? (
              <p className="outlet-card__text">
                {contact.label}
                <br />
                <span className="outlet-card__address">{contact.url}</span>
              </p>
            ) : (
              <Question>{C.noContact[kind]}</Question>
            )}
          </section>

          <section className="outlet-card__part-block" aria-label={C.how}>
            <p className="outlet-card__label">{C.how}</p>
            {contact?.route === "form" ? (
              <>
                <p className="outlet-card__text">{C.howForm(contact.label)}</p>
                <ul className="outlet-card__fields">
                  {contact.fields.map((f) => (
                    <li key={f.field}>{C.fieldGets(f.field, C.partNames[f.part])}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="outlet-card__text">{contact ? C.howEmail : C.howDefault}</p>
            )}
          </section>

          {outlet?.source ? (
            <p className="outlet-card__source">
              <Icon name="link" size={14} />
              <span>
                <span className="outlet-card__address">{outlet.source.url}</span>
                {` · ${C.checked(shortDate(outlet.source.checked))}`}
              </span>
            </p>
          ) : null}
        </>
      )}
    </aside>
  );
}

export default OutletCard;
