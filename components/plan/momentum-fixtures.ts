import type { MomentumEvent } from "@/lib/momentum";
import type { MomentumFigure } from "@/mock/plan";

/** Hand-placed events for the catalogue, so each label can be shown. */
export const ev = (figure: MomentumFigure, on: string, text: string, id = `${figure}-${on}-${text.length}`): MomentumEvent => ({
  id,
  figure,
  on,
  text,
});

export const TODAY = "2027-01-01";

/** Five in the last 45 days, one in the 45 before: "building". */
export const BUILDING: MomentumEvent[] = [
  ev("artifact", "2026-10-20", "Drafted your leadership story"),
  ev("completed", "2026-11-25", "Use your leadership story in your next 1:1"),
  ev("artifact", "2026-12-02", "Drafted your pitch"),
  ev("outcome", "2026-12-10", "Your story: it went well"),
  ev("completed", "2026-12-18", "Brief your manager before Thursday’s check-in"),
  ev("artifact", "2026-12-28", "Sent your pitch"),
];

/** Three and three: "steady". */
export const STEADY: MomentumEvent[] = [
  ev("artifact", "2026-10-12", "Drafted your leadership story"),
  ev("completed", "2026-10-30", "Use your leadership story in your next 1:1"),
  ev("outcome", "2026-11-10", "Your story: it went well"),
  ev("artifact", "2026-11-28", "Drafted your pitch"),
  ev("completed", "2026-12-15", "Brief your manager before Thursday’s check-in"),
  ev("artifact", "2026-12-29", "Sent your pitch"),
];

/** Four, then none: "needs attention" or, softer, "quieter lately". */
export const QUIETER: MomentumEvent[] = [
  ev("artifact", "2026-10-08", "Drafted your leadership story"),
  ev("completed", "2026-10-19", "Use your leadership story in your next 1:1"),
  ev("artifact", "2026-11-02", "Drafted your pitch"),
  ev("outcome", "2026-11-12", "Your story: it went well"),
];

export const FOLLOW = {
  done: 3,
  taken: 4,
  items: [
    ev("completed", "2026-12-02", "Use your leadership story in your next 1:1", "f1"),
    ev("completed", "2026-12-10", "Brief your manager before Thursday’s check-in", "f2"),
    ev("completed", "2026-12-18", "Put yourself forward for the Q1 planning review", "f3"),
  ],
};

export const NEXT_MOVE = { title: "Build a stakeholder message map for the workstream", href: "/toolbox-flow/concept-1" };
