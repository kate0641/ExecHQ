export interface GeneratingStateProps {
  /** What is being worked on, in the product's voice. */
  label: string;
  className?: string;
}

/**
 * The thinking state.
 *
 * There is no backend here, so the wait is simulated — but the state is real
 * UI and gets designed like it. It is a status rather than a progress bar
 * because nothing can honestly report how far along it is.
 *
 * The animation is a slow pulse, and it stops entirely under reduced motion:
 * the label alone still says what is happening, so nothing is lost.
 */
export function GeneratingState({ label, className }: GeneratingStateProps) {
  return (
    <output className={["generating", className].filter(Boolean).join(" ")}>
      <span className="generating__marks" aria-hidden="true">
        <span className="generating__mark" />
        <span className="generating__mark" />
        <span className="generating__mark" />
      </span>
      <p className="generating__label">{label}</p>
    </output>
  );
}

export default GeneratingState;
