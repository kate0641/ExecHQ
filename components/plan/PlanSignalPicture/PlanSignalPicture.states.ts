import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import type { PictureItem } from "@/lib/signal-picture";
import { addedItems, recordedItems } from "@/lib/signal-picture";
import { PRESENCE_ITEMS } from "@/mock/accounts-stub";
import { HOME_STATES } from "@/mock/homepage";
import { PlanSignalPicture } from "./PlanSignalPicture";

const noop = () => {};
const today = "2026-11-03";
const items: PictureItem[] = [
  ...recordedItems(HOME_STATES["nothing-pending"].records),
  ...addedItems(PRESENCE_ITEMS, today),
  {
    id: "added-1",
    source: "added",
    text: "Spoke on a panel about hiring",
    on: "2026-11-02",
    areaId: "seen-as-leader",
    activity: "speaking",
    tag: "Spoke",
    editable: true,
  },
];
const pathNext = {
  title: "Pitch Trade Weekly a short guest piece",
  why: "They already quoted you, and a guest piece is the natural next thing.",
  adds: "Press",
  href: "/toolbox-flow/concept-1",
  started: false,
  onStart: noop,
};
const mapBase = {
  variant: "map" as const,
  startedOn: "2026-10-05",
  hero: { label: "LinkedIn followers", now: "1,284", then: "1,247" },
  before: { publishing: 3, speaking: 1, podcast: 1, press: 2 },
  nextStep: { ...pathNext, activity: "press" as const },
  tryThis: {
    title: "Pitch one show about planning as a leadership skill",
    why: "Your story already says it, and you’ve been asked about it once on air.",
    label: "Draft a pitch",
    href: "/toolbox-flow/concept-1",
  },
  tryLabel: "Try this",
};
const path = { variant: "path" as const, nextStep: pathNext, startedOn: "2026-10-05" };

const base = { items, today, onAdd: noop, onEdit: noop, onDelete: noop };

/** Items placed to read "building", "unchanged" and "quieter" over ninety days. */
const spread = (
  id: string,
  activity: PictureItem["activity"],
  source: PictureItem["source"],
  on: string,
  text: string,
  impact?: string
): PictureItem => ({
  id,
  source,
  text,
  on,
  areaId: "seen-as-leader",
  activity,
  impact,
  editable: false,
});
const ninety: PictureItem[] = [
  spread("a", "publishing", "added", "2026-10-02", "Published a post on planning"),
  spread("b", "publishing", "added", "2026-11-12", "Published a post on reviews", "A peer asked to reuse it in a team meeting."),
  spread("c", "publishing", "recorded", "2026-12-04", "Drafted your leadership story"),
  spread("d", "publishing", "added", "2026-12-18", "Published a post on planning cycles"),
  spread("e", "speaking", "added", "2026-10-20", "Spoke at the planning forum"),
  spread("f", "speaking", "added", "2026-12-12", "Spoke on a panel on hiring", "Two people asked for the slides."),
  spread("g", "press", "added", "2026-10-10", "Quoted on planning cycles"),
];

export const planSignalPictureStates = defineComponentStates({
  name: "PlanSignalPicture",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "Her private, factual record of what moved, drawn three ways, one for each Signals concept. The path is a line through time with a circle for each month and her next step ahead. The map is four equal territories with a dot for each thing, hollow for what she had when she started and filled for what she has added since. What came of it is a row for each thing, what she did pointing at what she says came of it, in her words. What came of a thing is only ever her own words. Nothing in it is a score, percentage or grade.",
  component: PlanSignalPicture,
  notApplicable: {
    hover: "Its controls are Buttons, which show their own states.",
    focus: "Its controls are Buttons, which show their own states.",
    active: "Its controls are Buttons, which show their own states.",
    disabled: "Its controls are Buttons, which show their own states.",
    loading: "Read from the local record: there is nothing to wait for.",
    error: "Read from the local record: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Path — a month in, her next step ahead",
      description: "A circle for each month, sized by how much she added, and her next step as the dashed circle at the end. Tap a circle to see what is in it.",
      props: { ...base, ...path, headingId: "pp-month" },
    },
    {
      label: "Path — ninety days",
      props: { ...base, ...path, items: ninety, today: "2026-12-20", startedOn: "2026-09-22", headingId: "pp-90" },
    },
    {
      label: "Path — next step started, half full",
      props: { ...base, ...path, nextStep: { ...pathNext, started: true }, headingId: "pp-started" },
    },
    {
      label: "Path — the reason for the next step open",
      description: "One tap away, in the plan's own words. It never says the step will cause a result.",
      props: { ...base, ...path, demoWhy: true, headingId: "pp-why" },
    },
    {
      label: "Path — her first days, empty",
      description: "No circles yet, and it says what will appear.",
      props: { ...base, ...path, items: [], today: "2026-10-07", headingId: "pp-empty" },
    },
    {
      label: "Path — no next step",
      props: { ...base, ...path, nextStep: undefined, headingId: "pp-none" },
    },
    {
      label: "Came of it — a row for each thing",
      description: "What she did in a dark block that points at what she says came of it, in her words. A thing with no reply shows a quiet dashed block, never a miss. No next action and no add button: the page has those.",
      props: { ...base, variant: "cameof", startedOn: "2026-10-05", headingId: "pc-came" },
    },
    {
      label: "Came of it — nothing reported on any of it",
      description: "Every thing shows with the quiet block. It never guesses at a result.",
      props: { ...base, variant: "cameof", startedOn: "2026-10-05", items: items.map((i) => ({ ...i, impact: undefined })), headingId: "pc-came-none" },
    },
    {
      label: "Came of it — nothing at all yet, empty",
      description: "Nothing she did yet, so it says how it will show.",
      props: { ...base, variant: "cameof", startedOn: "2026-10-05", items: [], today: "2026-10-07", headingId: "pc-came-empty" },
    },
    {
      label: "Came of it — a long reply wraps",
      props: {
        ...base,
        variant: "cameof",
        startedOn: "2026-10-05",
        items: [
          {
            id: "added-9",
            source: "added",
            text: "Spoke on a panel about planning for growth at the Growth Summit with three other heads of marketing",
            on: "2026-11-02",
            areaId: "seen-as-leader",
            activity: "speaking",
            impact:
              "Three people from the audience asked for an introduction to my head of planning, and one invited me to speak at their offsite in the spring.",
            editable: true,
          },
        ],
        headingId: "pc-came-long",
      },
    },
    {
      label: "Came of it — deleting what she added asks first",
      props: { ...base, variant: "cameof", startedOn: "2026-10-05", demoDelete: true, headingId: "pc-came-delete" },
    },
    {
      label: "Map — where she shows up, a month in",
      description: "Four equal territories, a dot for each thing. Hollow is what she had when she started, filled is what she has added since, and the dashed dot is her next step. No territory is smaller or behind, and none has a target.",
      props: { ...base, ...mapBase, headingId: "pm-month" },
    },
    {
      label: "Map — next step started, half full",
      props: { ...base, ...mapBase, nextStep: { ...mapBase.nextStep, started: true }, headingId: "pm-started" },
    },
    {
      label: "Map — the reason for the next step open",
      props: { ...base, ...mapBase, demoWhy: true, headingId: "pm-why" },
    },
    {
      label: "Map — no next step",
      props: { ...base, ...mapBase, nextStep: undefined, headingId: "pm-none" },
    },
    {
      label: "Map — her first days, empty",
      description: "Hollow dots for what she started with, and nothing filled yet. It says how new dots will show.",
      props: { ...base, ...mapBase, items: [], today: "2026-10-07", hero: { ...mapBase.hero, now: "1,247" }, headingId: "pm-empty" },
    },
    {
      label: "Map — something else she added",
      description: "A fifth territory appears only when she has added something that fits none of the four.",
      props: {
        ...base,
        ...mapBase,
        items: [
          ...items,
          { id: "added-7", source: "added", text: "Judged a hackathon", on: "2026-11-01", areaId: "seen-as-leader", activity: "other", tag: "Something else", editable: true },
        ],
        headingId: "pm-else",
      },
    },
    {
      label: "Offer after a piece is published",
      description: "Offered once, at the moment it matters. Never a standing form.",
      props: {
        ...base,
        ...path,
        offer: { recordId: "post", title: "Why I review my plan every quarter", usedOn: "2026-11-02" },
        onAcceptOffer: noop,
        onDismissOffer: noop,
        headingId: "psp-offer",
      },
    },
  ],
});
