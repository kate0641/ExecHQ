import { defineComponentStates } from "@/components/types";
import { Notice } from "./Notice";

export const noticeStates = defineComponentStates({
  name: "Notice",
  group: "feedback",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Explanation attached to what the user just did. The 'explain' tone exists because a rejected corporate email and an unrecognised invite code both deserve a reason in the product's voice rather than a bare validation error. Tone never carries meaning alone — every notice says its situation in words.",
  component: Notice,
  variants: [
    {
      label: "Info",
      props: { children: "Your draft is saved. You can come back to it." },
    },
    {
      label: "Explain — corporate email",
      props: {
        tone: "explain" as const,
        title: "That looks like a work address",
        children:
          "This account has to outlast your current job, and your employer must never be able to reach it. Use a personal address instead.",
      },
    },
    {
      label: "Explain — invite code",
      props: {
        tone: "explain" as const,
        title: "We do not recognise that code",
        children:
          "Check it against the invitation you were sent. You can also continue without one — the code only changes who pays, never what you get.",
      },
    },
    {
      label: "Problem — connection failed",
      props: {
        tone: "problem" as const,
        title: "That did not connect",
        children:
          "Nothing was sent and nothing was saved. You can try again, or carry on — your draft is unaffected.",
      },
    },
    {
      label: "Live region",
      description: "Announced politely when it appears after an action.",
      props: {
        tone: "info" as const,
        live: true,
        children: "Saved.",
      },
    },
  ],
});
