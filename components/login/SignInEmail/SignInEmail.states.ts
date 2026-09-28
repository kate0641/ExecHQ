import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { MAYA } from "@/mock/account";
import { SIGN_IN_CODE } from "@/mock/login";
import { SignInEmail } from "./SignInEmail";

const noop = () => {};
const controls = "Its controls are a Button and two text buttons, which show their own states.";

export const signInEmailStates = defineComponentStates({
  name: "SignInEmail",
  group: "cards",
  status: "draft",
  flows: ["login"],
  description:
    "The sign-in email drawn as a message in a mail app: neutral subject, one button, and the code for another device.",
  component: SignInEmail,
  notApplicable: {
    ...FIXED_CONTENT,
    hover: controls,
    focus: controls,
    active: controls,
    disabled: controls,
    empty: "An email is only shown once it exists.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Default", props: { email: MAYA.email, code: SIGN_IN_CODE, onSignIn: noop, onBack: noop, onExpired: noop, headingId: "sie-1" } },
    {
      label: "A long address wraps",
      props: { email: "maya.alexandra.chen-whitfield@example.com", code: SIGN_IN_CODE, onSignIn: noop, onBack: noop, headingId: "sie-2" },
    },
  ],
});
