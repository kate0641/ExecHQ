import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { COHORTS } from "@/mock/enterprise";
import { InviteCode } from "./InviteCode";

const noop = () => {};
const controls = "Its controls are Buttons, which show their own states.";
const pilot = {
  code: COHORTS.pilot.code,
  joined: COHORTS.pilot.joined,
  expectedSize: COHORTS.pilot.expectedSize,
  open: true,
  onRegenerate: noop,
  onClose: noop,
};

export const inviteCodeStates = defineComponentStates({
  name: "InviteCode",
  group: "cards",
  status: "draft",
  flows: ["enterprise"],
  description:
    "The cohort's one shared code for the sponsor: copy it, make a new one, close the cohort to new joiners. How many joined is a count, never a list, and both changes ask once.",
  component: InviteCode,
  notApplicable: {
    hover: controls,
    focus: controls,
    active: controls,
    loading: "A local change in the prototype: there is nothing to wait for.",
    error: "Making a code or closing the cohort cannot fail in the prototype.",
    filled: NOT_AN_INPUT,
    "long text": "Codes are a fixed length, and the copy is fixed.",
  },
  variants: [
    { label: "Open — default", props: pilot },
    { label: "No one yet — empty", props: { ...pilot, joined: 0 } },
    { label: "Copied", props: { ...pilot, startCopied: true } },
    { label: "Asking to make a new code", props: { ...pilot, startAsking: "regenerate" } },
    { label: "New code made", props: { ...pilot, code: "EXEC-6047", justRegenerated: true } },
    { label: "Asking to close", props: { ...pilot, startAsking: "close" } },
    {
      label: "Closed — disabled",
      description: "The code no longer works; the count stays.",
      props: { ...pilot, code: COHORTS.demo.code, joined: COHORTS.demo.joined, expectedSize: COHORTS.demo.expectedSize, open: false },
    },
    { label: "Compact, in a margin", props: { ...pilot, layout: "compact" } },
  ],
});
