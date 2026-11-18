import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { Wordmark } from "./Wordmark";

export const wordmarkStates = defineComponentStates({
  name: "Wordmark",
  group: "primitives",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The ExecHQ logo as the product shows it, with an optional product line after it. Every appearance of the mark goes through this component. Dark on stone and blue 100, light on any dark surface.",
  component: Wordmark,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always shows the name.",
    "long text": "The name is fixed; it takes no copy.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Medium — chrome header", props: { size: "md" } },
    { label: "Medium — with suffix", props: { size: "md", suffix: "Enterprise" } },
    {
      label: "Extra large — welcome screen",
      description: "The first thing on the onboarding welcome, on the inverse surface.",
      surface: "inverse",
      props: { size: "xl", tone: "light" },
    },
  ],
});
