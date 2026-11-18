"use client";

import Link from "next/link";
import { useState } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { Button } from "@/components/primitives/Button";
import { MAP_COPY as C } from "@/mock/homepage";
import { HORIZONS, type LandscapeAction } from "@/mock/plan-stub";
import { ROADMAP } from "@/mock/plan-stub";

export interface ActionSheetProps {
  open: boolean;
  /** The action she tapped. Nothing is drawn while it is null. */
  action: LandscapeAction | null;
  onClose: () => void;
  /** Where Start leads: the tool that does the action. */
  startHref: string;
  /** She started it. Called as the link is followed. */
  onStart: (action: LandscapeAction) => void;
  /** She said it is not for her, with a reason and a note if she gave them. */
  onSkip: (action: LandscapeAction, why: { reason?: string; note?: string }) => void;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
  /** Catalogue only: opens on the second step. */
  demoStep?: "read" | "skip";
}

/**
 * Where she reads about an action she has not started, then starts it or
 * says it is not for her. Skipping asks why, and none of it is required, so
 * saying no is as easy as saying yes.
 *
 * The same sheet is what the Plan page will use for an action it lists
 * (Sprint 3); it lives on the homepage until then.
 */
export function ActionSheet({ open, action, onClose, startHref, onStart, onSkip, inline, demoStep }: ActionSheetProps) {
  return (
    <Sheet open={open && Boolean(action)} onClose={onClose} label={action?.title ?? C.sheet.notForMe} inline={inline}>
      {action ? <Body key={action.id} action={action} onClose={onClose} startHref={startHref} onStart={onStart} onSkip={onSkip} demoStep={demoStep} /> : null}
    </Sheet>
  );
}

function Body({
  action,
  onClose,
  startHref,
  onStart,
  onSkip,
  demoStep,
}: Pick<ActionSheetProps, "onClose" | "startHref" | "onStart" | "onSkip" | "demoStep"> & { action: LandscapeAction }) {
  const [skipping, setSkipping] = useState(demoStep === "skip");
  const [reason, setReason] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const horizon = HORIZONS.find((h) => h.id === action.horizon)?.label ?? "";
  const stage = ROADMAP[action.stage];

  return (
    <div className="action-sheet">
      <h2 className="action-sheet__title">{action.title}</h2>
      {skipping ? (
        <>
          <p className="action-sheet__why">
            <b>{C.sheet.skipTitle}</b> {C.sheet.skipHint}
          </p>
          <ChipGroup label={C.sheet.reasonLabel} labelHidden options={C.sheet.reasons} value={reason} onChange={setReason} />
          <Input label={C.sheet.noteLabel} multiline rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
          <div className="action-sheet__actions">
            <Button
              variant="primary"
              fullWidth
              onClick={() => onSkip(action, { reason: reason[0], note: note.trim() || undefined })}
            >
              {C.sheet.skip}
            </Button>
            <Button variant="ghost" fullWidth onClick={() => setSkipping(false)}>
              {C.sheet.back}
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="action-sheet__why">{action.whyLine}</p>
          <p className="action-sheet__where">{C.sheet.where(horizon, action.stage + 1, stage?.title ?? "")}</p>
          <div className="action-sheet__actions">
            <Link href={startHref} className="btn btn--primary btn--md btn--full" onClick={() => onStart(action)}>
              {C.sheet.start}
            </Link>
            <Button variant="secondary" fullWidth onClick={() => setSkipping(true)}>
              {C.sheet.notForMe}
            </Button>
            <Button variant="ghost" fullWidth onClick={onClose}>
              {C.sheet.close}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default ActionSheet;
