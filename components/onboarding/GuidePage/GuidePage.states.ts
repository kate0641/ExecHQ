import { createElement } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { AnswerDrawer } from "@/components/onboarding/AnswerDrawer";
import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE } from "@/components/not-applicable";
import { GUIDE_C3 } from "@/mock/onboarding";
import { GuidePage } from "./GuidePage";

const noop = () => {};

export const guidePageStates = defineComponentStates({
  name: "GuidePage",
  group: "layout",
  status: "draft",
  flows: ["onboarding"],
  description:
    "One page of Concept 3, the guided onboarding: progress in words, what ExecHQ knows so far, the page, and a margin note saying why it is there. With an answer drawer, the question and its reason stay on the page and the drawer holds only the answer.",
  component: GuidePage,
  notApplicable: {
    ...CONTENT_INSIDE,
    empty: "Always has a title and its content.",
  },
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
      label: "With the answer drawer",
      description: "The question, what it is for and why it is asked stay together on the page; the drawer holds only the answer.",
      props: {
        part: GUIDE_C3.parts[1],
        position: "1 of 4",
        partIndex: 1,
        partCount: GUIDE_C3.parts.length,
        kicker: GUIDE_C3.direction.kicker,
        title: GUIDE_C3.direction.title,
        lede: GUIDE_C3.direction.lede,
        why: GUIDE_C3.direction.why,
        drawer: createElement(
          AnswerDrawer,
          {
            question: GUIDE_C3.direction.title,
            open: true,
            onToggle: noop,
            primaryLabel: GUIDE_C3.direction.cta,
            onPrimary: noop,
            primaryDisabled: true,
          },
          createElement(ChipGroup, {
            label: GUIDE_C3.direction.title,
            labelHidden: true,
            options: ["C-suite in 3 years", "Take on more of a leadership role", "Be seen as an executive"],
            value: [],
            onChange: noop,
          })
        ),
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
        lede: GUIDE_C3.signals.lede,
        primaryLabel: GUIDE_C3.signals.add,
        onPrimary: noop,
        secondaryLabel: GUIDE_C3.signals.skip,
        onSecondary: noop,
      },
    },
  ],
});
