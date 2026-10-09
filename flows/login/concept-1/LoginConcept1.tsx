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
import { WelcomeSplit } from "@/components/onboarding/WelcomeSplit";
import { DetailPanel } from "@/components/profile/DetailPanel";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { useStatusBarTone } from "@/lib/device-tone";
import { conceptHref } from "@/lib/manifest";
import { MAYA } from "@/mock/account";
import {
  EMAIL_DELAY_MS,
  LOGIN_COPY as C,
  LOGIN_PROVISIONAL,
  PROVIDER_ACCOUNTS,
  RESEND_SECONDS,
  SIGN_IN_CODE,
  WRONG_CODE_TRIES,
  looksLikeEmail,
  type Provider,
  type ProviderAccount,
} from "@/mock/login";

/**
 * Login Concept 1 — Open page.
 *
 * The same welcome as the start of onboarding: a dark panel with the wordmark,
 * one serif line and the promise, over (phone) or beside (tablet, web) a
 * white sheet with the sign-in. A pill field, a full-width Log in button, and
 * Google and Apple as traditional buttons, with a line about privacy at the
 * foot. After the first screen the panel shrinks to a band on the phone, so
 * the form stays in reach.
 *
 * A one-time code is the main way in. After it is asked for, the email
 * arrives as the phone's notification; tapping it opens the drawn email in a
 * sheet, as another app would, and the six digits in it are typed here.
 * Google and Apple open a stand-in for their own pickers, which offer
 * the case that matters: a work account, or a hidden relay address.
 *
 * A successful sign-in goes to Home (Homepage Concept 1), in whatever Loop
 * state the dock has picked. Nothing is sent and nothing is stored.
 */

const HOME = conceptHref("homepage", "concept-4");
const ONBOARDING = conceptHref("onboarding", "concept-3");
const HEADING = "login-heading";

type Screen = "sign-in" | "inbox" | "expired" | "other-account";
type SheetId = Provider | "email" | "recovery" | "private" | null;

export function LoginConcept1() {
  const router = useRouter();

  // The dark panel runs to the top edge of the phone.
  useStatusBarTone("inverse");
  const [screen, setScreen] = useState<Screen>("sign-in");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [keep, setKeep] = useState(true);
  const [sentTo, setSentTo] = useState(MAYA.email);
  const [code, setCode] = useState("");
  // Wrong tries on this code, and whether the last one was wrong.
  const [tries, setTries] = useState(0);
  const [wrong, setWrong] = useState(false);
  const codeBox = useRef<HTMLDivElement>(null);
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
    setTries(0);
    setWrong(false);
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

  /** What the sheet shows for the current screen. */
  let view: { eyebrow?: string; title: string; description?: string; children: React.ReactNode; footer?: React.ReactNode };

  if (screen === "sign-in") {
    view = {
      eyebrow: C.signIn.kicker,
      title: C.signIn.heading,
      description: C.welcome.lede,
      children: (
        <>
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
        </>
      ),
      footer: (
        <p className="login__privacy">
          <Icon name="lock" size={16} />
          <span>{C.private.line}</span>{" "}
          <button type="button" className="login__link" onClick={() => setSheet("private")}>
            {C.private.more}
          </button>
        </p>
      ),
    };
  } else if (screen === "inbox") {
    view = {
      title: C.inbox.heading,
      description: C.inbox.lede(sentTo),
      children: (
        <>
          <div ref={codeBox}>
            <CodeField
              label={C.inbox.codeLabel}
              value={code}
              error={wrong ? C.inbox.wrongCode : undefined}
              onChange={(value) => {
                setCode(value);
                setWrong(false);
                if (value.length < 6) return;
                if (value === SIGN_IN_CODE) {
                  signIn();
                  return;
                }
                // Wrong: the boxes clear and the cursor goes back to the
                // first. After five, the code stops working.
                const used = tries + 1;
                setTries(used);
                setCode("");
                if (used >= WRONG_CODE_TRIES) {
                  setScreen("expired");
                  return;
                }
                setWrong(true);
                codeBox.current?.querySelector("input")?.focus();
              }}
            />
          </div>
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
          <p className="login__small">
            {C.inbox.nothing}{" "}
            <button type="button" className="login__link" onClick={() => setSheet("recovery")}>
              {C.inbox.lostAccess}
            </button>
          </p>
        </>
      ),
    };
  } else if (screen === "expired") {
    view = {
      title: C.expired.heading,
      description: C.expired.lede(sentTo),
      children: (
        <div className="login__buttons">
          <Button fullWidth onClick={() => send(sentTo)}>
            {C.expired.send}
          </Button>
          <button type="button" className="login__link" onClick={() => setScreen("sign-in")}>
            {C.inbox.otherAddress}
          </button>
        </div>
      ),
    };
  } else {
    view = {
      title: C.otherAccount.heading,
      description: C.otherAccount.lede,
      children: (
        <>
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
      ),
    };
  }

  return (
    <>
      <WelcomeSplit
        quote={C.welcome.quote}
        eyebrow={view.eyebrow}
        title={view.title}
        description={view.description}
        headingId={HEADING}
        footer={view.footer}
        compact={screen !== "sign-in"}
        stackOnTablet
        centred
        overlay={
          screen === "inbox" && arrived && sheet === null ? (
            <div className="login__notification">
              <MailNotification
                from={C.email.from}
                subject={C.email.subject}
                preview={C.email.preview}
                onOpen={() => setSheet("email")}
              />
            </div>
          ) : null
        }
      >
        <div className="login">{view.children}</div>
      </WelcomeSplit>
      <Sheet open={sheet !== null} onClose={() => setSheet(null)} label={sheetLabel} className={sheet === "email" ? "sheet--tall" : undefined}>
        {sheetContent()}
      </Sheet>
      <output className="u-visually-hidden">{message}</output>
    </>
  );
}

export default LoginConcept1;
