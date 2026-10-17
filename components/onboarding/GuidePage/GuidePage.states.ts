import { createElement } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { MailNotification } from "@/components/login/MailNotification";
import { AnswerDrawer } from "@/components/onboarding/AnswerDrawer";
import { defineComponentStates } from "@/components/types";
import { CONTENT_INSIDE } from "@/components/not-applicable";
import { LOGIN_COPY } from "@/mock/login";
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
      props: { cover: true, wordmark: true, title: GUIDE_C3.welcome.title, lede: GUIDE_C3.welcome.lede, primaryLabel: GUIDE_C3.welcome.cta, onPrimary: noop },
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
      label: "On a navy page",
      description:
        "A step with no drawer, flooded navy: the headline and section labels in yellow, white cards on it. Signals, the recommendation, the first draft and Done (designer, 2026-10-15).",
      props: {
        navy: true,
        kicker: GUIDE_C3.signals.kicker,
        title: GUIDE_C3.signals.title,
        lede: GUIDE_C3.signals.lede,
        why: GUIDE_C3.direction.why,
        primaryLabel: GUIDE_C3.signals.add,
        onPrimary: noop,
        secondaryLabel: GUIDE_C3.signals.skip,
        onSecondary: noop,
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
            options: ["Reach the C-suite within three years", "Take on a bigger leadership role", "Be seen as an executive"],
            value: [],
            onChange: noop,
          })
        ),
      },
    },
    {
      label: "With the sky panel",
      description: "Onboarding and the Plan: the question sits in a panel of the sky Home shows at this hour, its glow in the bottom-right corner, and the drawer is navy. The dock's sky icons switch it.",
      props: {
        sky: true,
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
            options: ["Reach the C-suite within three years", "Take on a bigger leadership role", "Be seen as an executive"],
            value: [],
            onChange: noop,
          })
        ),
      },
    },
    {
      label: "With the navy panel and a lime headline",
      description: "The Plan's moves: the sky panel's place and shape, plain navy, the headline lime, so a move reads apart from onboarding.",
      props: {
        sky: true,
        navyPanel: true,
        part: "Step up",
        position: "Stage 2 of 4 · Show the proof",
        partIndex: 1,
        partCount: 4,
        kicker: "Move 1 of 2 · This week",
        title: "Brief your manager before Thursday’s check-in",
        lede: "Thursday’s check-in is your chance to talk about scope, and a one-page brief shows the proof.",
        why: "A one-page brief turns a check-in into a conversation about scope.",
        drawer: createElement(
          AnswerDrawer,
          { question: "Where are you with this?", open: true, onToggle: noop, primaryLabel: "Keep working on it", onPrimary: noop },
          null
        ),
      },
    },
    {
      label: "Foot only offers a way past",
      props: {
        kicker: GUIDE_C3.signals.kicker,
        title: GUIDE_C3.signals.title,
        primaryLabel: GUIDE_C3.signals.skip,
        primaryVariant: "secondary" as const,
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
        lede: GUIDE_C3.signals.lede,
        primaryLabel: GUIDE_C3.signals.add,
        onPrimary: noop,
        secondaryLabel: GUIDE_C3.signals.skip,
        onSecondary: noop,
      },
    },
    {
      label: "With a notification over it",
      description: "The code email arriving on the page that asks for it, drawn as the phone's own notification.",
      props: {
        kicker: GUIDE_C3.verify.kicker,
        title: GUIDE_C3.verify.title,
        lede: GUIDE_C3.verify.lede("maya.chen@example.com"),
        overlay: createElement(MailNotification, {
          from: LOGIN_COPY.email.from,
          subject: GUIDE_C3.verify.email.subject,
          preview: GUIDE_C3.verify.email.preview,
        }),
      },
    },
  ],
});
