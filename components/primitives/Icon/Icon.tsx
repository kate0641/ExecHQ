export type IconName =
  | "mobile"
  | "tablet"
  | "web"
  | "hub"
  | "chevron"
  | "shield"
  | "lock"
  | "mic"
  | "send"
  | "check"
  | "document"
  | "link"
  | "pencil";

export interface IconProps {
  name: IconName;
  /** Square edge length in pixels. */
  size?: number;
  className?: string;
}

/**
 * The prototype's icon set. Hand-drawn on a 20×20 grid, stroked in
 * `currentColor` so every icon takes the colour of whatever it sits in.
 *
 * Icons are always decorative here: every use pairs one with a visible or
 * visually-hidden text label, so they are hidden from assistive technology.
 */
const PATHS: Record<IconName, React.ReactNode> = {
  mobile: (
    <>
      <rect x="5.5" y="2.5" width="9" height="15" rx="2.2" />
      <path d="M8.5 15.2h3" />
    </>
  ),
  tablet: (
    <>
      <rect x="3.5" y="2.5" width="13" height="15" rx="2" />
      <path d="M8 15.2h4" />
    </>
  ),
  web: (
    <>
      <rect x="1.5" y="3.5" width="17" height="11" rx="1.8" />
      <path d="M6.5 17.5h7M10 14.5v3" />
    </>
  ),
  // The hub panel opens from the left, so the glyph fills its left column.
  hub: (
    <>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M8 3.5v13" />
      <path d="M4.6 7.2h1.6M4.6 10h1.6" strokeWidth="1.3" />
    </>
  ),
  chevron: <path d="M7 4l5 6-5 6" />,
  // Privacy. A closed shield, because the promise is that nothing leaves.
  shield: (
    <>
      <path d="M10 2.5l6 2.2v4.6c0 3.6-2.4 6.5-6 8.2-3.6-1.7-6-4.6-6-8.2V4.7z" />
      <path d="M7.6 10.1l1.7 1.8 3.3-3.6" />
    </>
  ),
  // Privacy, as an object rather than a badge: closed, with nothing showing.
  lock: (
    <>
      <rect x="4" y="8.5" width="12" height="9" rx="2" />
      <path d="M6.8 8.5V6.2a3.2 3.2 0 016.4 0v2.3" />
    </>
  ),
  // Speaking an answer instead of typing it.
  mic: (
    <>
      <rect x="7" y="2.5" width="6" height="10" rx="3" />
      <path d="M4.5 9.5a5.5 5.5 0 0011 0M10 15v2.5" />
    </>
  ),
  // Sending a message: an arrow up, out of the field.
  send: <path d="M10 16V4M5 9l5-5 5 5" />,
  check: <path d="M4 10.4l3.6 3.6L16 5.6" />,
  document: (
    <>
      <path d="M5 2.5h6.5L16 7v10.5H5z" />
      <path d="M11.2 2.6V7H15.8" />
      <path d="M7.6 11h5.2M7.6 14h3.4" strokeWidth="1.3" />
    </>
  ),
  link: (
    <>
      <path d="M8.4 11.6a3 3 0 004.3 0l2.6-2.6a3 3 0 10-4.3-4.3l-1 1" />
      <path d="M11.6 8.4a3 3 0 00-4.3 0l-2.6 2.6a3 3 0 104.3 4.3l1-1" />
    </>
  ),
  pencil: (
    <>
      <path d="M13.4 3.6l3 3L7.6 15.4 4 16l.6-3.6z" />
      <path d="M11.8 5.2l3 3" strokeWidth="1.3" />
    </>
  ),
};

export function Icon({ name, size = 18, className }: IconProps) {
  return (
    <svg
      className={["icon", `icon--${name}`, className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

export default Icon;
