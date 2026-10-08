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
const base = { items, today, startedOn: "2026-10-05", onEdit: noop, onDelete: noop };

export const planSignalPictureStates = defineComponentStates({
  name: "PlanSignalPicture",
  group: "cards",
  status: "draft",
  flows: ["signals"],
  description:
    "What came of it, on the Signal Picture: a row for each thing she put out in the world since her plan began, newest first, what she did pointing at what she says came of it, in her words. A thing with no reply is a quiet dashed block, never a miss, and can be tapped to report. Five rows show, the rest one tap away. What came of a thing is only ever her own words. Nothing in it is a score, percentage or grade.",
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
      label: "A row for each thing — default",
      description: "What she did in a dark block that points at what she says came of it, in her words. A thing with no reply shows a quiet dashed block, never a miss. No next action and no add button: the page has those.",
      props: { ...base, headingId: "pc-came" },
    },
    {
      label: "Nothing reported on any of it",
      description: "Every thing shows with the quiet block. It never guesses at a result.",
      props: { ...base, items: items.map((i) => ({ ...i, impact: undefined })), headingId: "pc-came-none" },
    },
    {
      label: "The quiet block is tappable, to report",
      description: "Where a thing has no reply, the dashed block can be tapped and says so. It opens a drawer to say what came of it.",
      props: { ...base, items: items.map((i) => ({ ...i, impact: undefined })), onReport: noop, headingId: "pc-came-report" },
    },
    {
      label: "Empty — nothing at all yet",
      description: "Nothing she did yet, so it says how it will show.",
      props: { ...base, items: [], today: "2026-10-07", headingId: "pc-came-empty" },
    },
    {
      label: "Long text — a long reply wraps",
      props: {
        ...base,
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
      label: "Deleting what she added asks first",
      props: { ...base, demoDelete: true, headingId: "pc-came-delete" },
    },
  ],
});
