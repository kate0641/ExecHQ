import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { SAVED_NOTICE_COPY as C } from "@/mock/playbook";
import { SavedNotice } from "./SavedNotice";

const noop = () => {};
const base = {
  title: C.title,
  body: C.body,
  linkLabel: C.link,
  href: "/playbook/concept-2#library-heading",
  closeLabel: C.close,
  onClose: noop,
  demo: true,
};

export const savedNoticeStates = defineComponentStates({
  name: "SavedNotice",
  group: "feedback",
  feature: "Playbook",
  status: "draft",
  flows: ["playbook-flow"],
  description:
    "Over a new draft, once, as it opens (UX review, 18 Nov): a check that draws itself, Draft saved to your library, You can find it any time., and Open your library. It goes on its own after about five seconds, sooner with the ×, Escape or a tap outside it, and waits while the pointer or focus is on it. It never takes focus, and is announced politely. In the catalogue it stays until the page is reloaded.",
  component: SavedNotice,
  notApplicable: {
    ...FIXED_CONTENT,
    disabled: "Its link and × are always available while it shows.",
    empty: "It only appears once a draft has been saved.",
    filled: NOT_AN_INPUT,
    "long text": "Its words are fixed and short; the card is centered and wraps them at 20rem if they ever grow.",
  },
  variants: [
    { label: "Shown — default", description: "The check draws itself as it appears; at rest with reduced motion.", props: base },
    {
      label: "Hover, focus and pressed",
      description: "The link and the × show the hover, focus ring and pressed state. Point at them or tab to them.",
      states: ["hover", "focus", "active"],
      props: base,
    },
  ],
});
