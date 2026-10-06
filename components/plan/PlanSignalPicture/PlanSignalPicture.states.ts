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
const next = { title: "Pitch yourself to a podcast the people above you follow", href: "/toolbox-flow/concept-1" };
const nextByActivity = {
  publishing: { title: "Post what you lead on LinkedIn", href: "/toolbox-flow/concept-1" },
  podcast: next,
};

const pathNext = {
  title: "Pitch Trade Weekly a short guest piece",
  why: "They already quoted you, and a guest piece is the natural next thing.",
  adds: "Press",
  href: "/toolbox-flow/concept-1",
  started: false,
  onStart: noop,
};
const path = { variant: "path" as const, nextStep: pathNext, startedOn: "2026-10-05" };

const base = { items, today, history: 16, next, nextByActivity, onAdd: noop, onEdit: noop, onDelete: noop };

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
    "A private, factual record of what moved, in the Plan. Every item says in words where it came from, “Recorded in ExecHQ” or “You added”, and the two are never folded into one count without the label. Seven days shows each item; thirty groups them by plan area with the channel as a tag; ninety shows the direction for each area, with what is behind it one tap away. Her history decides the window she sees: 7 days at first, 30 days from a month in, 90 days from three months in. Nothing in it is a score, percentage or grade.",
  component: PlanSignalPicture,
  notApplicable: {
    hover: "Its controls are Buttons and a ToggleGroup, which show their own states.",
    focus: "Its controls are Buttons and a ToggleGroup, which show their own states.",
    active: "Its controls are Buttons and a ToggleGroup, which show their own states.",
    disabled: "Its controls are Buttons and a ToggleGroup, which show their own states.",
    loading: "Read from the local record: there is nothing to wait for.",
    error: "Read from the local record: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Seven days, both sources — default", props: base },
    {
      label: "Her first days — what she has so far",
      description: "No window to pick: her history decides it. Under a week it says what she has so far, and no more.",
      props: { ...base, today: "2026-10-20", history: 3, headingId: "psp-first" },
    },
    {
      label: "At 30 days, grouped by activity",
      props: { ...base, history: 35, headingId: "psp-30" },
    },
    {
      label: "At 90 days, direction by activity",
      description: "Needs the whole window behind it. Each line is a word, never a number, with what she reported under it.",
      props: { ...base, items: ninety, today: "2026-12-20", history: 95, headingId: "psp-90" },
    },
    {
      label: "Summary first — seven days",
      description: "What she did, what it led to and the next action, in three lines. The items sit behind a tap.",
      props: { ...base, variant: "summary", headingId: "psp-sum7" },
    },
    {
      label: "Summary first — thirty days",
      props: { ...base, variant: "summary", history: 35, headingId: "psp-sum30" },
    },
    {
      label: "Summary first — ninety days",
      props: { ...base, variant: "summary", items: ninety, today: "2026-12-20", history: 95, headingId: "psp-sum90" },
    },
    {
      label: "Summary first — nothing reported came of it",
      description: "Says so, and says how to add it. It never guesses at an impact.",
      props: {
        ...base,
        variant: "summary",
        items: items.map((i) => ({ ...i, impact: undefined })),
        history: 35,
        headingId: "psp-sum-none",
      },
    },
    {
      label: "Summary first — no next action",
      props: { ...base, variant: "summary", next: undefined, headingId: "psp-sum-nonext" },
    },
    {
      label: "By activity — seven days",
      description: "One card for each kind of activity, each with its own next action when she has one.",
      props: { ...base, variant: "areas", headingId: "psp-act7" },
    },
    {
      label: "By activity — thirty days",
      props: { ...base, variant: "areas", history: 35, headingId: "psp-act30" },
    },
    {
      label: "By activity — ninety days",
      props: { ...base, variant: "areas", items: ninety, today: "2026-12-20", history: 95, headingId: "psp-act90" },
    },
    {
      label: "Impact under each item — thirty days",
      description: "What she typed sits under what she did. An entry she added with nothing yet offers a way to add it.",
      props: { ...base, history: 35, headingId: "psp-impact30" },
    },
    {
      label: "Impact under each item — no next action",
      props: { ...base, next: undefined, headingId: "psp-nonext" },
    },
    {
      label: "Path — a month in, her next step ahead",
      description: "A circle for each month, sized by how much she added, and her next step as the dashed circle at the end. Tap a circle to see what is in it.",
      props: { ...base, ...path, headingId: "pp-month" },
    },
    {
      label: "Path — ninety days",
      props: { ...base, ...path, items: ninety, today: "2026-12-20", history: 95, startedOn: "2026-09-22", headingId: "pp-90" },
    },
    {
      label: "Path — next step started, half full",
      props: { ...base, ...path, nextStep: { ...pathNext, started: true }, headingId: "pp-started" },
    },
    {
      label: "Path — next step inside the organisation",
      description: "It adds no circle, and says so.",
      props: { ...base, ...path, nextStep: { ...pathNext, title: "Brief your manager before Thursday’s check-in", why: "Your check-in is on Thursday and your story is ready to use.", adds: null }, headingId: "pp-inside" },
    },
    {
      label: "Path — her first days, empty",
      description: "No circles yet, and it says what will appear.",
      props: { ...base, ...path, items: [], today: "2026-10-07", history: 3, headingId: "pp-empty" },
    },
    {
      label: "Path — no next step",
      props: { ...base, ...path, nextStep: undefined, headingId: "pp-none" },
    },
    {
      label: "Empty — nothing recorded yet",
      props: { ...base, items: [], today: "2026-10-05", history: 1, next: undefined, headingId: "psp-empty" },
    },
    {
      label: "Empty — a quiet seven days",
      props: { ...base, today: "2027-01-20", history: 16, headingId: "psp-quiet" },
    },
    {
      label: "Offer after a piece is published",
      description: "Offered once, at the moment it matters. Never a standing form.",
      props: {
        ...base,
        offer: { recordId: "post", title: "Why I review my plan every quarter", usedOn: "2026-11-02" },
        onAcceptOffer: noop,
        onDismissOffer: noop,
        headingId: "psp-offer",
      },
    },
    {
      label: "Deleting what she added — asks first",
      props: { ...base, demoDelete: true, headingId: "psp-delete" },
    },
    {
      label: "A long entry wraps",
      props: {
        ...base,
        items: [
          {
            id: "long",
            source: "added",
            text: "Spoke on a panel about planning for growth at the Growth Summit with the heads of marketing from three other firms, followed by a long conversation about how targets are set across teams",
            on: "2026-11-02",
            areaId: "seen-as-leader",
            activity: "speaking",
            impact: "Three people from the audience asked for an introduction to my head of planning, and one invited me to speak at their offsite in the spring.",
            tag: "Spoke",
            editable: true,
          },
        ],
        headingId: "psp-long",
      },
    },
  ],
});
