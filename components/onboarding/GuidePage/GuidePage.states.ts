import { defineComponentStates } from "@/components/types";
import { GUIDE_C3 } from "@/mock/onboarding";
import { GuidePage } from "./GuidePage";

const noop = () => {};

export const guidePageStates = defineComponentStates({
  name: "GuidePage",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One page of Concept 3, the guided onboarding: progress in words, what ExecHQ knows so far, the page, and a margin note saying why it is there.",
  component: GuidePage,
  variants: [
    {
      label: "Cover",
      props: { cover: true, title: GUIDE_C3.welcome.title, lede: GUIDE_C3.welcome.lede, primaryLabel: GUIDE_C3.welcome.cta, onPrimary: noop },
    },
    {
      label: "A page with its note",
      props: {
        part: GUIDE_C3.parts[1],
        position: "1 of 4",
        partIndex: 1,
        partCount: GUIDE_C3.parts.length,
        kicker: GUIDE_C3.direction.kicker,
        title: GUIDE_C3.direction.title,
        lede: GUIDE_C3.direction.lede,
        why: GUIDE_C3.direction.why,
        primaryLabel: "Continue",
        onPrimary: noop,
      },
    },
    {
      label: "With a second action",
      props: {
        part: GUIDE_C3.parts[0],
        position: "4 of 4",
        partIndex: 0,
        partCount: GUIDE_C3.parts.length,
        kicker: GUIDE_C3.signals.kicker,
        title: GUIDE_C3.signals.title,
        why: GUIDE_C3.signals.why,
        primaryLabel: GUIDE_C3.signals.done,
        onPrimary: noop,
        secondaryLabel: GUIDE_C3.signals.skip,
        onSecondary: noop,
      },
    },
  ],
});
