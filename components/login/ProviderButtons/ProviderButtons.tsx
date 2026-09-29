import { LOGIN_COPY, type Provider } from "@/mock/login";

export interface ProviderButtonsProps {
  onChoose: (provider: Provider) => void;
  /** Catalogue only: `is-hover`, `is-focus`, `is-active` on each button. */
  buttonClassName?: string;
  disabled?: boolean;
}

const PROVIDERS: Provider[] = ["google", "apple"];

/** Drawn stand-ins for the providers' marks, in one colour: the greyscale
 *  rule allows no brand colours yet. The real buttons follow Google's and
 *  Apple's own brand rules. */
function Mark({ provider }: { provider: Provider }) {
  if (provider === "google") {
    return (
      <svg className="provider-mark" viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615zM9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18zM3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332zM9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        />
      </svg>
    );
  }
  return (
    <svg className="provider-mark" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.8zM14.2 5.8c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.3z"
      />
    </svg>
  );
}

/**
 * Signing in through Google or Apple, the way each shows it elsewhere: a
 * full-width button with the mark and "Continue with …". Both are light
 * with a hairline border, so “Log in” stays the one loud button.
 */
export function ProviderButtons({ onChoose, buttonClassName, disabled }: ProviderButtonsProps) {
  const names = LOGIN_COPY.signIn.providers;
  return (
    <div className="provider-buttons">
      {PROVIDERS.map((p) => (
        <button
          key={p}
          type="button"
          className={["provider-button", `provider-button--${p}`, buttonClassName].filter(Boolean).join(" ")}
          onClick={() => onChoose(p)}
          disabled={disabled}
        >
          <Mark provider={p} />
          <span>{LOGIN_COPY.signIn.providerLabel(names[p])}</span>
        </button>
      ))}
    </div>
  );
}

export default ProviderButtons;
