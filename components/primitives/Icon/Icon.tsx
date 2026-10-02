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
  // The hub of every page: four panels of different heights, staggered.
  hub: (
    <>
      <rect x="2.5" y="2.5" width="6.25" height="4" rx="1.6" />
      <rect x="11.25" y="2.5" width="6.25" height="8.5" rx="1.6" />
      <rect x="2.5" y="9" width="6.25" height="8.5" rx="1.6" />
      <rect x="11.25" y="13.5" width="6.25" height="4" rx="1.6" />
    </>
  ),
  // Sharper than a right angle (80°), so it points rather than leans.
  chevron: <path d="M7.5 5.8l5 4.2-5 4.2" />,
  // Privacy. A closed shield, because the promise is that nothing leaves.
  shield: (
    <>
      <path d="M10 2.5l6.8 2.2v4.6c0 3.6-2.9 6.5-6.8 8.2-3.9-1.7-6.8-4.6-6.8-8.2V4.7z" />
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
      <rect x="7.75" y="2.5" width="4.5" height="10" rx="2.25" />
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
  attach: (
    // Drawn upright with clear room inside every loop, then turned 45°.
    <g transform="rotate(45 10 10)">
      <path d="M14.2 6.6v6a4.2 4.2 0 0 1-8.4 0V6.2a2.8 2.8 0 0 1 5.6 0v6a1.4 1.4 0 0 1-2.8 0V7.6" />
    </g>
  ),
  // A destination: where the plan is headed. The cloth waves once, low by
  // the pole and rising to a notched tip.
  flag: (
    <>
      <path d="M5 17.5V3" />
      <path d="M5 4c2.5 1.2 6-1.6 10.5 0l-1.9 3.5 1.7 3.5c-4.5-1.6-8 1.2-10.3 0" />
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
  // A page with a narrow side rail and a fold arrow: widening or folding a
  // sidebar. Drawn apart from the hub so the two never look alike.
  sidebar: (
    <>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M6.5 3.5v13M12.5 8l-2 2 2 2" />
    </>
  ),
  close: <path d="M5 5l10 10M15 5 5 15" />,
  // The pencil with its tip filled in: a draft is open, waiting for you.
  draft: (
    <>
      <path d="M13.4 3.6l3 3L7.6 15.4 4 16l.6-3.6z" />
      <path d="M11.8 5.2l3 3" strokeWidth="1.3" />
      <path d="M4 16l.6-3.6 3 3z" fill="currentColor" stroke="none" />
    </>
  ),
  // A personal website: the web, as a globe.
  globe: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M2.5 10h15M10 2.5c3.6 2.8 3.6 12.2 0 15M10 2.5c-3.6 2.8-3.6 12.2 0 15" />
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
      <path d="M12.9 7.1 11.7 11.7 7.1 12.9 8.3 8.3z" />
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
      <path d="M4.2 8.2A6 6 0 1 1 4.91 13.18" />
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
  // Dots of 3, so they carry the same weight as the set's 1.5 lines.
  "more-horizontal": <path d="M5 10h.01M10 10h.01M15 10h.01" strokeWidth="3" />,
  "more-vertical": <path d="M10 5h.01M10 10h.01M10 15h.01" strokeWidth="3" />,
  search: (
    <>
      <circle cx="8.8" cy="8.8" r="5.3" />
      <path d="M12.8 12.8l3.7 3.7" />
    </>
  ),
  // A funnel with a rounded top edge, so it matches the set's round ends.
  filter: <path d="M3.5 5c0-.6.4-1 1-1h11c.6 0 1 .4 1 1 0 .3-.1.5-.3.7L12 10.5V15l-4 2v-6.5L3.8 5.7c-.2-.2-.3-.4-.3-.7z" />,
  plus: <path d="M10 4v12M4 10h12" />,
  minus: <path d="M4 10h12" />,
  // The sheet behind stops short of the one in front, leaving a clear gap.
  copy: (
    <>
      <rect x="7" y="7" width="10.5" height="10.5" rx="2" />
      <path d="M13 4.4v.1a2 2 0 0 0-2-2H4.5a2 2 0 0 0-2 2V11a2 2 0 0 0 2 2" />
    </>
  ),
  // Sharing out of the app: up, out of a tray. The arrow sits high, with a
  // narrow head, so it never touches the tray's open corners.
  share: (
    <>
      <path d="M7 7.5H5.5A1.5 1.5 0 0 0 4 9v7a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 16 16V9a1.5 1.5 0 0 0-1.5-1.5H13" />
      <path d="M10 2v8.5M7.4 4.6 10 2l2.6 2.6" />
    </>
  ),
  upload: <path d="M10 13V3M5.8 7.2 10 3l4.2 4.2M4 17h12" />,
  // Each curve straightens into its corner, so the arrowheads' inner arms
  // meet the line at an angle instead of running alongside it.
  refresh: (
    <path d="M3.5 10a6.5 6.5 0 0 1 6.5-6.5c1.9 0 3.6.8 4.8 2.1l1.7 1.9M16.5 3.5v4h-4M16.5 10a6.5 6.5 0 0 1-6.5 6.5c-1.9 0-3.6-.8-4.8-2.1l-1.7-1.9M3.5 16.5v-4h4" />
  ),
  undo: <path d="M7.5 4.5 4 8l3.5 3.5M4 8h7.5a4.5 4.5 0 0 1 0 9H9" />,
  bookmark: <path d="M5.5 3.5h9v14L10 14l-4.5 3.5z" />,
  // A fuller body than a classic star, so its points are short, not spiky.
  star: <path d="M10 3l2.23 4.33 4.81.78-3.43 3.46.74 4.82L10 14.2l-4.35 2.19.74-4.82-3.43-3.46 4.81-.78z" />,
  // Six slim teeth: reads as settings at 16px without blurring into a ring.
  settings: (
    <>
      <path d="M8.27 4.67 8.54 2.75 11.46 2.75 11.73 4.67 13.75 5.84 15.55 5.11 17.01 7.64 15.48 8.84 15.48 11.16 17.01 12.36 15.55 14.89 13.75 14.16 11.73 15.33 11.46 17.25 8.54 17.25 8.27 15.33 6.25 14.16 4.45 14.89 2.99 12.36 4.52 11.16 4.52 8.84 2.99 7.64 4.45 5.11 6.25 5.84Z" />
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
  // A short, open tail set in from the corner, so the bubble keeps its
  // bottom-left corner and the tail reads as an angle, not a line.
  message: <path d="M4.5 4h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4l-4 2.5L6.5 15h-2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
  // A wide, open bar between the ear and mouth pieces, each stepping in
  // sharply where it meets the bar so both still read as pieces.
  phone: <path d="M6.6 3.5h-2a1.1 1.1 0 0 0-1.1 1.2 13 13 0 0 0 11.8 11.8 1.1 1.1 0 0 0 1.2-1.1v-2l-2.9-1.8-1 1a14 14 0 0 1-4.3-4.3l1-1z" />,
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
  // The plus sits at the neck, where the head meets the shoulders.
  "person-add": (
    <>
      <circle cx="8" cy="7" r="3.2" />
      <path d="M2.5 16.8c.9-3 3-4.6 5.5-4.6s4.6 1.6 5.5 4.6" />
      <path d="M15.6 8.7v5M13.1 11.2h5" />
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
  // One broad peak and a smaller one behind it, with the sun up in the
  // clear sky to the right, never touching a peak.
  image: (
    <>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <circle cx="13.2" cy="7.6" r="1.5" />
      <path d="M2.8 15.2 8 10l5.2 5.2M11.4 13.4l1.6-1.5 4.2 3.8" />
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
  // Bars as single lines floating just above the baseline, not boxes.
  "chart-bar": <path d="M3 17h14M6 14v-4M10 14V5M14 14V7.5" />,
  "trend-up": <path d="M3 14.5l4.5-4.5 3 3 6-6M12.5 7h4v4" />,
  // The glass pinches in to a narrow neck, so it reads as a bulb, not a balloon.
  lightbulb: <path d="M8 14.5h4M8.5 17h3M8 14.5c0-1.6-3-3.1-3-6a5 5 0 0 1 10 0c0 2.9-3 4.4-3 6" />,
  // The i is a touch heavier than the circle, with clear space above the
  // stem, so it holds its own at 16px. Centred: the same gap to the circle
  // above the dot as below the stem.
  info: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9.3v4.8" strokeWidth="1.8" />
      <path d="M10 6.1v.01" strokeWidth="2.3" />
    </>
  ),
  // A softly rounded peak; the dot matches the info i's.
  warning: (
    <>
      <path d="M9.25 4.5Q10 3.2 10.75 4.5l6.55 11.3a1 1 0 0 1-.9 1.5H3.6a1 1 0 0 1-.9-1.5z" />
      <path d="M10 8v4" />
      <path d="M10 14.6v.01" strokeWidth="2.3" />
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
  // The question mark stops a little short, leaving a clear gap above its
  // dot, which matches the info i's.
  help: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M7.8 7.9a2.3 2.3 0 0 1 4.4.9c0 1.4-2.2 1.8-2.2 2.8" />
      <path d="M10 14.4v.01" strokeWidth="2.3" />
    </>
  ),
  // The shackle stops at the top right, well clear of the box.
  unlock: (
    <>
      <rect x="4" y="8.5" width="12" height="9" rx="2" />
      <path d="M6.8 8.5V6.2a3.2 3.2 0 0 1 5.46-2.26" />
    </>
  ),
  key: (
    <>
      <circle cx="7" cy="13" r="3.5" />
      <path d="M9.5 10.5l7-7M14.5 5.5l3 3M12.3 7.7l2.4 2.4" />
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
