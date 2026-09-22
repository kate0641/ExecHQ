"use client";

import { Input } from "@/components/form/Input";
import type { PromptedDirection } from "@/mock/onboarding";

export interface DirectionDeckProps {
  /** The directions to choose from, each spelled out rather than labelled. */
  directions: readonly PromptedDirection[];
  /** Id of the chosen card, or "own" once the user is writing their own. */
  selectedId: string | null;
  onSelect: (direction: PromptedDirection) => void;
  /** Opens the free-text route. */
  onWriteOwn: () => void;
  /** Shown in place of the deck once the user has chosen to write their own. */
  value: string;
  onChange: (value: string) => void;
  label: string;
  ownLabel?: string;
  hint?: string;
  error?: string;
  className?: string;
}

/**
 * The direction, as a deck of answers rather than a field with suggestions
 * under it.
 *
 * Each card says what that direction actually means, which is aimed squarely at
 * the user the brief singles out: the one who feels a ceiling and cannot name a
 * role. Reading four sentences and recognising yourself in one is a far easier
 * task than composing a sentence about your own career from nothing.
 *
 * The risk this carries is the one the brief warns about — a deck of options can
 * make free text look like the fallback. Two things work against that: writing
 * your own is a card in the same deck rather than a link under it, and choosing
 * it replaces the deck with a statement rather than a form field, so the user's
 * own words get the most editorial treatment on the screen rather than the least.
 */
export function DirectionDeck({
  directions,
  selectedId,
  onSelect,
  onWriteOwn,
  value,
  onChange,
  label,
  ownLabel = "None of these — let me write it",
  hint,
  error,
  className,
}: DirectionDeckProps) {
  const writingOwn = selectedId === "own";

  if (writingOwn) {
    return (
      <div className={["deck", className].filter(Boolean).join(" ")}>
        <Input
          label={label}
          labelHidden
          variant="statement"
          multiline
          rows={3}
          value={value}
          hint={hint}
          error={error}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }

  return (
    <div className={["deck", className].filter(Boolean).join(" ")}>
      <ul className="deck__list" aria-label={label}>
        {directions.map((direction) => {
          const isSelected = selectedId === direction.id;
          return (
            <li key={direction.id}>
              <button
                type="button"
                className={["deck__card", isSelected ? "is-selected" : null]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={isSelected}
                onClick={() => onSelect(direction)}
              >
                <span className="deck__card-title">{direction.label}</span>
                <span className="deck__card-blurb">{direction.blurb}</span>
              </button>
            </li>
          );
        })}

        <li>
          {/* In the deck, not under it: writing your own is a peer of the six,
              not the thing you do when none of them worked. */}
          <button type="button" className="deck__card deck__card--own" onClick={onWriteOwn}>
            <span className="deck__card-title">{ownLabel}</span>
          </button>
        </li>
      </ul>

      {error ? (
        <p className="field__error">
          <span className="u-visually-hidden">Error: </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default DirectionDeck;
