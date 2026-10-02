import type { Account, NotifyTopic } from "@/mock/account";
import { PROFILE_COPY } from "@/mock/profile";
import { DetailPanel } from "../DetailPanel";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

/** The two emails she can switch: the plan (Loop follow-ups and plan
 *  reminders, which are one thing to her) and the Daily Briefing. */
export type NotifyItem = "plan" | "briefing";

/** The account topics each switch covers. */
export const NOTIFY_TOPICS: Record<NotifyItem, NotifyTopic[]> = {
  plan: ["followUps", "plan"],
  briefing: ["briefing"],
};

export interface NotificationsDetailProps {
  notify: Account["notify"];
  onChange: (item: NotifyItem, on: boolean) => void;
  onClose?: () => void;
  headingId?: string;
}

const C = PROFILE_COPY.notifications;
const ITEMS = Object.keys(C.items) as NotifyItem[];

/** A switch is on while anything it covers is still emailed. */
const isOn = (notify: Account["notify"], item: NotifyItem) =>
  NOTIFY_TOPICS[item].some((topic) => notify[topic]);

/**
 * The only notifications there are: email, one switch for the plan and one
 * for the Daily Briefing. ExecHQ is a website, so nothing else can reach her.
 * Each takes effect at once, with no save step.
 */
export function NotificationsDetail({
  notify,
  onChange,
  onClose,
  headingId = "notifications-heading",
}: NotificationsDetailProps) {
  return (
    <DetailPanel heading={C.heading} headingId={headingId} lead={C.lead} onClose={onClose}>
      <SettingsGroup label={C.heading} headingLevel={3} hideLabel>
        {ITEMS.map((item) => (
          <SettingsRow
            key={item}
            kind="switch"
            label={C.items[item].label}
            description={C.items[item].hint}
            checked={isOn(notify, item)}
            onChange={(on) => onChange(item, on)}
          />
        ))}
      </SettingsGroup>
    </DetailPanel>
  );
}

export default NotificationsDetail;
