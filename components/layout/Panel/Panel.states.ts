import { defineComponentStates } from "@/components/types";
import { Panel } from "./Panel";

export const panelStates = defineComponentStates({
  name: "Panel",
  group: "layout",
  status: "draft",
  flows: [],
  description:
    "A titled surface. The generic container everything else composes with. `headingLevel` is explicit so heading order stays correct on whatever page the panel lands on.",
  component: Panel,
  variants: [
    {
      label: "Default",
      props: {
        title: "Active Landscape",
        headingLevel: 3,
        children: "Panel body content sits here.",
      },
    },
    {
      label: "With eyebrow and description",
      props: {
        eyebrow: "Sprint 3",
        title: "Plan",
        headingLevel: 3,
        description: "Roadmap, Active Landscape and plan progress in one place.",
        children: "Panel body content sits here.",
      },
    },
    {
      label: "Sunken",
      props: {
        tone: "sunken",
        title: "Interaction spec",
        headingLevel: 3,
        children: "Not yet written.",
      },
    },
    {
      label: "Inverse",
      props: {
        tone: "inverse",
        title: "Privacy promise",
        headingLevel: 3,
        children: "Your employer, your network and your colleagues never see this.",
      },
    },
    {
      label: "No header",
      props: { children: "A bare surface, used when the heading lives elsewhere." },
    },
    {
      label: "Empty",
      props: { title: "Artifacts", headingLevel: 3 },
    },
  ],
});
