import type { MomentumEvent } from "@/lib/momentum";
import type { MomentumFigure } from "@/mock/plan";

/** Hand-placed events for the catalogue, so each look of the week can be shown. */
export const ev = (figure: MomentumFigure, on: string, text: string, id = `${figure}-${on}-${text.length}`): MomentumEvent => ({
  id,
  figure,
  on,
  text,
});

/** A Friday: the week runs from Sunday 27 December to Saturday 2 January. */
export const TODAY = "2027-01-01";

/** A busy week: something on Monday, Wednesday and today, of each kind. */
export const THIS_WEEK: MomentumEvent[] = [
  ev("artifact", "2026-12-22", "Drafted your pitch"),
  ev("completed", "2026-12-28", "Use your leadership story in your next 1:1"),
  ev("completed", "2026-12-30", "Share the result with your manager’s manager"),
  ev("artifact", "2026-12-30", "Sent your pitch"),
  ev("outcome", "2027-01-01", "Your story: it went well"),
  ev("signal", "2027-01-01", "Spoke at the leadership forum"),
];

export const NEXT_MOVE = { title: "Build a stakeholder message map for the workstream", why: "Leading across teams starts with knowing what each one needs to hear.", href: "/toolbox-flow/concept-1" };
