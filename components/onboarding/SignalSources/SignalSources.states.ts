import { defineComponentStates } from "@/components/types";
import { SignalSources } from "./SignalSources";

const noop = () => {};
const base = { onConnect: noop, onAddLink: noop, onDisconnect: noop };

export const signalSourcesStates = defineComponentStates({
  name: "SignalSources",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The signal sources as rows with their status; each opens a sheet to connect it or add it by link, saying what is brought in and what it is used for. Connecting is simulated.",
  component: SignalSources,
  variants: [
    { label: "Nothing connected", props: { ...base, connections: {}, signalLinks: {} } },
    { label: "LinkedIn connected", props: { ...base, connections: { linkedin: "connected" }, signalLinks: {} } },
    {
      label: "Website added by link",
      props: { ...base, connections: { website: "connected" }, signalLinks: { website: "https://mayachen.com" } },
    },
  ],
});
