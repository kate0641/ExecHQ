/**
 * Shared reasons for states that do not apply, for `notApplicable` in a
 * component's `*.states.ts`. See `components/states-coverage.ts`.
 *
 * Only for states that cannot happen. A state that could happen but has not
 * been designed yet — an error on generated content, a pressed style on a real
 * control, long text almost anywhere — is a gap, not a "does not apply", and
 * stays in `states-baseline.json` until someone designs it.
 */
import type { ComponentState } from "./types";

type Reasons = Partial<Record<ComponentState, string>>;

/** Nothing on it can be pointed at, focused, pressed or switched off. */
export const NOT_INTERACTIVE: Reasons = {
  hover: "Not interactive: it has no controls of its own.",
  focus: "Not interactive: it has no controls of its own.",
  active: "Not interactive: it has no controls of its own.",
  disabled: "Not interactive: it has no controls of its own.",
};

/** A frame or container whose only controls are components placed in it. */
export const CONTROLS_INSIDE: Reasons = {
  hover: "Its controls are other components (Button, fields), which show their own states.",
  focus: "Its controls are other components (Button, fields), which show their own states.",
  active: "Its controls are other components (Button, fields), which show their own states.",
  disabled: "Its controls are other components (Button, fields), which show their own states.",
};

/** A frame whose content is other components, each with its own states. */
export const CONTENT_INSIDE: Reasons = {
  loading: "A frame: the content placed in it shows its own loading state.",
  error: "A frame: errors are shown by the fields inside it, or by a Notice.",
  filled: "A frame: the fields inside it show their own filled state.",
};

export const NOT_AN_INPUT = "Not an input, so there is nothing to fill in.";

/** Fixed copy or artwork that is written into the product, not produced. */
export const FIXED_CONTENT: Reasons = {
  loading: "Fixed content written into the product: there is nothing to wait for.",
  error: "Fixed content written into the product: nothing can fail.",
};

/** Prototype scaffolding, replaced when the real screen is designed. */
export const SCAFFOLDING = "Prototype scaffolding, replaced when the real screen is designed.";
