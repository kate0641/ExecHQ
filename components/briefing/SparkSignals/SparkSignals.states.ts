import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { SPARK_SIGNALS_COPY as C } from "@/mock/briefing";
import { SparkSignals, type SparkSignal } from "./SparkSignals";

const noop = () => {};
const three: SparkSignal[] = [
  {
    id: "marketing-leaders-podcast",
    kind: "Podcast",
    name: "The Marketing Leaders podcast",
    why: "Its listeners are the marketing leaders your direction names.",
    format: "A 40-minute recorded conversation",
    when: "Books guests about six weeks ahead",
    contact: "Priya Shah, guest producer",
    startLabel: "Start a pitch",
    href: "/playbook-flow/concept-3?tool=pitch&outlet=marketing-leaders-podcast",
  },
  {
    id: "commercial-strategy-summit",
    kind: "Event",
    name: "The Commercial Strategy Summit",
    why: "Its planning track is the topic you lead at work.",
    format: "A 300-word abstract for a 30-minute talk",
    when: "Due Fri, Nov 13, 2026",
    dated: true,
    contact: "Through its own form",
    startLabel: "Start a proposal",
    href: "/playbook-flow/concept-3?tool=pitch&outlet=commercial-strategy-summit",
  },
  {
    id: "commercial-leader-quarterly",
    kind: "Publication",
    name: "Commercial Leader Quarterly",
    why: "Read by the commercial leaders two levels above you.",
    format: "A pitch for a 700-word opinion piece",
    when: "Reads pitches every Monday",
    contact: "Dana Okafor, opinion editor",
    startLabel: "Start a pitch",
    href: "/playbook-flow/concept-3?tool=pitch&outlet=commercial-leader-quarterly",
  },
];
const base = {
  items: three,
  heading: C.heading,
  lede: C.lede,
  whyLabel: C.why,
  notForMeLabel: C.notForMe,
  noneNote: C.none,
  honest: C.honest,
  onPass: noop,
};

export const sparkSignalsStates = defineComponentStates({
  name: "SparkSignals",
  group: "cards",
  feature: "Briefing",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "Opportunities to be seen, after today's reads (UX review, 18 Nov): a navy section, Spark Signals, with a carousel of up to three cards, each a show, event or publication picked for where she is going: its kind, Why you, what they want, its closing date or reading cycle, how to reach it, Start a pitch (or a proposal) in Pitch Builder with that outlet chosen, and Not for me. Always says ExecEngine picked them, to check before she reaches out.",
  component: SparkSignals,
  notApplicable: {
    loading: "Picked before the Briefing opens: there is nothing to wait for on the page.",
    error: "Nothing on it can fail; a pitch that can't start is Pitch Builder's to say.",
    disabled: "Its buttons are always available; the carousel's own arrows show their off state at either end.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Three this week — default", props: { ...base, headingId: "ss-default" } },
    {
      label: "Hover, focus and pressed",
      description: "Start a pitch, Not for me and the carousel's controls. Point at them or tab to them.",
      states: ["hover", "focus", "active"],
      props: { ...base, headingId: "ss-states" },
    },
    { label: "One passed on — the note", props: { ...base, items: three.slice(1), passedNote: C.passed, headingId: "ss-passed" } },
    { label: "One left — no carousel controls", props: { ...base, items: three.slice(2), headingId: "ss-one" } },
    { label: "Empty — all passed on", props: { ...base, items: [], passedNote: C.passed, headingId: "ss-empty" } },
    {
      label: "Long text wraps",
      props: {
        ...base,
        items: [{ ...three[1], name: "The Commercial Strategy and Revenue Operations Summit for Marketing and Sales Leaders", why: `${three[1].why} ${three[0].why}` }, ...three.slice(2)],
        headingId: "ss-long",
      },
    },
  ],
});
