import { defineComponentStates } from "@/components/types";
import { TODAYS_READS } from "@/mock/briefing";
import { ReaderBar } from "./ReaderBar";

const noop = () => {};
const base = { title: TODAYS_READS[0].title, onBack: noop, onRelevance: noop, saved: false, onSave: noop, respondHref: "#", docked: false };

export const readerBarStates = defineComponentStates({
  name: "ReaderBar",
  group: "navigation",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "Briefing Concept 2's reader bar, after a news app: Back, Relevant, Not for me, Save and Write a post, one press each, every one with an icon and a word. Relevant and Not for me are one choice; pressing the chosen one again takes it back. A chosen item is filled and its word goes dark, so it is never colour alone. On a phone and tablet it runs along the foot of the screen where the Ask or go pill usually sits; on web it floats under the read. What each press did is said in the page's live region.",
  component: ReaderBar,
  notApplicable: {
    disabled: "Every action is always open on a read.",
    loading: "Each press changes what is on the page at once: there is nothing to wait for.",
    error: "Each press only changes what is on this page: nothing can fail.",
    empty: "A read always has all five actions.",
    "long text": "Its words are short and fixed; the read's title only finishes each button's name for screen readers.",
  },
  variants: [
    { label: "Floating — default", props: base },
    { label: "Docked at the foot", props: { ...base, docked: true } },
    { label: "Relevant selected and saved", props: { ...base, relevance: "yes", saved: true } },
    { label: "Not for me selected", props: { ...base, relevance: "no" } },
    { label: "Save — hover", props: { ...base, demo: "hover" } },
    { label: "Save — focus", props: { ...base, demo: "focus" } },
    { label: "Save — pressed", props: { ...base, demo: "active" } },
  ],
});
