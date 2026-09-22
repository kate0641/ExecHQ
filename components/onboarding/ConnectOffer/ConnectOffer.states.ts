import { defineComponentStates } from "@/components/types";
import { CONNECT_OFFERS } from "@/mock/onboarding";
import { ConnectOffer } from "./ConnectOffer";

export const connectOfferStates = defineComponentStates({
  name: "ConnectOffer",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "An optional connection, offered only once the artifact exists. Declining is a designed outcome rather than a dead end, and the declined copy says nothing about what was lost because nothing was — copy that mourned the decline would break the 'no degraded first win' rule as surely as a worse draft would.",
  component: ConnectOffer,
  variants: [
    { label: "Offered — LinkedIn", props: { offer: CONNECT_OFFERS[0] } },
    { label: "Offered — website", props: { offer: CONNECT_OFFERS[1] } },
    {
      label: "Connected",
      props: { offer: CONNECT_OFFERS[0], state: "connected" as const },
    },
    {
      label: "Declined",
      description: "A full outcome. The offer stays available.",
      props: { offer: CONNECT_OFFERS[0], state: "declined" as const },
    },
    {
      label: "Failed",
      props: { offer: CONNECT_OFFERS[1], state: "failed" as const },
    },
  ],
});
