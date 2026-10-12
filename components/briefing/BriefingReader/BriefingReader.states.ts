import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, NOT_AN_INPUT } from "@/components/not-applicable";
import { ReadActions } from "@/components/briefing/ReadActions";
import { TODAYS_READS } from "@/mock/briefing";
import { BriefingReader } from "./BriefingReader";

const noop = () => {};
const read = TODAYS_READS[1];
const actions = createElement(ReadActions, {
  title: read.title,
  saved: false,
  onSave: noop,
  isRead: true,
  onMarkRead: noop,
  onRelevance: noop,
  respondHref: "/toolbox-flow/concept-1?source=briefing&read=widen-a-remit",
});

export const briefingReaderStates = defineComponentStates({
  name: "BriefingReader",
  group: "cards",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "A read, opened: why it is here, what the publisher says it is about, and the way out to the publisher's site, with the read's actions under it. Opening it counts as reading it. ExecHQ never shows the whole article.",
  component: BriefingReader,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "The read is already on the page: there is nothing to wait for.",
    error: "Nothing loads: nothing can fail.",
    empty: "Only ever opened on a read.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "In a sheet, with actions — default", props: { read, actions, onClose: noop } },
    { label: "As the screen (Concept 2), no close", props: { read: TODAYS_READS[0], actions } },
    {
      label: "A long standfirst wraps",
      props: { read: { ...read, standfirst: `${read.standfirst} ${read.standfirst}` }, onClose: noop },
    },
  ],
});
