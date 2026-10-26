"use client";

import { useId } from "react";

export interface SliderProps {
  /** The question it answers, for screen readers. Visible on the page in the
   *  heading the slider sits under. */
  label: string;
  /** One word per stop, lowest first. The value is the stop's position, 1 up. */
  steps: readonly string[];
  value: number;
  onChange: (value: number) => void;
  /** Catalogue only: shows the thumb in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  disabled?: boolean;
  className?: string;
}

/**
 * A choice along a short scale, dragged or tapped (Kate, 2026-10-26, for the
 * weekly check-in): the browser's own range input, so a finger drags it, a
 * tap on the track moves it and the arrow keys step it, with each stop's
 * word under its place on the track. A screen reader hears the word, not a
 * number. The track fills to the thumb, and the stop chosen is set bold, so
 * where it sits never rests on colour alone.
 */
export function Slider({ label, steps, value, onChange, demo, disabled, className }: SliderProps) {
  const id = useId();
  const last = steps.length;
  const fill = last > 1 ? ((value - 1) / (last - 1)) * 100 : 0;
  return (
    <div className={["slider", demo ? `is-${demo}` : null, className].filter(Boolean).join(" ")}>
      <input
        id={id}
        className="slider__input"
        type="range"
        min={1}
        max={last}
        step={1}
        value={value}
        disabled={disabled}
        aria-label={label}
        aria-valuetext={steps[value - 1]}
        style={{ "--slider-fill": `${fill}%` } as React.CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <p className="slider__steps" aria-hidden="true">
        {steps.map((step, i) => (
          <span key={step} className={i + 1 === value ? "is-chosen" : undefined}>
            {step}
          </span>
        ))}
      </p>
    </div>
  );
}

export default Slider;
