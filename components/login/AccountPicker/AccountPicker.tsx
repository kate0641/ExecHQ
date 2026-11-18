import type { ProviderAccount } from "@/mock/login";

export interface AccountPickerProps {
  accounts: ProviderAccount[];
  onChoose: (account: ProviderAccount) => void;
  /** Catalogue only: `is-hover`, `is-focus`, `is-active` on each account. */
  accountClassName?: string;
}

/**
 * A stand-in for the account picker Google or Apple would show. It offers
 * the case that matters for ExecHQ beside the easy one: a work account, or a
 * hidden relay address, neither of which matches her ExecHQ account.
 */
export function AccountPicker({ accounts, onChoose, accountClassName }: AccountPickerProps) {
  return (
    <ul className="account-picker">
      {accounts.map((account) => (
        <li key={account.id}>
          <button
            type="button"
            className={["account-picker__account", accountClassName].filter(Boolean).join(" ")}
            onClick={() => onChoose(account)}
          >
            <span className="account-picker__avatar" aria-hidden="true">
              {account.title.charAt(0).toUpperCase()}
            </span>
            <span className="account-picker__text">
              <span className="account-picker__title">{account.title}</span>
              <span className="account-picker__detail">{account.detail}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default AccountPicker;
