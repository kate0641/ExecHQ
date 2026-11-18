export interface AdvisorMarkProps {
  /** Edge length in pixels. */
  size?: number;
  className?: string;
}

/**
 * ExecHQ's mark in the conversation: a centre with six points gathered
 * around it — your strengths drawn into one. Drawn in currentColor, so it
 * takes the palette when it lands. Always decorative: the name beside it, or
 * the message it introduces, carries the meaning.
 */
export function AdvisorMark({ size = 20, className }: AdvisorMarkProps) {
  return (
    <svg
      className={["advisor-mark", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="12" cy="3.6" r="1.8" />
      <circle cx="19.3" cy="7.8" r="1.8" />
      <circle cx="19.3" cy="16.2" r="1.8" />
      <circle cx="12" cy="20.4" r="1.8" />
      <circle cx="4.7" cy="16.2" r="1.8" />
      <circle cx="4.7" cy="7.8" r="1.8" />
    </svg>
  );
}

export default AdvisorMark;
