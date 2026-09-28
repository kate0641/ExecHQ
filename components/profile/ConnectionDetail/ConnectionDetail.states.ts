import { defineComponentStates } from "@/components/types";
import { MAYA, withConnection } from "@/mock/account";
import { ConnectionDetail } from "./ConnectionDetail";

const noop = () => {};
const connected = withConnection(MAYA, "website", "2026-10-09", "mayachen.com");
const site = connected.connections.find((c) => c.id === "website")!;
const linkedin = MAYA.connections.find((c) => c.id === "linkedin")!;
const siteOff = MAYA.connections.find((c) => c.id === "website")!;
const controls = "Its controls are Buttons and an Input, which show their own states.";

export const connectionDetailStates = defineComponentStates({
  name: "ConnectionDetail",
  group: "cards",
  status: "draft",
  flows: ["profile"],
  description:
    "One connection in full: exactly what it shares and the way to remove it, or what it would share and the way to connect it. Removing asks once and says what goes. LinkedIn is an uploaded export, the website an address.",
  component: ConnectionDetail,
  notApplicable: {
    hover: controls,
    focus: controls,
    active: controls,
    disabled: controls,
    loading: "Connecting is instant on the local account.",
    empty: "Every connection shares something, and the list says what.",
    "long text": "The shares list wraps line by line; its longest line is shown in LinkedIn.",
  },
  variants: [
    { label: "Website connected — default", props: { connection: site, onConnect: noop, onRemove: noop, onClose: noop, headingId: "cd-1" } },
    {
      label: "Website, confirming removal",
      props: { connection: site, onConnect: noop, onRemove: noop, onClose: noop, startConfirming: true, headingId: "cd-2" },
    },
    { label: "LinkedIn, not connected", props: { connection: linkedin, onConnect: noop, onRemove: noop, onClose: noop, headingId: "cd-3" } },
    {
      label: "LinkedIn — error, wrong file",
      props: { connection: linkedin, onConnect: noop, onRemove: noop, onClose: noop, startError: true, headingId: "cd-4" },
    },
    {
      label: "Website, address filled",
      props: { connection: siteOff, onConnect: noop, onRemove: noop, onClose: noop, headingId: "cd-5" },
    },
    {
      label: "Website — error, not an address",
      props: { connection: siteOff, onConnect: noop, onRemove: noop, onClose: noop, startError: true, headingId: "cd-6" },
    },
  ],
});
