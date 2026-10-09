import { createElement } from "react";
import { BaselineForm } from "@/components/homepage/BaselineForm";
import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { presenceCounts, withAdded } from "@/lib/presence";
import { SIGNAL_PICTURE_COPY as C } from "@/mock/homepage";
import { PRESENCE_KINDS, PRESENCE_STUB, SPARK_COPY } from "@/mock/accounts-stub";
import { SignalPicture } from "./SignalPicture";

const noop = () => {};
const rows = presenceCounts("2026-11-03", withAdded([])).map((p) => ({
  id: p.kind,
  label: PRESENCE_KINDS[p.kind].label,
  then: p.then,
  now: p.now,
}));
const base = {
  name: C.heading,
  asOf: C.asOf("5 Oct"),
  rows,
  thenLabel: "Start",
  nowLabel: "Now",
  next: { label: C.nextLabel, title: PRESENCE_STUB.tryThis.title, why: PRESENCE_STUB.tryThis.why, href: "/toolbox-flow/concept-1", actionLabel: C.nextAction },
  detailHref: "/signals/concept-2",
  detailLabel: C.detailLabel,
  headingId: "signal-picture-demo",
};
const spark = {
  items: [{ id: "demo", source: SPARK_COPY.source.press, text: SPARK_COPY.press("Marketing Week", "third") }],
  label: SPARK_COPY.label,
  dismissLabel: SPARK_COPY.dismiss,
  dismissName: SPARK_COPY.dismissNote,
  onDismiss: noop,
};

export const signalPictureStates = defineComponentStates({
  name: "SignalPicture",
  group: "cards",
  status: "draft",
  flows: ["homepage"],
  description:
    "The foot of the homepage: where she started beside where she is now across what she has put out there, one note of what has moved, one thing to try next. All of it is entered by hand. With nothing entered it asks where she is starting from, in one short form.",
  component: SignalPicture,
  notApplicable: {
    hover: "Its only controls are a Button and a link, which show their own states.",
    focus: "Its only controls are a Button and a link, which show their own states.",
    active: "Its only controls are a Button and a link, which show their own states.",
    disabled: "Everything on it can always be used.",
    loading: "Written from local data: there is nothing to wait for.",
    error: "Nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Default — overview, a note and a next step", props: { ...base, spark } },
    { label: "No note — nothing has moved lately", props: base },
    { label: "Empty — asking where she is starting from", props: { ...base, rows: [], spark: undefined, next: undefined, empty: createElement(BaselineForm, { onSave: noop, onSkip: noop }) } },
    {
      label: "Long text — a long next step wraps",
      props: {
        ...base,
        spark,
        next: { ...base.next, title: "Pitch one show about planning as a leadership skill, the kind that reaches directors and above across marketing, product and communications", why: PRESENCE_STUB.tryThis.why },
      },
    },
  ],
});
