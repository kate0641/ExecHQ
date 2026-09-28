import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { Monogram } from "./Monogram";

export const monogramStates = defineComponentStates({
  name: "Monogram",
  group: "primitives",
  status: "draft",
  flows: ["profile"],
  description:
    "The account's mark: the initial of the optional name, or a neutral figure without one. No photo. Always decorative, with the name or email beside it.",
  component: Monogram,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    filled: NOT_AN_INPUT,
    "long text": "Only ever one letter, however long the name.",
  },
  variants: [
    { label: "Initial — default", props: { name: "Maya" } },
    { label: "No name given — empty", props: {} },
    { label: "Large — initial", props: { name: "Maya", size: "lg" } },
    { label: "Large — no name, empty", props: { size: "lg" } },
  ],
});
