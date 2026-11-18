import type { CSSProperties } from "react";
import { ToolIllustration } from "@/components/playbook/ToolIllustration";
import { Icon } from "@/components/primitives/Icon";
import type { ArtifactKind } from "@/mock/loop";

export type IntroGlyph = "stand" | "plan" | "tools";

export interface ProductIntroPoint {
  title: string;
  glyph: IntroGlyph;
}

export interface ProductIntroTool {
  kind: ArtifactKind;
  label: string;
}

export interface ProductIntroProps {
  /** Three short statements, each with its own small drawing. */
  points: readonly ProductIntroPoint[];
  /** The label over the tools: "In your Playbook". */
  toolsLabel: string;
  tools: readonly ProductIntroTool[];
  /** One line on privacy, beside a lock. */
  privacy: string;
  /** Builds in, one idea at a time, when it first appears (Kate, 2026-11-12).
   *  Off: it shows at rest, as it does whenever reduced motion is asked for. */
  animate?: boolean;
  className?: string;
}

/** When each piece arrives, in seconds from the page appearing. About five in
 *  all; the page's own button is there from the start, so nothing waits. */
const AT = {
  points: [0.6, 1.4, 2.2],
  label: 3.2,
  tools: [3.4, 3.55, 3.7, 3.85],
  privacy: 4.3,
} as const;

const at = (seconds: number) => ({ "--intro-delay": `${seconds}s` }) as CSSProperties;

/** Each statement's drawing. Its moving part says the idea: a pin lands where
 *  she stands, a path draws to where she is going, the tools arrive one by one. */
function Glyph({ glyph, start }: { glyph: IntroGlyph; start: number }) {
  return (
    <span className="product-intro__glyph" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {glyph === "stand" ? (
          <g className="product-intro__drop" style={at(start + 0.2)}>
            <path d="M12 21s-6-5.6-6-10a6 6 0 0 1 12 0c0 4.4-6 10-6 10z" />
            <circle cx="12" cy="11" r="2.2" />
          </g>
        ) : null}
        {glyph === "plan" ? (
          <>
            <path className="product-intro__draw" style={at(start + 0.2)} pathLength={1} d="M4 19c4 0 4-6 8-6s4-6 8-6" />
            <circle cx="4" cy="19" r="1.6" />
            <circle className="product-intro__pop" style={at(start + 0.6)} cx="12" cy="13" r="1.6" />
            <circle className="product-intro__pop" style={at(start + 0.9)} cx="20" cy="7" r="1.6" />
          </>
        ) : null}
        {glyph === "tools" ? (
          <>
            <rect className="product-intro__pop" style={at(start + 0.2)} x="4" y="4" width="7" height="7" rx="1.5" />
            <rect className="product-intro__pop" style={at(start + 0.35)} x="13" y="4" width="7" height="7" rx="1.5" />
            <rect className="product-intro__pop" style={at(start + 0.5)} x="4" y="13" width="7" height="7" rx="1.5" />
            <rect className="product-intro__pop" style={at(start + 0.65)} x="13" y="13" width="7" height="7" rx="1.5" />
          </>
        ) : null}
      </svg>
    </span>
  );
}

/**
 * What ExecEngine is, in three statements, the Playbook's tools by name, and
 * privacy in a line (Kate, 2026-11-12). Sits on a navy page. It builds in once,
 * an idea at a time, so each gets a beat of its own; everything is in the
 * page from the start, so a screen reader reads it whole and nothing waits on
 * the motion.
 */
export function ProductIntro({ points, toolsLabel, tools, privacy, animate = true, className }: ProductIntroProps) {
  return (
    <div className={["product-intro", animate ? "product-intro--animate" : null, className].filter(Boolean).join(" ")}>
      <ul className="product-intro__points">
        {points.map((point, index) => {
          const start = AT.points[index] ?? AT.points[AT.points.length - 1];
          return (
            <li key={point.title} className="product-intro__in" style={at(start)}>
              <Glyph glyph={point.glyph} start={start} />
              <span className="product-intro__point">{point.title}</span>
            </li>
          );
        })}
      </ul>

      <section className="product-intro__playbook" aria-label={toolsLabel}>
        <p className="product-intro__label product-intro__in" style={at(AT.label)}>
          {toolsLabel}
        </p>
        <ul className="product-intro__tools">
          {tools.map((tool, index) => (
            <li key={tool.kind} className="product-intro__tool" style={at(AT.tools[index] ?? AT.tools[AT.tools.length - 1])}>
              <ToolIllustration tool={tool.kind} level="icon" size={22} className="product-intro__tool-art" />
              <span>{tool.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="product-intro__privacy product-intro__in" style={at(AT.privacy)}>
        <Icon name="lock" size={16} />
        {privacy}
      </p>
    </div>
  );
}

export default ProductIntro;
