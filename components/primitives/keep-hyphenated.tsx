import type { ReactNode } from "react";

/**
 * Never breaks a headline at a hyphen: a hyphenated word ("check-in", "one-page") is kept on one line, so
 * "Thursday's check-in" never leaves "in" alone (designer, 2026-10-16). Applied to copy as it is rendered,
 * never to the copy itself.
 */
export function keepHyphenated(text: string): ReactNode {
  const parts = text.split(/(\S*\w-\w\S*)/);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="u-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
