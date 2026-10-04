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
    tag: "Spoke",
    editable: true,
  },
];
const base = { items, today, history: 30, onAdd: noop, onEdit: noop, onDelete: noop };

/** Items placed to read "building", "unchanged" and "quieter" over ninety days. */
const spread = (id: string, areaId: string, source: PictureItem["source"], on: string, text: string): PictureItem => ({
  id,
  source,
  text,
  on,
  areaId,
  editable: false,
});
const ninety: PictureItem[] = [
  spread("a", "seen-as-leader", "added", "2026-12-14", "Published a post on planning"),
  spread("b", "seen-as-leader", "recorded", "2026-12-18", "Drafted your leadership story"),
  spread("c", "seen-as-leader", "added", "2026-12-20", "Spoke at the planning forum"),
  spread("d", "seen-as-leader", "recorded", "2026-10-30", "Finished your story"),
  spread("e", "broader-remit", "recorded", "2026-10-20", "Sent your pitch for the Q1 planning review"),
  spread("f", "broader-remit", "recorded", "2026-12-12", "Drafted your case for broader scope"),
  spread("g", "decider-access", "recorded", "2026-10-10", "Briefed your manager before your check-in"),
  spread("h", "decider-access", "recorded", "2026-10-25", "Used your brief with your manager"),
];

export const planSignalPictureStates = defineComponentStates({
  name: "PlanSignalPicture",
  group: "cards",
  status: "draft",
  flows: ["plan"],
  description:
    "A private, factual record of what moved, in the Plan. Every item says in words where it came from, “Recorded in ExecHQ” or “You added”, and the two are never folded into one count without the label. Seven days shows each item; thirty groups them by plan area with the channel as a tag; ninety shows the direction for each area, with what is behind it one tap away. A window with too little history says so and shows what there is. Nothing in it is a score, percentage or grade.",
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
      label: "Thirty days, grouped by plan area",
      props: { ...base, initialWindow: 30, headingId: "psp-30" },
    },
    {
      label: "Thirty days, thin history",
      description: "Sixteen days of record: it says so and shows what there is.",
      props: { ...base, today: "2026-10-20", history: 16, initialWindow: 30, headingId: "psp-thin30" },
    },
    {
      label: "Ninety days, thin history",
      description: "A pilot user never fills this window. It says so instead of drawing a trend.",
      props: { ...base, initialWindow: 90, headingId: "psp-thin90" },
    },
    {
      label: "Ninety days, direction by plan area",
      description: "Needs the whole window behind it. Each line is a word, never a number.",
      props: { ...base, items: ninety, today: "2026-12-20", history: 95, initialWindow: 90, headingId: "psp-90" },
    },
    {
      label: "Empty — nothing recorded yet",
      props: { ...base, items: [], today: "2026-10-05", history: 1, headingId: "psp-empty" },
    },
    {
      label: "Empty — a quiet seven days",
      props: { ...base, today: "2027-01-20", history: 108, headingId: "psp-quiet" },
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
            tag: "Spoke",
            editable: true,
          },
        ],
        headingId: "psp-long",
      },
    },
  ],
});
