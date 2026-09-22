import { defineComponentStates } from "@/components/types";
import { NavPlaceholder } from "./NavPlaceholder";

export const navPlaceholderStates = defineComponentStates({
  name: "NavPlaceholder",
  group: "navigation",
  status: "draft",
  flows: ["onboarding"],
  description:
    "Holds the space where signed-in navigation will go without designing it. Navigation is a Sprint 2 concern, so onboarding shows this rather than inventing a bar that Sprint 2 has to undo. Not a nav landmark — it has no destinations.",
  component: NavPlaceholder,
  variants: [
    { label: "Default", props: {} },
    {
      label: "Custom label",
      description: "Only when a bar stands in for something more specific.",
      props: { label: "nav — Sprint 2" },
    },
  ],
});
