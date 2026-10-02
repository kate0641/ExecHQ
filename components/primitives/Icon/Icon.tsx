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
  | "pencil"
  | "flag"
  | "attach"
  | "reset"
  | "home"
  | "calendar"
  | "person"
  | "menu"
  | "close"
  | "plus"
  | "minus"
  | "draft"
  | "sidebar"
  | "globe"
  | "linkedin"
  | "bell"
  | "download"
  | "trash"
  | "sign-out"
  | "compass"
  | "mail"
  | "briefing"
  | "spark"
  | "contrast";

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
  // Attaching a file to a message: a paperclip.
  attach: <path d="M14.5 9.5l-5.3 5.3a3.2 3.2 0 01-4.5-4.5l6-6a2.1 2.1 0 013 3l-5.9 5.9a1 1 0 01-1.5-1.5L11.6 6" />,
  // A destination: where the plan is headed.
  flag: (
    <>
      <path d="M5 17.5V3" />
      <path d="M5 3.5h9.5l-2.2 3.2 2.2 3.3H5" />
    </>
  ),
  // Home: the one place every page comes back to.
  home: <path d="M3.5 9.2 10 3.6l6.5 5.6v6.9a.9.9 0 0 1-.9.9h-3.3v-4.7H7.7V17H4.4a.9.9 0 0 1-.9-.9z" />,
  // A day. Drawn with room in its lower half for a date set over it.
  calendar: (
    <>
      <rect x="3.5" y="4.5" width="13" height="12" rx="2" />
      <path d="M3.5 8.2h13M7 3v3M13 3v3" />
    </>
  ),
  // The account: a head and shoulders, no face.
  person: (
    <>
      <circle cx="10" cy="7" r="3.2" />
      <path d="M4 16.8c.9-3 3.3-4.6 6-4.6s5.1 1.6 6 4.6" />
    </>
  ),
  menu: <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />,
  // A page with a side column: widening or folding a sidebar.
  sidebar: (
    <>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M8 3.5v13" />
    </>
  ),
  close: <path d="M5 5l10 10M15 5 5 15" />,
  plus: <path d="M10 4v12M4 10h12" />,
  minus: <path d="M4 10h12" />,
  // The pencil with its tip filled in: a draft is open, waiting for you.
  draft: (
    <>
      <path d="M13.4 3.6l3 3L7.6 15.4 4 16l.6-3.6z" />
      <path d="M11.8 5.2l3 3" strokeWidth="1.3" />
      <path d="M4 16l.6-3.6 3 3z" fill="currentColor" />
    </>
  ),
  // A personal website: the web, as a globe.
  globe: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M2.5 10h15M10 2.5c2.6 2.8 2.6 12.2 0 15M10 2.5c-2.6 2.8-2.6 12.2 0 15" />
    </>
  ),
  // LinkedIn, drawn as a rounded square with "in", not the brand mark.
  linkedin: (
    <>
      <rect x="2.5" y="2.5" width="15" height="15" rx="2.5" />
      <path d="M6.8 8.8v5M6.8 6.1v.01M9.8 13.8V8.8M9.8 11.1a2 2 0 014 0v2.7" />
    </>
  ),
  // Email that comes to you: a follow-up.
  bell: (
    <>
      <path d="M5 13.5V9a5 5 0 0110 0v4.5l1.3 1.7H3.7z" />
      <path d="M8.3 17.2a1.8 1.8 0 003.4 0" />
    </>
  ),
  download: <path d="M10 3v10M5.8 9l4.2 4.2L14.2 9M4 17h12" />,
  trash: (
    <>
      <path d="M3.5 5.5h13M8 5.5V3.3h4v2.2" />
      <path d="M5.2 5.5l.9 11.2h7.8l.9-11.2" />
    </>
  ),
  // Leaving: out through a door.
  "sign-out": (
    <>
      <path d="M11.5 3.5h4v13h-4" />
      <path d="M8 6.5 4.5 10 8 13.5M4.5 10h8.5" />
    </>
  ),
  // A direction: where she is heading.
  compass: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M12.9 7.1l-1.7 4.1-4.1 1.7 1.7-4.1z" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="4.5" width="15" height="11" rx="1.8" />
      <path d="M2.8 5.5 10 10.8l7.2-5.3" />
    </>
  ),
  // The Daily Briefing: a page of headlines.
  briefing: (
    <>
      <rect x="3.5" y="3.5" width="13" height="13" rx="1.8" />
      <path d="M6.5 7h7M6.5 10h7M6.5 13h4" />
    </>
  ),
  // A small four-pointed star: something worth a note has moved.
  spark: <path d="M10 3c.7 4.2 2.8 6.3 7 7-4.2.7-6.3 2.8-7 7-.7-4.2-2.8-6.3-7-7 4.2-.7 6.3-2.8 7-7Z" />,
  // Colour on or off: a disc, half of it filled.
  contrast: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 2.5a7.5 7.5 0 010 15z" fill="currentColor" />
    </>
  ),
  // Going back to the start: an arrow turning back on itself.
  reset: (
    <>
      <path d="M4.2 8.2A6 6 0 1 1 4 11.5" />
      <path d="M3.5 4.2v4.3h4.3" />
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
