import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { Input } from "@/components/form/Input";
import { WELCOME } from "@/mock/onboarding";
import { WelcomeSplit } from "./WelcomeSplit";

const email = createElement(Input, { label: "Email", type: "email", required: true });

export const welcomeSplitStates = defineComponentStates({
  name: "WelcomeSplit",
  group: "layout",
  status: "draft",
  flows: ["onboarding", "login"],
  description:
    "The onboarding and login welcome: a dark panel with the wordmark and one serif line, over (mobile) or beside (tablet, web) a white sheet with the welcome, the email field and the action. The screen that uses it switches the device status bar to the inverse tone so the dark panel runs to the top edge.",
  component: WelcomeSplit,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "Fixed welcome copy: there is nothing to wait for.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Default",
      props: {
        quote: WELCOME.quote,
        title: WELCOME.heading,
        description: WELCOME.lede,
        children: email,
        primaryLabel: WELCOME.cta,
      },
    },
    {
      label: "Error",
      description: "An empty or malformed email shows its error under the field.",
      props: {
        quote: WELCOME.quote,
        title: WELCOME.heading,
        description: WELCOME.lede,
        children: createElement(Input, {
          label: "Email",
          type: "email",
          required: true,
          error: "We need an email address to create the account.",
        }),
        primaryLabel: WELCOME.cta,
      },
    },
    {
      label: "Compact, for later steps on the phone",
      description: "A short band with the wordmark alone, so the form stays in reach. Tablet and web keep the whole panel.",
      props: {
        quote: WELCOME.quote,
        eyebrow: "Welcome back",
        title: "Enter your code",
        description: "If there is an account for maya.chen@example.com, we have sent a 6-digit code.",
        children: email,
        compact: true,
      },
    },
    {
      label: "A footer instead of an action",
      description: "Login: the form carries its own actions, and a line about privacy sits at the foot.",
      props: {
        quote: WELCOME.quote,
        eyebrow: "Welcome back",
        title: "Log in to ExecHQ",
        description: WELCOME.lede,
        children: email,
        footer: "Private to you. Learn more",
      },
    },
    {
      label: "Empty",
      description: "No form: the welcome and the action alone.",
      props: {
        quote: WELCOME.quote,
        title: WELCOME.heading,
        primaryLabel: WELCOME.cta,
      },
    },
  ],
});
