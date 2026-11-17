import type { ArtifactKind } from "@/mock/loop";

export interface ToolIllustrationProps {
  tool: ArtifactKind;
  /** Rendered size in pixels; the drawing is square. */
  size: number;
  className?: string;
}

const PAPER = "tool-illustration__paper";

function Brief() {
  return (
    <>
      <rect className="tool-illustration__shade" x="38" y="26" width="58" height="80" rx="7" />
      <rect className={PAPER} x="32" y="20" width="58" height="80" rx="7" />
      <rect x="40" y="32" width="42" height="60" rx="2" opacity="0.55" />
      <rect className={PAPER} x="48" y="13" width="26" height="13" rx="4" />
      <path d="M44 46h34M44 58h34M44 70h22" />
      <path d="M44 82l4 4 8-9" strokeWidth="3" />
      <circle cx="61" cy="19" r="2" />
    </>
  );
}

function Microphone() {
  return (
    <>
      <rect className="tool-illustration__shade" x="52" y="20" width="26" height="48" rx="13" />
      <ellipse className="tool-illustration__shade" cx="64" cy="102" rx="22" ry="4" />
      <rect className={PAPER} x="47" y="15" width="26" height="48" rx="13" />
      <path d="M47 30h26M47 38h26M47 46h26M60 15v48" opacity="0.6" />
      <path d="M37 52a23 23 0 0 0 46 0M60 75v20M46 96h28" />
    </>
  );
}

/** Thought leadership: a lightbulb, an idea worth putting her name to. Not
 *  the pen, which is the Playbook itself in the navigation. */
const GLASS = "M48 80C48 70 34 64 34 48a26 26 0 0 1 52 0c0 16-14 22-14 32z";

function Bulb() {
  return (
    <>
      <path className="tool-illustration__shade" d={GLASS} transform="translate(6 6)" />
      <path className={PAPER} d={GLASS} />
      <rect className={PAPER} x="47" y="80" width="26" height="11" rx="3" />
      <path d="M51 98h18" />
      <path d="M52 64l8-10 8 10" opacity="0.6" />
      <path d="M55 104h10" />
      <path d="M60 6v9M27 19l6 6M93 19l-6 6M16 48h9M95 48h9" opacity="0.7" />
    </>
  );
}

function IdCard() {
  return (
    <>
      <rect className="tool-illustration__shade" x="27" y="41" width="76" height="54" rx="7" />
      <rect className={PAPER} x="21" y="35" width="76" height="54" rx="7" />
      <path d="M52 35l7-18 7 18" />
      <circle cx="42" cy="56" r="8" />
      <path d="M30 78a12 10 0 0 1 24 0" />
      <path d="M64 54h22M64 64h22M64 74h14" />
      <circle className={PAPER} cx="59" cy="16" r="3" />
      <path d="M27 41h64" opacity="0.45" />
    </>
  );
}

const DRAWINGS: Record<ArtifactKind, () => React.ReactElement> = {
  positioning: IdCard,
  pitch: Microphone,
  "situation-brief": Brief,
  "thought-leadership": Bulb,
};

/**
 * The tools' line drawings, one per tool, shaded: an ID card for Positioning
 * Builder, a microphone for Pitch Builder, a clipboard for Situation Brief, a
 * lightbulb for Thought Leadership Builder.
 *
 * Line art in one ink, from the ILLUSTRATIONS tokens, so it reads in
 * greyscale now and takes the palette later. Decorative: the tool's name
 * always sits beside it.
 *
 * Placeholders drawn for the prototype: the finished drawings come from
 * design.
 */
export function ToolIllustration({ tool, size, className }: ToolIllustrationProps) {
  const Drawing = DRAWINGS[tool];
  return (
    <svg
      className={["tool-illustration", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <Drawing />
    </svg>
  );
}

export default ToolIllustration;
