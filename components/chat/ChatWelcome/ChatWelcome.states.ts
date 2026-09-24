import { defineComponentStates } from "@/components/types";
import { CHAT_C2 } from "@/mock/onboarding";
import { ChatWelcome, IntroCard } from "./ChatWelcome";

export const chatWelcomeStates = defineComponentStates({
  name: "ChatWelcome",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Concept 2's open door: an empty chat that is itself the welcome, over a composer already asking for the email. Once the email is sent it folds into IntroCard.",
  component: ChatWelcome,
  variants: [
    {
      label: "Default",
      props: {
        title: CHAT_C2.welcomeTitle,
        quote: CHAT_C2.welcomeQuote,
        lede: CHAT_C2.welcomeLede,
        ask: CHAT_C2.welcomeAsk,
      },
    },
  ],
});

export const introCardStates = defineComponentStates({
  name: "IntroCard",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "What Concept 2's welcome folds into: a dark card at the top of the thread, the lasting record of who the user is talking to.",
  component: IntroCard,
  surface: "default",
  variants: [{ label: "Default", props: { quote: CHAT_C2.welcomeQuote } }],
});
