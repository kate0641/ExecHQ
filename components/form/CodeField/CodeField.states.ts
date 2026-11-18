import { defineComponentStates } from "@/components/types";
import { LOGIN_COPY } from "@/mock/login";
import { CodeField } from "./CodeField";

const label = LOGIN_COPY.inbox.codeLabel;
const onChange = () => {};

export const codeFieldStates = defineComponentStates({
  name: "CodeField",
  group: "form controls",
  status: "draft",
  flows: ["login"],
  description:
    "A one-time code drawn as six cells but typed into one real input, so paste, the phone's code suggestion and screen readers all work.",
  component: CodeField,
  notApplicable: {
    hover: "The cells are drawn over the input; pointing at them changes nothing.",
    active: "A text field has no pressed state; focus covers it.",
    disabled: "Only shown while a code can be typed.",
    loading: "A full code is checked at once on the local account.",
    "long text": "Always six digits.",
  },
  variants: [
    { label: "Empty — default", props: { label, value: "", onChange } },
    { label: "Focus", props: { label, value: "48", onChange, className: "is-focus" } },
    { label: "Half filled", props: { label, value: "482", onChange } },
    { label: "Error — wrong code", props: { label, value: "123456", onChange, error: LOGIN_COPY.inbox.wrongCode } },
  ],
});
