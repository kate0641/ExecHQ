"use client";

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
import { WelcomeSplit } from "@/components/onboarding/WelcomeSplit";
import { DetailPanel } from "@/components/profile/DetailPanel";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { conceptHref } from "@/lib/manifest";
import { SPONSOR_PERSON } from "@/mock/enterprise";
import {
  EMAIL_DELAY_MS,
  LOGIN_COPY as L,
  LOGIN_PROVISIONAL,
  RESEND_SECONDS,
  SIGN_IN_CODE,
  WRONG_CODE_TRIES,
  looksLikeEmail,
  type Provider,
  type ProviderAccount,
} from "@/mock/login";
import { PROFILE_COPY } from "@/mock/profile";
import { SPONSOR_LOGIN_COPY as C, SPONSOR_PROVIDER_ACCOUNTS } from "@/mock/sponsor-login";

/**
 * Sponsor login, Concept 1 — Work email (Kate, 2026-10-23).
 *
 * The participant Login's page for the enterprise side, on the desktop: the
 * dark panel with the wordmark, "Enterprise" and one serif line, beside a
 * white sheet with the sign-in. The same three ways in as participants, an
 * emailed code, Google or Apple, and the same rules: no password, and the
 * code screen says the same whether or not an account exists.
 *
 * What differs: it asks for the work email ExecHQ set up when the program
 * was agreed; there is no sign-up, since the ExecHQ contact sends the
 * invitation; help goes to that contact; and the privacy line says what a
 * sponsor sees, totals and never a participant, before they are even in.
 *
 * A successful sign-in goes to the dashboard (Enterprise Concept 1b). Nothing
 * is sent and nothing is stored.
 */

const DASHBOARD = conceptHref("enterprise", "concept-1b");
const HEADING = "sponsor-login-heading";

type Screen = "sign-in" | "inbox" | "expired" | "other-account";
type SheetId = Provider | "email" | "recovery" | "private" | null;

export function SponsorLoginConcept1() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("sign-in");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [keep, setKeep] = useState(true);
  const [sentTo, setSentTo] = useState<string>(SPONSOR_PERSON.email);
  const [code, setCode] = useState("");
  const [tries, setTries] = useState(0);
  const [wrong, setWrong] = useState(false);
  const codeBox = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(false);
  const [resendLeft, setResendLeft] = useState(0);
  const [sheet, setSheet] = useState<SheetId>(null);
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
      setMessage(L.inbox.arrived);
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
    router.push(DASHBOARD);
  }

  function chooseAccount(account: ProviderAccount) {
    if (account.matches) {
      signIn();
      return;
    }
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
        <DetailPanel heading={C.private.heading} headingId="sponsor-login-sheet-heading" onClose={() => setSheet(null)}>
          <ul className="sponsor-profile__points">
            {C.private.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="sponsor-profile__told">
            {C.private.told}
            <q>{PROFILE_COPY.organization.member(SPONSOR_PERSON.org)}</q>
          </p>
          <Button variant="secondary" fullWidth onClick={() => setSheet(null)}>
            {C.private.close}
          </Button>
        </DetailPanel>
      );
    }
    if (sheet === "recovery") {
      return (
        <DetailPanel heading={C.recovery.heading} headingId="sponsor-login-sheet-heading" onClose={() => setSheet(null)}>
          <p className="detail-panel__body">{C.recovery.body}</p>
          <Button variant="secondary" fullWidth onClick={() => setSheet(null)}>
            {C.recovery.close}
          </Button>
        </DetailPanel>
      );
    }
    if (sheet === "google" || sheet === "apple") {
      const name = L.signIn.providers[sheet];
      const provider = sheet;
      return (
        <DetailPanel heading={L.picker.heading(name)} headingId="sponsor-login-sheet-heading" lead={L.picker.lede(name)} onClose={() => setSheet(null)}>
          <AccountPicker accounts={SPONSOR_PROVIDER_ACCOUNTS[provider]} onChoose={chooseAccount} />
          <p className="login__small">{LOGIN_PROVISIONAL.marks}</p>
        </DetailPanel>
      );
    }
    return null;
  }

  const sheetLabel =
    sheet === "email"
      ? L.email.subject
      : sheet === "recovery"
        ? C.recovery.heading
        : sheet === "private"
          ? C.private.heading
          : sheet
            ? L.picker.heading(L.signIn.providers[sheet])
            : "";

  /** What the sheet shows for the current screen. */
  let view: { eyebrow?: string; title: string; description?: string; children: React.ReactNode; footer?: React.ReactNode };

  if (screen === "sign-in") {
    view = {
      eyebrow: C.signIn.kicker,
      title: C.signIn.heading,
      description: C.signIn.lede,
      children: (
        <>
          <form
            className="login__form"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              const value = email.trim();
              if (!value) setEmailError(L.signIn.empty);
              else if (!looksLikeEmail(value)) setEmailError(L.signIn.malformed);
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
          {/* No sign-up: ExecHQ sets the account up when the program is
              agreed, so this says who sends the way in. */}
          <p className="login__small login__new">{C.signIn.notSetUp}</p>
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
      title: L.inbox.heading,
      description: L.inbox.lede(sentTo),
      children: (
        <>
          <div ref={codeBox}>
            <CodeField
              label={L.inbox.codeLabel}
              value={code}
              error={wrong ? L.inbox.wrongCode : undefined}
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
              <span className="login__small">{L.inbox.resendIn(resendLeft)}</span>
            ) : (
              <button
                type="button"
                className="login__link"
                onClick={() => {
                  send(sentTo);
                  setMessage(L.inbox.resent);
                }}
              >
                {L.inbox.resend}
              </button>
            )}
            <button type="button" className="login__link" onClick={() => setScreen("sign-in")}>
              {L.inbox.otherAddress}
            </button>
          </p>
          <p className="login__small">
            {L.inbox.nothing}{" "}
            <button type="button" className="login__link" onClick={() => setSheet("recovery")}>
              {C.inbox.lostAccess}
            </button>
          </p>
        </>
      ),
    };
  } else if (screen === "expired") {
    view = {
      title: L.expired.heading,
      description: L.expired.lede(sentTo),
      children: (
        <div className="login__buttons">
          <Button fullWidth onClick={() => send(sentTo)}>
            {L.expired.send}
          </Button>
          <button type="button" className="login__link" onClick={() => setScreen("sign-in")}>
            {L.inbox.otherAddress}
          </button>
        </div>
      ),
    };
  } else {
    view = {
      title: C.otherAccount.heading,
      description: C.otherAccount.lede,
      children: (
        <div className="login__buttons">
          <Button fullWidth onClick={() => setScreen("sign-in")}>
            {C.otherAccount.back}
          </Button>
        </div>
      ),
    };
  }

  return (
    <>
      <WelcomeSplit
        quote={C.quote}
        suffix={C.suffix}
        eyebrow={view.eyebrow}
        title={view.title}
        description={view.description}
        headingId={HEADING}
        footer={view.footer}
        centred
        overlay={
          screen === "inbox" && arrived && sheet === null ? (
            <div className="login__notification">
              <MailNotification from={L.email.from} subject={L.email.subject} preview={L.email.preview} onOpen={() => setSheet("email")} />
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

export default SponsorLoginConcept1;
