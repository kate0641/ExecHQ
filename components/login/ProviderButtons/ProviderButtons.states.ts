import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { ProviderButtons } from "./ProviderButtons";

const onChoose = () => {};

export const providerButtonsStates = defineComponentStates({
  name: "ProviderButtons",
  group: "form controls",
  status: "draft",
  flows: ["login"],
  description:
    "Google and Apple as full-width buttons in the traditional form: the mark and “Continue with …”. Each follows its maker's guidelines exactly: Google's dark theme in Google Sans with the standard four-colour G, and Apple's black style with the logo and words in white (designer, 2026-10-13).",
  component: ProviderButtons,
  notApplicable: {
    loading: "The provider's own window takes over; this page has nothing to wait for.",
    error: "A provider that fails reports it in its own window.",
    empty: "Always offers both.",
    filled: NOT_AN_INPUT,
    "long text": "Provider names are fixed and short.",
  },
  variants: [
    { label: "Default", props: { onChoose } },
    { label: "Hover", props: { onChoose, buttonClassName: "is-hover" } },
    { label: "Focus", props: { onChoose, buttonClassName: "is-focus" } },
    { label: "Active", props: { onChoose, buttonClassName: "is-active" } },
    { label: "Disabled", props: { onChoose, disabled: true } },
  ],
});
