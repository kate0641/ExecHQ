import { defineComponentStates } from "@/components/types";
import { CanvasSection } from "./CanvasSection";

export const canvasSectionStates = defineComponentStates({
  name: "CanvasSection",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One section of Concept 3's living canvas. Every section is on the page from the first paint so the user can see its shape — which only works if an unreached section costs nothing to look at, so pending is one muted line naming what it will ask and never a preview of its controls. The heading sits at the same level in all three states, so the outline stays stable as the page fills in.",
  component: CanvasSection,
  variants: [
    {
      label: "Pending",
      props: {
        label: "Your plan",
        state: "pending" as const,
        hint: "Five starting points. We will suggest one.",
      },
    },
    {
      label: "Active",
      props: { label: "Your account", state: "active" as const },
    },
    {
      label: "Complete",
      props: {
        label: "Your account",
        state: "complete" as const,
        summary: "maya@gmail.com",
        onEdit: () => {},
      },
    },
    {
      label: "Complete — no way back",
      description: "For a section there is no sense in reopening.",
      props: {
        label: "Privacy",
        state: "complete" as const,
        summary: "Understood",
      },
    },
    {
      label: "Complete — a longer answer",
      props: {
        label: "A few optional questions",
        state: "complete" as const,
        summary: "Within a year · Leaders in my company · Skipped the rest",
        onEdit: () => {},
      },
    },
  ],
});
