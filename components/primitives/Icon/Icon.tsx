export type IconName = "mobile" | "tablet" | "web" | "hub" | "chevron";

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
