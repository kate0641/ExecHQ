"use client";

import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { Input } from "@/components/form/Input";

export interface InterpretedDirectionProps {
  /** The one-sentence read-back. */
  sentence: string;
  /** True while the sentence is being edited in place. */
  editing?: boolean;
  onEdit?: () => void;
  onChange?: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  editLabel?: string;
  saveLabel?: string;
  className?: string;
}

/**
 * The interpreted direction, read back to the user and editable.
 *
 * This is the first moment the product does something rather than collects
 * something, so the sentence is set in the serif — one of the few genuinely
 * editorial moments in the flow, and the reason Libre Baskerville is loaded.
 *
 * Editing happens in place rather than on a separate screen: being able to
 * correct the system's reading immediately is the whole point of showing it.
 */
export function InterpretedDirection({
  sentence,
  editing = false,
  onEdit,
  onChange,
  onSave,
  onCancel,
  editLabel = "Edit this",
  saveLabel = "Save",
  className,
}: InterpretedDirectionProps) {
  return (
    <div className={["interpreted", className].filter(Boolean).join(" ")}>
      {editing ? (
        <>
          <Input
            label="Your direction, in one sentence"
            multiline
            rows={3}
            value={sentence}
            onChange={(event) => onChange?.(event.target.value)}
          />
          <div className="interpreted__actions">
            <Button variant="primary" size="sm" onClick={onSave}>
              {saveLabel}
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="interpreted__sentence t-editorial">{sentence}</p>
          <div className="interpreted__actions">
            <Button variant="secondary" size="sm" onClick={onEdit}>
              <Icon name="pencil" size={15} />
              {editLabel}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default InterpretedDirection;
