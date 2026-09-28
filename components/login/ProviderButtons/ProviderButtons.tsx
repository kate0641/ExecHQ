import { LOGIN_COPY, type Provider } from "@/mock/login";

export interface ProviderButtonsProps {
  onChoose: (provider: Provider) => void;
  /** Catalogue only: `is-hover`, `is-focus`, `is-active` on each disc. */
  buttonClassName?: string;
  disabled?: boolean;
}

const PROVIDERS: Provider[] = ["google", "apple"];

/** Drawn stand-ins for the providers' marks. The real buttons follow
 *  Google's and Apple's own brand rules. */
function Mark({ provider }: { provider: Provider }) {
  if (provider === "google") {
    return (
      <span className="provider-mark provider-mark--google" aria-hidden="true">
        G
      </span>
    );
  }
  return (
    <svg className="provider-mark provider-mark--apple" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.8zM14.2 5.8c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.3z"
      />
    </svg>
  );
}

/**
 * Signing in through Google or Apple: round buttons with the provider named
 * underneath, so neither rests on its mark alone. Each is announced as
 * "Continue with …", which includes the visible name.
 */
export function ProviderButtons({ onChoose, buttonClassName, disabled }: ProviderButtonsProps) {
  const names = LOGIN_COPY.signIn.providers;
  return (
    <div className="provider-buttons">
      {PROVIDERS.map((p) => (
        <button
          key={p}
          type="button"
          className={["provider-button", buttonClassName].filter(Boolean).join(" ")}
          aria-label={LOGIN_COPY.signIn.providerLabel(names[p])}
          onClick={() => onChoose(p)}
          disabled={disabled}
        >
          <span className="provider-button__disc">
            <Mark provider={p} />
          </span>
          <span className="provider-button__name" aria-hidden="true">
            {names[p]}
          </span>
        </button>
      ))}
    </div>
  );
}

export default ProviderButtons;
