"use client";

import { BaselineForm } from "@/components/homepage/BaselineForm";
import { Sheet } from "@/components/layout/Sheet";
import type { Baseline } from "@/lib/presence";
import { NOW_COPY as C } from "@/mock/accounts-stub";

export interface UpdateNowSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (now: Baseline) => void;
  /** What the numbers start at: where she last said she is. */
  initial: Baseline;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
}

/**
 * The sheet she says where she is now with, after her starting point is set.
 * It is the same form she started with, opened on her latest numbers. Her
 * starting point does not change; only the Now column does.
 */
export function UpdateNowSheet({ open, onClose, onSave, initial, inline }: UpdateNowSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} label={C.title} inline={inline}>
      <div className="update-now">
        <h2 className="update-now__title">{C.title}</h2>
        <BaselineForm initial={initial} intro={C.intro} saveLabel={C.save} skipLabel={C.cancel} onSave={onSave} onSkip={onClose} />
      </div>
    </Sheet>
  );
}

export default UpdateNowSheet;
