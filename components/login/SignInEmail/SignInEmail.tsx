import { Notice } from "@/components/onboarding/Notice";
import { Icon } from "@/components/primitives/Icon";
import { LOGIN_COPY } from "@/mock/login";

export interface SignInEmailProps {
  email: string;
  code: string;
  onBack: () => void;
  /** Opens the code again once it has expired. */
  onExpired?: () => void;
  headingId?: string;
}

const C = LOGIN_COPY.email;

/**
 * The login email itself, drawn as a message in a mail app: a neutral
 * subject and the one-time code, large enough to read across a table. There
 * is no button: she types the code into ExecHQ. Nothing in it says anything
 * about the person's career.
 */
export function SignInEmail({ email, code, onBack, onExpired, headingId = "sign-in-email" }: SignInEmailProps) {
  const spaced = `${code.slice(0, 3)} ${code.slice(3)}`;
  return (
    <article className="sign-in-email" aria-labelledby={headingId}>
      <div className="sign-in-email__bar">
        <button type="button" className="sign-in-email__back" onClick={onBack}>
          <Icon name="chevron" size={16} className="sign-in-email__back-icon" />
          {C.back}
        </button>
        <span className="sign-in-email__app">{C.app}</span>
      </div>
      <header className="sign-in-email__head">
        <h1 className="sign-in-email__subject" id={headingId} tabIndex={-1}>
          {C.subject}
        </h1>
        <p className="sign-in-email__from">
          <span className="sign-in-email__avatar" aria-hidden="true">
            HQ
          </span>
          <span>
            <b>{C.from}</b>
            <br />
            {C.to(email)}
          </span>
        </p>
      </header>
      <div className="sign-in-email__body">
        <p>{C.preview}</p>
        <p className="sign-in-email__small">{C.codeLead}</p>
        <p className="sign-in-email__code">
          <span aria-hidden="true">{spaced}</span>
          <span className="u-visually-hidden">{code.split("").join(" ")}</span>
        </p>
        <p className="sign-in-email__small">{C.footer}</p>
        {onExpired ? (
          <button type="button" className="sign-in-email__later" onClick={onExpired}>
            {C.tryExpired}
          </button>
        ) : null}
      </div>
      <Notice label={C.noteLabel} className="sign-in-email__note">
        {C.note}
      </Notice>
    </article>
  );
}

export default SignInEmail;
