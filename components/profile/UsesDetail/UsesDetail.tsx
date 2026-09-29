import type { UseId } from "@/mock/account";
import { PROFILE_COPY } from "@/mock/profile";
import { DetailPanel } from "../DetailPanel";
import { SettingsGroup } from "../SettingsGroup";
import { SettingsRow } from "../SettingsRow";

export interface UsesDetailProps {
  uses: Record<UseId, boolean>;
  onChange: (id: UseId, on: boolean) => void;
  onClose?: () => void;
  headingId?: string;
}

const C = PROFILE_COPY.uses;
const IDS = Object.keys(C.items) as UseId[];

/**
 * What ExecHQ may draw on to suggest her next step: her Loop record, her
 * connections and her drafts, each with its own switch. Turning one off
 * takes effect at once; what she has already made stays as it is.
 */
export function UsesDetail({ uses, onChange, onClose, headingId = "uses-heading" }: UsesDetailProps) {
  const anyOff = IDS.some((id) => !uses[id]);
  return (
    <DetailPanel heading={C.heading} headingId={headingId} lead={C.lead} onClose={onClose}>
      <SettingsGroup label={C.heading} headingLevel={3}>
        {IDS.map((id) => (
          <SettingsRow
            key={id}
            kind="switch"
            label={C.items[id].label}
            description={C.items[id].hint}
            checked={uses[id]}
            onChange={(on) => onChange(id, on)}
          />
        ))}
      </SettingsGroup>
      {anyOff ? <p className="notify-topic__hint">{C.offNote}</p> : null}
    </DetailPanel>
  );
}

export default UsesDetail;
