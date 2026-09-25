import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { GUIDE_C3 } from "@/mock/onboarding";
import { ReflectionReply } from "./ReflectionReply";

const time = GUIDE_C3.reflect.time;

export const reflectionReplyStates = defineComponentStates({
  name: "ReflectionReply",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "ExecHQ's answer to a reflection question as a pull quote, with a fact after it. Facts show as marked placeholders until they are sourced.",
  component: ReflectionReply,
  notApplicable: {
    ...NOT_INTERACTIVE,
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "With a fact to source",
      props: { from: GUIDE_C3.from, text: time.replies[0], fact: { ...time.fact, placeholder: true } },
    },
    { label: "Reply only", props: { from: GUIDE_C3.from, text: time.replies[2] } },
  ],
});
