"use client";

import { useState, type CSSProperties } from "react";
import { getComponent } from "@/components/registry";

/** A role's five settings, each the token it points at, e.g. "var(--text-md)". */
export interface TypeLabRole {
  key: string;
  name: string;
  job: string;
  /** Display, title and heading: the lab edits the phone size, because the
   *  preview is a phone. */
  sizeToken: string;
  values: {
    font: string;
    size: string;
    weight: string;
    leading: string;
    tracking: string;
    "word-spacing": string;
  };
}

const FACES = [
  { value: "var(--font-display)", label: "Kulim Park" },
  { value: "var(--font-body)", label: "Inter" },
  { value: "var(--font-serif)", label: "Libre Baskerville" },
];
const SIZES = [
  ["2xs", "11"],
  ["xs", "12"],
  ["sm", "14"],
  ["md", "16"],
  ["lg", "18"],
  ["xl", "22"],
  ["2xl", "28"],
  ["3xl", "36"],
  ["4xl", "48"],
].map(([step, px]) => ({ value: `var(--text-${step})`, label: `${px}px` }));
const WEIGHTS = [
  { value: "var(--weight-regular)", label: "Regular" },
  { value: "var(--weight-semibold)", label: "Semibold" },
  { value: "var(--weight-bold)", label: "Bold" },
];
const LEADINGS = [
  { value: "var(--leading-tight)", label: "Tight" },
  { value: "var(--leading-snug)", label: "Snug" },
  { value: "var(--leading-normal)", label: "Normal" },
  { value: "var(--leading-relaxed)", label: "Relaxed" },
];

const TRACKINGS = [
  { value: "var(--tracking-tight)", label: "−0.02em" },
  { value: "var(--tracking-normal)", label: "0" },
  { value: "var(--tracking-open)", label: "0.01em" },
  { value: "var(--font-display-tracking)", label: "Kulim (0.01em)" },
  { value: "var(--tracking-wide)", label: "0.02em" },
  { value: "var(--tracking-label)", label: "0.08em" },
];
const WORD_SPACINGS = [
  { value: "var(--word-spacing-tight)", label: "−0.12em" },
  { value: "var(--word-spacing-snug)", label: "−0.06em" },
  { value: "var(--font-display-word-spacing)", label: "Kulim (−0.06em)" },
  { value: "var(--word-spacing-normal)", label: "0" },
];

const SETTINGS = [
  { part: "font", label: "Face", options: FACES },
  { part: "size", label: "Size", options: SIZES },
  { part: "weight", label: "Weight", options: WEIGHTS },
  { part: "leading", label: "Line height", options: LEADINGS },
  { part: "tracking", label: "Letters", options: TRACKINGS },
  { part: "word-spacing", label: "Words", options: WORD_SPACINGS },
] as const;

/** The real components the preview stacks, each at the variant that shows the
 *  most roles at once. */
const PREVIEW: { id: string; variant?: string }[] = [
  { id: "stepheader", variant: "With supporting sentence" },
  { id: "nextstepcard" },
  { id: "entrylink", variant: "Today’s Briefing" },
  { id: "entrylink", variant: "A draft to pick up" },
  { id: "briefingcard" },
  { id: "accountcard" },
  { id: "profileheader" },
  { id: "settingsgroup" },
  { id: "notice" },
  { id: "input" },
  { id: "button" },
];

function tokenFor(role: TypeLabRole, part: string) {
  return part === "size" ? role.sizeToken : `--type-${role.key}-${part}`;
}

function labelOf(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

/**
 * The type roles tried out on real components. Each control changes one role
 * for this preview only, by overriding its token on the preview's wrapper;
 * nothing is saved. The changes list says what to put in styles/tokens.css.
 */
export function TypeLab({ roles }: { roles: TypeLabRole[] }) {
  const [changes, setChanges] = useState<Record<string, string>>({});

  const current = (role: TypeLabRole, part: keyof TypeLabRole["values"]) =>
    changes[tokenFor(role, part)] ?? role.values[part];

  const set = (role: TypeLabRole, part: keyof TypeLabRole["values"], value: string) => {
    const token = tokenFor(role, part);
    setChanges((previous) => {
      const next = { ...previous };
      if (value === role.values[part]) delete next[token];
      else next[token] = value;
      return next;
    });
  };

  const changed = roles.flatMap((role) =>
    SETTINGS.filter((setting) => changes[tokenFor(role, setting.part)] !== undefined).map(
      (setting) => ({
        key: `${role.key}-${setting.part}`,
        role: role.name,
        setting: setting.label,
        from: labelOf(setting.options, role.values[setting.part]),
        to: labelOf(setting.options, changes[tokenFor(role, setting.part)]),
      })
    )
  );

  return (
    <div className="type-lab" style={changes as CSSProperties}>
      <div className="type-lab__controls">
        <table className="type-lab__table">
          <caption className="u-visually-hidden">Type roles, adjustable for this preview</caption>
          <thead>
            <tr>
              <th scope="col">Role</th>
              {SETTINGS.map((setting) => (
                <th scope="col" key={setting.part}>
                  {setting.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.key}>
                <th scope="row">
                  <span className="type-lab__role">{role.name}</span>
                  <span className="type-lab__job">{role.job}</span>
                </th>
                {SETTINGS.map((setting) => {
                  const isChanged = changes[tokenFor(role, setting.part)] !== undefined;
                  return (
                    <td key={setting.part}>
                      <select
                        className={isChanged ? "type-lab__select is-changed" : "type-lab__select"}
                        aria-label={`${role.name} ${setting.label.toLowerCase()}`}
                        value={current(role, setting.part)}
                        onChange={(event) => set(role, setting.part, event.target.value)}
                      >
                        {setting.options.map((option) => (
                          <option value={option.value} key={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="type-lab__changes" aria-live="polite">
          {changed.length === 0 ? (
            <p className="type-lab__none">No changes. Pick a setting to try it on every component at once.</p>
          ) : (
            <>
              <p className="type-lab__changes-title">
                {changed.length === 1 ? "1 change" : `${changed.length} changes`}, in this preview only
              </p>
              <ul className="type-lab__change-list">
                {changed.map((change) => (
                  <li key={change.key}>
                    {change.role} {change.setting.toLowerCase()}: {change.from} → {change.to}
                  </li>
                ))}
              </ul>
              <button type="button" className="btn btn--secondary btn--sm" onClick={() => setChanges({})}>
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      <div className="type-lab__phone" data-viewport="mobile">
        {PREVIEW.map(({ id, variant }) => {
          const component = getComponent(id);
          if (!component) return null;
          const shown =
            component.variants.find((each) => variant && each.label.startsWith(variant)) ??
            component.variants[0];
          return (
            <section className="type-lab__specimen" key={`${id}-${shown.label}`} aria-label={component.name}>
              <p className="type-lab__specimen-name">{component.name}</p>
              {shown.element}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default TypeLab;
