import { Icon } from "@/components/primitives/Icon";

export interface MailNotificationProps {
  from: string;
  subject: string;
  preview: string;
  when?: string;
  onOpen?: () => void;
  /** Catalogue only. */
  className?: string;
}

/**
 * The sign-in email arriving, drawn as the phone's own notification. It is
 * there to show what a lock screen would show: the sender, a neutral subject
 * and a neutral preview, never anything about the person's career.
 */
export function MailNotification({ from, subject, preview, when = "now", onOpen, className }: MailNotificationProps) {
  return (
    <button type="button" className={["mail-notification", className].filter(Boolean).join(" ")} onClick={onOpen}>
      <span className="mail-notification__app" aria-hidden="true">
        <Icon name="mail" size={20} />
      </span>
      <span className="mail-notification__text">
        <span className="mail-notification__from">{from}</span>
        <span className="mail-notification__subject">{subject}</span>
        <span className="mail-notification__preview">{preview}</span>
      </span>
      <span className="mail-notification__when">{when}</span>
    </button>
  );
}

export default MailNotification;
