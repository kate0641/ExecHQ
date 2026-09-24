"use client";

import { Icon } from "@/components/primitives/Icon";

export interface MicButtonProps {
  /** True while the answer is being spoken. Shown as pressed. */
  listening: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Speak instead of type. A toggle: pressed while listening, and pressing it
 * again stops. Its name says what pressing it will do, so it reads "Speak your
 * answer" at rest and "Stop listening" while on.
 */
export function MicButton({ listening, onToggle, disabled, className }: MicButtonProps) {
  return (
    <button
      type="button"
      className={["mic-button", className].filter(Boolean).join(" ")}
      aria-pressed={listening}
      aria-label={listening ? "Stop listening" : "Speak your answer"}
      onClick={onToggle}
      disabled={disabled}
    >
      <Icon name="mic" size={20} />
    </button>
  );
}

export default MicButton;
