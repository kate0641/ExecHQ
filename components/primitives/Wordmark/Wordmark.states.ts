import { defineComponentStates } from "@/components/types";
import { Wordmark } from "./Wordmark";

export const wordmarkStates = defineComponentStates({
  name: "Wordmark",
  group: "primitives",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The ExecHQ name set in Red Hat Display, standing in for the logo until one exists. Every appearance of the mark goes through this component, so the logo swaps in one place. Colour is inherited, so it works on both surfaces.",
  component: Wordmark,
  variants: [
    { label: "Medium — chrome header", props: { size: "md" } },
    { label: "Medium — with suffix", props: { size: "md", suffix: "Enterprise" } },
    {
      label: "Extra large — welcome screen",
      description: "The first thing on the onboarding welcome, on the inverse surface.",
      props: { size: "xl" },
    },
  ],
});
