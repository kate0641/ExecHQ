import { defineComponentStates } from "@/components/types";
import { CanvasHeader } from "./CanvasHeader";

const SENTENCE =
  "You want to lead a larger organisation, and you want the step up to be a scope change rather than a title change.";

export const canvasHeaderStates = defineComponentStates({
  name: "CanvasHeader",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The living canvas's persistent header — the direction the whole page is about. Present from the first paint, before there is anything to put in it: a page showing its own title waiting to be filled is the clearest statement of what the canvas does, and it gives the document a stable h1 rather than growing one part way down the flow.",
  component: CanvasHeader,
  variants: [
    {
      label: "Waiting",
      description: "Before the user has given a direction.",
      props: {
        label: "What you are working toward",
        sentence: null,
        placeholder: "We will fill this in as soon as you tell us.",
      },
    },
    {
      label: "Filled",
      props: {
        label: "What you are working toward",
        sentence: SENTENCE,
        placeholder: "We will fill this in as soon as you tell us.",
        onEdit: () => {},
      },
    },
    {
      label: "With what we have gathered",
      description:
        "Refinement answers appear here as they are given, so the header keeps up with the page.",
      props: {
        label: "What you are working toward",
        sentence: SENTENCE,
        placeholder: "We will fill this in as soon as you tell us.",
        meta: ["Within a year", "Leaders in my company"],
        onEdit: () => {},
      },
    },
  ],
});
