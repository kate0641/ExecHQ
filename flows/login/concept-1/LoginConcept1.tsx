"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/form/Checkbox";
import { CodeField } from "@/components/form/CodeField";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { AccountPicker } from "@/components/login/AccountPicker";
import { MailNotification } from "@/components/login/MailNotification";
import { ProviderButtons } from "@/components/login/ProviderButtons";
import { SignInEmail } from "@/components/login/SignInEmail";
import { Notice } from "@/components/onboarding/Notice";
import { DetailPanel } from "@/components/profile/DetailPanel";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { conceptHref } from "@/lib/manifest";
import { MAYA } from "@/mock/account";
import {
  EMAIL_DELAY_MS,
  LOGIN_COPY as C,
  LOGIN_PROVISIONAL,
  PROVIDER_ACCOUNTS,
  RESEND_SECONDS,
  SIGN_IN_CODE,
  looksLikeEmail,
  type Provider,
  type ProviderAccount,
} from "@/mock/login";

/**
 * Login Concept 1 — Open page.
 *
 * White and quiet: a light blue glow in the corner, a pill field, a full-width Log in button, and Google and Apple as traditional buttons.
 *
 * The emailed link is the main way in. After it is asked for, the email
 * arrives as the phone's notification; tapping it opens the drawn email in a
 * sheet, as another app would. Its button signs in, or its code can be typed
 * here. Google and Apple open a stand-in for their own pickers, which offer
 * the case that matters: a work account, or a hidden relay address.
 *
 * A successful sign-in goes to Home (Homepage Concept 1), in whatever Loop
 * state the dock has picked. Nothing is sent and nothing is stored.
 */

const HOME = conceptHref("homepage", "concept-1");
const ONBOARDING = conceptHref("onboarding", "concept-1");
const HEADING = "login-heading";

type Screen = "sign-in" | "inbox" | "expired" | "other-account";
type SheetId = Provider | "email" | "recovery" | "private" | null;

export function LoginConcept1() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("sign-in");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [keep, setKeep] = useState(true);
  const [sentTo, setSentTo] = useState(MAYA.email);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string>();
  const [arrived, setArrived] = useState(false);
  const [resendLeft, setResendLeft] = useState(0);
  const [sheet, setSheet] = useState<SheetId>(null);
  const [otherWhy, setOtherWhy] = useState<Provider>("google");
  const [message, setMessage] = useState("");
  const moved = useRef(false);

  // Each screen change moves focus to its heading. Not on first paint.
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    document.getElementById(HEADING)?.focus();
  }, [screen]);

  // The email arrives a moment after it is asked for.
  useEffect(() => {
    if (screen !== "inbox" || arrived) return;
    const timer = window.setTimeout(() => {
      setArrived(true);
      setMessage(C.inbox.arrived);
    }, EMAIL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [screen, arrived, sentTo]);

  // The resend waits a little, so it cannot be pressed over and over.
  useEffect(() => {
    if (resendLeft <= 0) return;
    const timer = window.setTimeout(() => setResendLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendLeft]);

  function send(to: string) {
    setSentTo(to);
    setCode("");
    setCodeError(undefined);
    setArrived(false);
    setResendLeft(RESEND_SECONDS);
    setSheet(null);
    setScreen("inbox");
  }

  function signIn() {
    setSheet(null);
    setMessage(C.signedIn);
    router.push(HOME);
  }

  function chooseAccount(provider: Provider, account: ProviderAccount) {
    if (account.matches) {
      signIn();
      return;
    }
    setOtherWhy(provider);
    setSheet(null);
    setScreen("other-account");
  }

  function sheetContent() {
    if (sheet === "email") {
      return (
        <SignInEmail
          email={sentTo}
          code={SIGN_IN_CODE}
          onSignIn={signIn}
          onBack={() => setSheet(null)}
          onExpired={() => {
            setSheet(null);
            setScreen("expired");
          }}
        />
      );
    }
    if (sheet === "private") {
      return (
        <DetailPanel heading={C.private.heading} headingId="login-sheet-heading" onClose={() => setSheet(null)}>
          <ul className="login__never">
            {C.private.rows.map((row) => (
              <li key={row.who}>
                <Icon name="close" size={16} />
                <span>
                  <b>{row.who}</b>
                  {row.body}
                </span>
              </li>
            ))}
          </ul>
          <Button variant="secondary" fullWidth onClick={() => setSheet(null)}>
            {C.private.close}
          </Button>
        </DetailPanel>
      );
    }
    if (sheet === "recovery") {
      return (
        <DetailPanel heading={C.recovery.heading} headingId="login-sheet-heading" onClose={() => setSheet(null)}>
          <p className="detail-panel__body">{C.recovery.body}</p>
          <Notice tone="explain" label={LOGIN_PROVISIONAL.label}>
            {LOGIN_PROVISIONAL.recovery}
          </Notice>
          <Button variant="secondary" fullWidth onClick={() => setSheet(null)}>
            {C.recovery.close}
          </Button>
        </DetailPanel>
      );
    }
    if (sheet === "google" || sheet === "apple") {
      const name = C.signIn.providers[sheet];
      const provider = sheet;
      return (
        <DetailPanel
          heading={C.picker.heading(name)}
          headingId="login-sheet-heading"
          lead={C.picker.lede(name)}
          onClose={() => setSheet(null)}
        >
          <AccountPicker accounts={PROVIDER_ACCOUNTS[provider]} onChoose={(a) => chooseAccount(provider, a)} />
          <p className="login__small">{LOGIN_PROVISIONAL.marks}</p>
        </DetailPanel>
      );
    }
    return null;
  }

  const sheetLabel =
    sheet === "email"
      ? C.email.subject
      : sheet === "recovery"
        ? C.recovery.heading
        : sheet === "private"
          ? C.private.heading
          : sheet
            ? C.picker.heading(C.signIn.providers[sheet])
            : "";

  let body: React.ReactNode;

  if (screen === "sign-in") {
    body = (
      <>
        <div className="login__centre">
          <div className="login__intro">
            <p className="login__kicker">{C.signIn.kicker}</p>
            <h1 className="login__heading" id={HEADING} tabIndex={-1}>
              {C.signIn.heading}
            </h1>
          </div>
          <form
            className="login__form"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              const value = email.trim();
              if (!value) setEmailError(C.signIn.empty);
              else if (!looksLikeEmail(value)) setEmailError(C.signIn.malformed);
              else send(value);
            }}
          >
            <Input
              variant="pill"
              label={C.signIn.emailLabel}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              error={emailError}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailError(undefined);
              }}
            />
            <Checkbox label={C.signIn.keep} checked={keep} onChange={(event) => setKeep(event.target.checked)} />
            <Button type="submit" fullWidth>
              {C.signIn.send}
            </Button>
          </form>
          <p className="login__or">{C.signIn.or}</p>
          <ProviderButtons onChoose={(p) => setSheet(p)} />
          <p className="login__small login__new">
            {C.signIn.newHere}{" "}
            <Link className="login__link" href={ONBOARDING}>
              {C.signIn.start}
            </Link>
          </p>
        </div>
        <p className="login__privacy">
          <Icon name="lock" size={16} />
          <span>{C.private.line}</span>{" "}
          <button type="button" className="login__link" onClick={() => setSheet("private")}>
            {C.private.more}
          </button>
        </p>
      </>
    );
  } else if (screen === "inbox") {
    body = (
      <>
        <div className="login__intro">
          <h1 className="login__heading" id={HEADING} tabIndex={-1}>
            {C.inbox.heading}
          </h1>
          <p className="login__lede">{C.inbox.lede(sentTo)}</p>
        </div>
        <CodeField
          label={C.inbox.codeLabel}
          value={code}
          error={codeError}
          onChange={(value) => {
            setCode(value);
            setCodeError(undefined);
            if (value.length === 6) {
              if (value === SIGN_IN_CODE) signIn();
              else setCodeError(C.inbox.wrongCode);
            }
          }}
        />
        <p className="login__actions">
          {resendLeft > 0 ? (
            <span className="login__small">{C.inbox.resendIn(resendLeft)}</span>
          ) : (
            <button
              type="button"
              className="login__link"
              onClick={() => {
                send(sentTo);
                setMessage(C.inbox.resent);
              }}
            >
              {C.inbox.resend}
            </button>
          )}
          <button type="button" className="login__link" onClick={() => setScreen("sign-in")}>
            {C.inbox.otherAddress}
          </button>
        </p>
        <div className="login__foot">
          <p className="login__small">
            {C.inbox.nothing}{" "}
            <button type="button" className="login__link" onClick={() => setSheet("recovery")}>
              {C.inbox.lostAccess}
            </button>
          </p>
        </div>
      </>
    );
  } else if (screen === "expired") {
    body = (
      <>
        <div className="login__intro">
          <h1 className="login__heading" id={HEADING} tabIndex={-1}>
            {C.expired.heading}
          </h1>
          <p className="login__lede">{C.expired.lede(sentTo)}</p>
        </div>
        <div className="login__buttons">
          <Button fullWidth onClick={() => send(sentTo)}>
            {C.expired.send}
          </Button>
          <button type="button" className="login__link" onClick={() => setScreen("sign-in")}>
            {C.inbox.otherAddress}
          </button>
        </div>
      </>
    );
  } else {
    body = (
      <>
        <div className="login__intro">
          <h1 className="login__heading" id={HEADING} tabIndex={-1}>
            {C.otherAccount.heading}
          </h1>
          <p className="login__lede">{C.otherAccount.lede}</p>
        </div>
        <Notice tone="explain" label={LOGIN_PROVISIONAL.label}>
          {otherWhy === "apple" ? LOGIN_PROVISIONAL.relay : LOGIN_PROVISIONAL.work}
        </Notice>
        <div className="login__buttons">
          <Button fullWidth onClick={() => setScreen("sign-in")}>
            {C.otherAccount.back}
          </Button>
          <Button variant="secondary" fullWidth onClick={() => router.push(ONBOARDING)}>
            {C.otherAccount.fresh}
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="login">
      <span className="login__glow" aria-hidden="true" />
      {screen === "inbox" && arrived && sheet === null ? (
        <div className="login__notification">
          <MailNotification
            from={C.email.from}
            subject={C.email.subject}
            preview={C.email.preview}
            onOpen={() => setSheet("email")}
          />
        </div>
      ) : null}
      <div className={["login__body", screen === "inbox" ? "login__body--inbox" : null, screen === "sign-in" ? "login__body--centred" : null].filter(Boolean).join(" ")}>{body}</div>
      <Sheet open={sheet !== null} onClose={() => setSheet(null)} label={sheetLabel} className={sheet === "email" ? "sheet--tall" : undefined}>
        {sheetContent()}
      </Sheet>
      <output className="u-visually-hidden">{message}</output>
    </div>
  );
}

export default LoginConcept1;
