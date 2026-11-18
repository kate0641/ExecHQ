import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { PROVIDER_ACCOUNTS } from "@/mock/login";
import { AccountPicker } from "./AccountPicker";

const onChoose = () => {};

export const accountPickerStates = defineComponentStates({
  name: "AccountPicker",
  group: "cards",
  status: "draft",
  flows: ["login"],
  description:
    "Stands in for Google's or Apple's own account picker, offering the matching account beside a work account or a hidden relay address.",
  component: AccountPicker,
  notApplicable: {
    loading: "A stand-in: the provider's own window does any waiting.",
    error: "A stand-in: the provider's own window reports its errors.",
    disabled: "Every account it offers can be chosen.",
    empty: "A provider always offers at least one account.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Google — default", props: { accounts: PROVIDER_ACCOUNTS.google, onChoose } },
    { label: "Apple", props: { accounts: PROVIDER_ACCOUNTS.apple, onChoose } },
    { label: "Hover", props: { accounts: PROVIDER_ACCOUNTS.google, onChoose, accountClassName: "is-hover" } },
    { label: "Focus", props: { accounts: PROVIDER_ACCOUNTS.google, onChoose, accountClassName: "is-focus" } },
    { label: "Active", props: { accounts: PROVIDER_ACCOUNTS.google, onChoose, accountClassName: "is-active" } },
    {
      label: "A long address wraps",
      props: {
        accounts: [{ id: "long", title: "maya.alexandra.chen-whitfield@northwind-holdings.example", detail: "Work: her employer’s Google account", matches: false }],
        onChoose,
      },
    },
  ],
});
