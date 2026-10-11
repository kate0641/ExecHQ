import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { ToolPicker } from "./ToolPicker";

const hrefFor = (kind: string) => `/toolbox-flow/concept-1?tool=${kind}`;

export const toolPickerStates = defineComponentStates({
  name: "ToolPicker",
  group: "navigation",
  status: "draft",
  flows: ["toolbox"],
  description:
    "The four tools, always first on the Toolbox. Tiles carry the name and a few words on what each makes: 2×2 on a phone, one row of four wider (Concept 1). Chips carry the name alone, in one row that scrolls sideways so the library gets the first screen (Concept 2).",
  component: ToolPicker,
  notApplicable: {
    ...FIXED_CONTENT,
    disabled: "Every tool is always open.",
    empty: "There are always four tools.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Tiles — default", props: { layout: "tiles", hrefFor } },
    { label: "Chips", props: { layout: "chips", hrefFor } },
    { label: "Tiles — hover", props: { layout: "tiles", hrefFor, demo: "hover" } },
    { label: "Tiles — focus", props: { layout: "tiles", hrefFor, demo: "focus" } },
    { label: "Tiles — pressed", props: { layout: "tiles", hrefFor, demo: "active" } },
    { label: "Chips — hover", props: { layout: "chips", hrefFor, demo: "hover" }, states: ["long text"], description: "Long names stay on one line and the row scrolls." },
  ],
});
