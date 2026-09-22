"use client";

import { useId, useState, type ReactNode } from "react";

export interface ToggleOption {
  value: string;
  /** Always required. Stays the accessible name even when only an icon shows. */
  label: string;
  /** Shown in place of the label text when the group is `iconOnly`. */
  icon?: ReactNode;
  disabled?: boolean;
  /** Why the option is unavailable, or what it does. Read out via
   *  aria-describedby, so a disabled option always explains itself. */
  description?: string;
}

export interface ToggleGroupProps {
  /** Group label. Rendered as a legend, or hidden but still announced. */
  label: string;
  labelHidden?: boolean;
  options: ToggleOption[];
  /** Controlled value. Omit for an uncontrolled group. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md";
  /** Stacks the options instead of placing them in a row. */
  orientation?: "horizontal" | "vertical";
  /** `segmented` is the default: one joined control on a sunken track.
   *  `chips` breaks the options into separate pills that wrap — for a set of
   *  answers that should read as choices rather than as a form control. */
  shape?: "segmented" | "chips";
  /** Shows each option's icon only. The label becomes the accessible name and
   *  the tooltip, so nothing is lost — but every option then needs an `icon`. */
  iconOnly?: boolean;
  className?: string;
}

/**
 * A single-select segmented control built on native radio inputs, so arrow-key
 * navigation, roving focus and screen-reader semantics come from the platform
 * rather than from hand-rolled key handlers.
 */
export function ToggleGroup({
  label,
  labelHidden = false,
  options,
  value,
  defaultValue,
  onChange,
  size = "md",
  orientation = "horizontal",
  shape = "segmented",
  iconOnly = false,
  className,
}: ToggleGroupProps) {
  const name = useId();
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? options.find((option) => !option.disabled)?.value ?? ""
  );
  const isControlled = value !== undefined;
  const selected = isControlled ? value : internalValue;

  function handleChange(next: string) {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  const classes = [
    "toggle-group",
    `toggle-group--${size}`,
    `toggle-group--${orientation}`,
    `toggle-group--${shape}`,
    iconOnly ? "toggle-group--icon" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <fieldset className={classes}>
      <legend className={labelHidden ? "u-visually-hidden" : "toggle-group__legend"}>
        {label}
      </legend>
      <div className="toggle-group__options">
        {options.map((option) => {
          const optionId = `${name}-${option.value}`;
          const labelId = `${optionId}-label`;
          const descriptionId = option.description ? `${optionId}-description` : undefined;
          return (
            <div className="toggle-group__item" key={option.value}>
              <input
                className="toggle-group__input u-visually-hidden"
                type="radio"
                id={optionId}
                name={name}
                value={option.value}
                checked={selected === option.value}
                disabled={option.disabled}
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                onChange={() => handleChange(option.value)}
              />
              <label
                className="toggle-group__option"
                id={labelId}
                htmlFor={optionId}
                // A pointer user gets the same text the label carries, including
                // the reason an option is unavailable.
                title={
                  option.description
                    ? `${option.label} — ${option.description}`
                    : option.label
                }
              >
                {iconOnly ? (
                  <>
                    {option.icon}
                    <span className="u-visually-hidden">{option.label}</span>
                  </>
                ) : (
                  option.label
                )}
              </label>
              {option.description ? (
                <span id={descriptionId} className="u-visually-hidden">
                  {option.description}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export default ToggleGroup;
