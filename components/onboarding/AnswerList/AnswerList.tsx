"use client";

export interface AnswerOption {
  value: string;
  label: string;
}

export interface AnswerListProps {
  /** Names the group: the question being answered. */
  label: string;
  options: readonly AnswerOption[];
  /** The answer already given, if any. Shown as pressed. */
  value?: string;
  onChoose: (value: string) => void;
  className?: string;
}

/**
 * One-tap answers: pressing one answers the question and moves on.
 *
 * Buttons, not radios. A radio group changes its value on an arrow key, and a
 * choice that moves the screen on would then fire the moment a keyboard user
 * tried to look at the next option. Buttons only answer when pressed.
 *
 * Stacked, all the same width, centred — the same shape as the direction
 * prompts, so the screens read as one set.
 */
export function AnswerList({ label, options, value, onChoose, className }: AnswerListProps) {
  return (
    <ul className={["answer-list", className].filter(Boolean).join(" ")} aria-label={label}>
      {options.map((option) => {
        const chosen = option.value === value;
        return (
          <li key={option.value}>
            <button
              type="button"
              className={["answer-list__option", chosen ? "is-chosen" : null]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={chosen}
              onClick={() => onChoose(option.value)}
            >
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default AnswerList;
