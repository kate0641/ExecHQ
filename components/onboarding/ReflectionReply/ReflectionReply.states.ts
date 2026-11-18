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
    "ExecHQ's answer to a reflection question as a pull quote, with a fact after it and where the fact comes from. A fact not yet sourced shows as a marked placeholder.",
  component: ReflectionReply,
  notApplicable: {
    ...NOT_INTERACTIVE,
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "With a sourced fact", props: { from: GUIDE_C3.from, text: time.replies[0], fact: time.fact } },
    {
      label: "With a fact to source",
      description: "Dashed, so an unsourced fact can never pass for finished copy.",
      props: {
        from: GUIDE_C3.from,
        text: time.replies[0],
        fact: { label: "Fun fact \u00b7 to be sourced", text: "A sourced fact about this goes here.", placeholder: true },
      },
    },
    { label: "Reply only", props: { from: GUIDE_C3.from, text: time.replies[2] } },
  ],
});
