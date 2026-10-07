import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, CONTENT_INSIDE } from "@/components/not-applicable";
import { ReportDrawer } from "./ReportDrawer";

const noop = () => {};
const base = { open: true, inline: true, onClose: noop, onSave: noop, did: "Podcast appearance · The Modern CMO", on: "2026-10-17" };

export const reportDrawerStates = defineComponentStates({
  name: "ReportDrawer",
  group: "layout",
  status: "draft",
  flows: ["signals"],
  description:
    "Where she says what came of something she did, opened from the “Nothing reported yet” box on its row. Her words are kept as she wrote them and never changed or scored. A thing she added herself takes her words; a thing the Loop made also asks how it went, as the check-in does. The page stays above it.",
  component: ReportDrawer,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...CONTENT_INSIDE,
    empty: "Only ever opened for one thing, which it names.",
    loading: "Saved on her device at once: there is nothing to wait for.",
    filled: "Her words are typed in the field; there is no prefilled state, because it only opens when nothing is reported.",
  },
  variants: [
    { label: "Something she added — her words", props: base },
    {
      label: "Something the Loop made — how it went, then her words",
      description: "She used a draft and has not logged an outcome, so it asks how it went as well, in the same three answers as the check-in. Her words are optional.",
      props: { ...base, did: "Used: Your leadership story", on: "2026-10-05", asksTone: true },
    },
    { label: "Error — nothing written", props: { ...base, demoErrors: true } },
    { label: "Error — how it went not chosen", props: { ...base, asksTone: true, demoErrors: true } },
    {
      label: "Long text — a long name wraps",
      props: { ...base, did: "Panel on planning for growth at the Growth Summit, with the heads of marketing from three other firms, followed by a question about how we set targets across teams" },
    },
  ],
});
