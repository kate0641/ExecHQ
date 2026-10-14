import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { ToolPicker } from "./ToolPicker";

const hrefFor = (kind: string) => `/toolbox-flow/concept-1?tool=${kind}`;
const lead = { kind: "situation-brief" as const, step: "Brief your manager before Thursday’s check-in", href: "/toolbox-flow/concept-1?artifact=check-in-brief", action: "Open your draft" };

export const toolPickerStates = defineComponentStates({
  name: "ToolPicker",
  group: "navigation",
  status: "draft",
  flows: ["toolbox"],
  description:
    "The four tools, always first on the Toolbox. Tiles carry the name and a few words on what each makes: 2×2 on a phone, one row of four wider. Chips carry the name alone, in one row that scrolls sideways. Icons are one row of four that fits the width, an icon over a short name, so nothing scrolls (Concept 2); with a next step on her plan, that step's tool is one row under them.",
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
    { label: "Icons in one row (Concept 2)", props: { layout: "icons", hrefFor } },
    { label: "Icons with the next step under (Concept 2)", props: { layout: "icons", lead, hrefFor } },
    { label: "Icons with the next step — hover", props: { layout: "icons", lead, hrefFor, demo: "hover" } },
    { label: "Icons — focus", props: { layout: "icons", hrefFor, demo: "focus" } },
    { label: "Tiles — hover", props: { layout: "tiles", hrefFor, demo: "hover" } },
    { label: "Tiles — focus", props: { layout: "tiles", hrefFor, demo: "focus" } },
    { label: "Tiles — pressed", props: { layout: "tiles", hrefFor, demo: "active" } },
    { label: "Chips — hover", props: { layout: "chips", hrefFor, demo: "hover" }, states: ["long text"], description: "Long names stay on one line and the row scrolls." },
  ],
});
