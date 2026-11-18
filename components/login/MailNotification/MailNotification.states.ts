import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { LOGIN_COPY } from "@/mock/login";
import { MailNotification } from "./MailNotification";

const E = LOGIN_COPY.email;
const base = { from: E.from, subject: E.subject, preview: E.preview, onOpen: () => {} };

export const mailNotificationStates = defineComponentStates({
  name: "MailNotification",
  group: "feedback",
  status: "draft",
  flows: ["login"],
  description:
    "The sign-in email arriving, as the phone's notification. It shows what a lock screen would: sender, a neutral subject and preview. Tapping it opens the drawn email.",
  component: MailNotification,
  notApplicable: {
    ...FIXED_CONTENT,
    disabled: "Only shown once the email has arrived, and then it can always be opened.",
    empty: "Only shown once there is an email.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Default", props: base },
    { label: "Hover", props: { ...base, className: "is-hover" } },
    { label: "Focus", props: { ...base, className: "is-focus" } },
    { label: "Active", props: { ...base, className: "is-active" } },
    { label: "A long preview is cut short", props: { ...base, preview: "Here’s the link you asked for. It works for 15 minutes and only once." } },
  ],
});
