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
  | "contrast"
  | "chevron-left"
  | "chevron-up"
  | "chevron-down"
  | "arrow-right"
  | "arrow-left"
  | "arrow-up"
  | "arrow-down"
  | "external-link"
  | "more-horizontal"
  | "more-vertical"
  | "search"
  | "filter"
  | "plus"
  | "minus"
  | "copy"
  | "share"
  | "upload"
  | "refresh"
  | "undo"
  | "bookmark"
  | "star"
  | "settings"
  | "sliders"
  | "eye"
  | "eye-off"
  | "sign-in"
  | "message"
  | "phone"
  | "video"
  | "people"
  | "person-add"
  | "briefcase"
  | "building"
  | "pin"
  | "clock"
  | "folder"
  | "image"
  | "book"
  | "target"
  | "chart-bar"
  | "trend-up"
  | "lightbulb"
  | "info"
  | "warning"
  | "error"
  | "success"
  | "help"
  | "unlock"
  | "key";

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
  // Sharper than a right angle (80°), so it points rather than leans.
  chevron: <path d="M7.5 5.8l5 4.2-5 4.2" />,
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

  // ---------------------------------------------------------------------------
  // The library: the standard set most platforms need, drawn to the same
  // rules before a screen asks for them. Names say what an icon is, not what
  // it is for; a direction comes last.
  // ---------------------------------------------------------------------------
  "chevron-left": <path d="M12.5 5.8l-5 4.2 5 4.2" />,
  "chevron-up": <path d="M5.8 12.5l4.2-5 4.2 5" />,
  "chevron-down": <path d="M5.8 7.5l4.2 5 4.2-5" />,
  "arrow-right": <path d="M3.5 10h13M11 4.5l5.5 5.5-5.5 5.5" />,
  "arrow-left": <path d="M16.5 10h-13M9 4.5 3.5 10 9 15.5" />,
  "arrow-up": <path d="M10 16.5v-13M4.5 9 10 3.5 15.5 9" />,
  "arrow-down": <path d="M10 3.5v13M4.5 11l5.5 5.5 5.5-5.5" />,
  // Leaving ExecHQ for somewhere else: out of the box, up and to the right.
  "external-link": (
    <>
      <path d="M15.5 11.5v4a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 5 4.5h4" />
      <path d="M12 3.5h4.5V8M16.5 3.5l-7 7" />
    </>
  ),
  "more-horizontal": <path d="M5 10h.01M10 10h.01M15 10h.01" strokeWidth="2.2" />,
  "more-vertical": <path d="M10 5h.01M10 10h.01M10 15h.01" strokeWidth="2.2" />,
  search: (
    <>
      <circle cx="8.8" cy="8.8" r="5.3" />
      <path d="M12.8 12.8l3.7 3.7" />
    </>
  ),
  filter: <path d="M3.5 4.5h13l-5 6v5l-3 1.5v-6.5z" />,
  plus: <path d="M10 4v12M4 10h12" />,
  minus: <path d="M4 10h12" />,
  copy: (
    <>
      <rect x="7" y="7" width="10.5" height="10.5" rx="2" />
      <path d="M13 7V4.5a2 2 0 0 0-2-2H4.5a2 2 0 0 0-2 2V11a2 2 0 0 0 2 2H7" />
    </>
  ),
  // Sharing out of the app: up, out of a tray.
  share: (
    <>
      <path d="M7 7.5H5.5A1.5 1.5 0 0 0 4 9v7a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 16 16V9a1.5 1.5 0 0 0-1.5-1.5H13" />
      <path d="M10 2.5v9M6.8 5.7 10 2.5l3.2 3.2" />
    </>
  ),
  upload: <path d="M10 13V3M5.8 7.2 10 3l4.2 4.2M4 17h12" />,
  refresh: (
    <>
      <path d="M4 10a6 6 0 0 1 10.6-3.8M16 10a6 6 0 0 1-10.6 3.8" />
      <path d="M14.6 2.8v3.4h-3.4M5.4 17.2v-3.4h3.4" />
    </>
  ),
  undo: <path d="M7.5 4.5 4 8l3.5 3.5M4 8h7.5a4.5 4.5 0 0 1 0 9H9" />,
  bookmark: <path d="M5.5 3.5h9v14L10 14l-4.5 3.5z" />,
  star: <path d="M10 2.9l1.82 4.89 5.22.22-4.09 3.25 1.4 5.03L10 13.4l-4.35 2.89 1.4-5.03-4.09-3.25 5.22-.22z" />,
  settings: (
    <>
      <path d="M15.36 8.07 17.27 8.61 17.27 11.39 15.36 11.93 15.16 12.43 16.12 14.16 14.16 16.12 12.43 15.16 11.93 15.36 11.39 17.27 8.61 17.27 8.07 15.36 7.57 15.16 5.84 16.12 3.88 14.16 4.84 12.43 4.64 11.93 2.73 11.39 2.73 8.61 4.64 8.07 4.84 7.57 3.88 5.84 5.84 3.88 7.57 4.84 8.07 4.64 8.61 2.73 11.39 2.73 11.93 4.64 12.43 4.84 14.16 3.88 16.12 5.84 15.16 7.57Z" />
      <circle cx="10" cy="10" r="2.4" />
    </>
  ),
  sliders: (
    <>
      <path d="M3.5 6h6M13.5 6h3M3.5 14h3M10.5 14h6" />
      <circle cx="11.5" cy="6" r="2" />
      <circle cx="8.5" cy="14" r="2" />
    </>
  ),
  // Show: an open eye. Used for showing a password.
  eye: (
    <>
      <path d="M2.5 10S5.2 5 10 5s7.5 5 7.5 5-2.7 5-7.5 5-7.5-5-7.5-5z" />
      <circle cx="10" cy="10" r="2.3" />
    </>
  ),
  // Hide: the same eye, struck through.
  "eye-off": (
    <>
      <path d="M2.5 10S5.2 5 10 5s7.5 5 7.5 5-2.7 5-7.5 5-7.5-5-7.5-5z" />
      <circle cx="10" cy="10" r="2.3" />
      <path d="M3.5 3.5l13 13" />
    </>
  ),
  // Arriving: in through a door. The partner to sign-out.
  "sign-in": (
    <>
      <path d="M11.5 3.5h4v13h-4" />
      <path d="M8 6.5 11.5 10 8 13.5M11.5 10H3" />
    </>
  ),
  message: <path d="M4.5 4h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-3.5 2.8V15h-1a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
  phone: <path d="M6.6 3.5h-2a1.1 1.1 0 0 0-1.1 1.2 13 13 0 0 0 11.8 11.8 1.1 1.1 0 0 0 1.2-1.1v-2l-3.3-1.4-1.6 1.6a9 9 0 0 1-4.3-4.3l1.6-1.6z" />,
  video: (
    <>
      <rect x="2.5" y="5.5" width="10" height="9" rx="2" />
      <path d="M12.5 9l5-2.5v7l-5-2.5" />
    </>
  ),
  people: (
    <>
      <circle cx="7.5" cy="7.2" r="2.8" />
      <path d="M2.5 16.5c.7-2.6 2.7-4 5-4s4.3 1.4 5 4" />
      <path d="M12.5 4.6a2.8 2.8 0 0 1 0 5.3M14.2 12.6c1.5.5 2.7 1.8 3.3 3.9" />
    </>
  ),
  "person-add": (
    <>
      <circle cx="8" cy="7" r="3.2" />
      <path d="M2.5 16.8c.9-3 3-4.6 5.5-4.6s4.6 1.6 5.5 4.6" />
      <path d="M15.5 5.5v5M13 8h5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2.5" y="6" width="15" height="10.5" rx="2" />
      <path d="M7 6V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V6M2.5 10.5h15" />
    </>
  ),
  building: (
    <>
      <path d="M4 17.5V4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v13.5M13 8h2.5a1 1 0 0 1 1 1v8.5M2.5 17.5h15" />
      <path d="M7 6.5h3M7 9.5h3M7 12.5h3" strokeWidth="1.3" />
    </>
  ),
  pin: (
    <>
      <path d="M10 17.5s5.5-5 5.5-9.5a5.5 5.5 0 0 0-11 0c0 4.5 5.5 9.5 5.5 9.5z" />
      <circle cx="10" cy="8" r="2" />
    </>
  ),
  clock: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 5.8V10l2.8 1.8" />
    </>
  ),
  folder: <path d="M2.5 6A1.5 1.5 0 0 1 4 4.5h3.6l1.8 2H16A1.5 1.5 0 0 1 17.5 8v7.5A1.5 1.5 0 0 1 16 17H4a1.5 1.5 0 0 1-1.5-1.5z" />,
  image: (
    <>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <circle cx="7" cy="8" r="1.5" />
      <path d="M2.8 14.5l4.2-4 3.5 3.3 2.3-2 4.4 3.9" />
    </>
  ),
  book: <path d="M10 5.5C8.5 4.2 6 3.8 2.5 4v11.5c3.5-.2 6 .2 7.5 1.5 1.5-1.3 4-1.7 7.5-1.5V4c-3.5-.2-6 .2-7.5 1.5zM10 5.5V17" />,
  target: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <circle cx="10" cy="10" r="4.5" />
      <circle cx="10" cy="10" r="1.5" />
    </>
  ),
  "chart-bar": (
    <>
      <path d="M3 17h14" />
      <rect x="4.5" y="9.5" width="2.5" height="5" rx=".6" />
      <rect x="8.75" y="4.5" width="2.5" height="10" rx=".6" />
      <rect x="13" y="7" width="2.5" height="7.5" rx=".6" />
    </>
  ),
  "trend-up": <path d="M3 14.5l4.5-4.5 3 3 6-6M12.5 7h4v4" />,
  lightbulb: <path d="M7.5 14.5h5M8.3 17h3.4M7.5 14.5c0-1.6-2.5-3.1-2.5-6a5 5 0 0 1 10 0c0 2.9-2.5 4.4-2.5 6" />,
  info: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9v4.8M10 6.3v.01" />
    </>
  ),
  warning: (
    <>
      <path d="M10 3.2l7.3 12.6a1 1 0 0 1-.9 1.5H3.6a1 1 0 0 1-.9-1.5z" />
      <path d="M10 8v4M10 14.6v.01" />
    </>
  ),
  error: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M7.3 7.3l5.4 5.4M12.7 7.3l-5.4 5.4" />
    </>
  ),
  success: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M6.8 10.3l2.2 2.2 4.3-4.6" />
    </>
  ),
  help: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M7.8 7.9a2.3 2.3 0 0 1 4.4.9c0 1.5-2.2 2-2.2 3.3M10 14.4v.01" />
    </>
  ),
  unlock: (
    <>
      <rect x="4" y="8.5" width="12" height="9" rx="2" />
      <path d="M6.8 8.5V6.2a3.2 3.2 0 0 1 6.2-1.1" />
    </>
  ),
  key: (
    <>
      <circle cx="7" cy="13" r="3.5" />
      <path d="M9.5 10.5l7-7M14.5 5.5l2 2M12.5 7.5 14 9" />
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
