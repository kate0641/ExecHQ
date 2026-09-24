import { defineComponentStates } from "@/components/types";
import { CHAT_C2 } from "@/mock/onboarding";
import { ChatComposer } from "./ChatComposer";

const noop = () => {};

export const chatComposerStates = defineComponentStates({
  name: "ChatComposer",
  group: "form controls",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The chat's message field, pinned to the foot: type or speak, then send. Disabled while ExecHQ is writing. Send stays disabled until there is something to send.",
  component: ChatComposer,
  variants: [
    { label: "Empty", props: { value: "", onChange: noop, onSend: noop, placeholder: CHAT_C2.emailPlaceholder } },
    {
      label: "With voice, typed",
      props: {
        value: "C-suite in 3 years",
        onChange: noop,
        onSend: noop,
        voice: { listening: false, onToggle: noop },
      },
    },
    {
      label: "Listening",
      props: { value: "I want to move from", onChange: noop, onSend: noop, voice: { listening: true, onToggle: noop } },
    },
    { label: "Disabled", description: "While ExecHQ is writing.", props: { value: "", onChange: noop, onSend: noop, disabled: true } },
  ],
});
