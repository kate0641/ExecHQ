"use client";

import { Checkbox } from "@/components/form/Checkbox";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { Notice } from "@/components/onboarding/Notice";
import type { Account, FollowUpCap, NotifyChannel, NotifyTopic } from "@/mock/account";
import { PROFILE_COPY, PROFILE_PROVISIONAL } from "@/mock/profile";
import { DetailPanel } from "../DetailPanel";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export interface NotificationsDetailProps {
  notify: Account["notify"];
  cap: FollowUpCap;
  quietHours: boolean;
  onNotify: (topic: NotifyTopic, channel: NotifyChannel, on: boolean) => void;
  onCap: (cap: FollowUpCap) => void;
  onQuietHours: (on: boolean) => void;
  onClose?: () => void;
  headingId?: string;
}

const C = PROFILE_COPY.notifications;
const TOPICS = Object.keys(C.topics) as NotifyTopic[];
const CHANNELS = Object.keys(C.channels) as NotifyChannel[];
const CAPS = Object.keys(C.caps) as FollowUpCap[];

/**
 * What reaches her and how: each topic by email and in the app, how often a
 * follow-up may email her, and quiet hours. Every control takes effect at
 * once, with no save step. PROVISIONAL: the frequency cap is an open
 * question with the client, and the note says so.
 */
export function NotificationsDetail({
  notify,
  cap,
  quietHours,
  onNotify,
  onCap,
  onQuietHours,
  onClose,
  headingId = "notifications-heading",
}: NotificationsDetailProps) {
  return (
    <DetailPanel heading={C.heading} headingId={headingId} lead={C.lead} onClose={onClose}>
      <div className="notify-topics">
        {TOPICS.map((topic) => (
          <fieldset key={topic} className="notify-topic">
            <legend className="notify-topic__label">{C.topics[topic].label}</legend>
            <p className="notify-topic__hint">{C.topics[topic].hint}</p>
            <div className="notify-topic__channels">
              {CHANNELS.map((channel) => (
                <Checkbox
                  key={channel}
                  label={C.channels[channel]}
                  checked={notify[topic][channel]}
                  onChange={(event) => onNotify(topic, channel, event.target.checked)}
                />
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <ToggleGroup
        label={C.capLabel}
        options={CAPS.map((key) => ({ value: key, label: C.caps[key] }))}
        value={cap}
        onChange={(value) => onCap(value as FollowUpCap)}
      />
      <p className="notify-topic__hint">{C.capHint}</p>
      <Notice tone="explain" label={PROFILE_PROVISIONAL.label}>
        {PROFILE_PROVISIONAL.followUps}
      </Notice>
      <SettingsGroup label={C.quietLabel} headingLevel={3}>
        <SettingsRow
          kind="switch"
          label={C.quietLabel}
          description={quietHours ? C.quietOn : C.quietOff}
          checked={quietHours}
          onChange={onQuietHours}
        />
      </SettingsGroup>
    </DetailPanel>
  );
}

export default NotificationsDetail;
