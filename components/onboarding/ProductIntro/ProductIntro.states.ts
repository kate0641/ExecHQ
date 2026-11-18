import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { GUIDE_C3 } from "@/mock/onboarding";
import { ProductIntro } from "./ProductIntro";

const c = GUIDE_C3.about;
const content = { points: c.points, toolsLabel: c.toolsLabel, tools: c.tools, privacy: c.privacy };

export const productIntroStates = defineComponentStates({
  name: "ProductIntro",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "What ExecEngine is, on onboarding's navy page: three statements, each with a small drawing, the Playbook's four tools by name, and privacy in a line (Kate, 2026-11-12). It builds in once, an idea at a time, over about five seconds; with reduced motion it shows at rest.",
  component: ProductIntro,
  surface: "inverse",
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always shows its three statements and the four tools.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Building in",
      description: "As it first appears: the pin lands, the path draws, the tools arrive, then privacy. Reload the catalogue to watch it again.",
      props: content,
    },
    {
      label: "Long text",
      description: "Longer statements and tool names wrap within their tile and card; the drawings stay put.",
      props: {
        ...content,
        animate: false,
        points: [
          { title: "Know exactly where you stand with the people who decide", glyph: "stand" as const },
          { title: "Plan where you\u2019re going, stage by stage, with a finish line for each", glyph: "plan" as const },
          { title: "The tools to get you there, ready when each step needs them", glyph: "tools" as const },
        ],
        tools: [
          { kind: "positioning" as const, label: "Positioning statement and leadership narrative" },
          { kind: "pitch" as const, label: "Pitch builder for stages and press" },
          { kind: "situation-brief" as const, label: "Situation brief before a big moment" },
          { kind: "thought-leadership" as const, label: "Thought leadership posts and articles" },
        ],
      },
    },
    {
      label: "At rest",
      description: "Everything in place, as after the build or with reduced motion asked for.",
      props: { ...content, animate: false },
    },
  ],
});
