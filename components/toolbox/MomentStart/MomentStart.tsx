"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { TOOL_ICONS } from "@/components/toolbox/ToolPicker/ToolPicker";
import type { ArtifactKind } from "@/mock/loop";
import { matchMoment, TOOL_ORDER, TOOLBOX_PAGE, TOOLS } from "@/mock/toolbox";

const C = TOOLBOX_PAGE.moment;

export interface MomentStartProps {
  /** Where a tool opens, carrying what she said. */
  hrefFor: (kind: ArtifactKind, moment?: string) => string;
  /** Opens with this typed and found (catalogue). */
  initial?: string;
  /** Opens having pressed the button with nothing said (catalogue). */
  startError?: boolean;
  className?: string;
}

type Found = { text: string; kind?: ArtifactKind } | null;

/**
 * Concept 3's start: one field, "What's coming up?", and ExecHQ picks the
 * tool. The pilot's matching is rules-based, so it says which tool it picked
 * in one line before anything starts, and when it can't place the moment it
 * asks "Which of these fits?" rather than guessing. The four tools sit under
 * the field as shortcuts.
 */
export function MomentStart({ hrefFor, initial, startError = false, className }: MomentStartProps) {
  const [text, setText] = useState(initial ?? "");
  const [found, setFound] = useState<Found>(initial ? { text: initial, kind: matchMoment(initial) } : null);
  const [error, setError] = useState<string | undefined>(startError ? C.empty : undefined);

  return (
    <div className={["moment-start", className].filter(Boolean).join(" ")}>
      <form
        className="moment-start__form"
        onSubmit={(event) => {
          event.preventDefault();
          const said = text.trim();
          if (!said) {
            setError(C.empty);
            return;
          }
          setFound({ text: said, kind: matchMoment(said) });
        }}
      >
        <Input
          label={C.label}
          hint={C.hint}
          placeholder={C.placeholder}
          value={text}
          error={error}
          onChange={(event) => {
            setText(event.target.value);
            setError(undefined);
            setFound(null);
          }}
        />
        <Button type="submit" fullWidth>
          {C.go}
        </Button>
      </form>

      <output className="moment-start__found">
        {found?.kind ? (
          <span className="moment-start__match">
            <span className="moment-start__sounds">{C.sounds(TOOLS[found.kind].name)}</span>
            <Link href={hrefFor(found.kind, found.text)} className="btn btn--primary btn--md">
              {C.start(TOOLS[found.kind].name)}
            </Link>
          </span>
        ) : found ? (
          <span className="moment-start__unsure">
            <span className="moment-start__sounds">{C.unsure}</span>
            <span className="moment-start__unsure-lead">{C.unsureLead}</span>
          </span>
        ) : null}
      </output>

      <nav className="moment-start__shortcuts" aria-label={found && !found.kind ? C.unsure : C.shortcuts}>
        {found && !found.kind ? null : <span className="moment-start__shortcuts-label">{found?.kind ? C.other : C.shortcuts}</span>}
        <ul className="moment-start__chips">
          {TOOL_ORDER.filter((kind) => kind !== found?.kind).map((kind) => (
            <li key={kind}>
              <Link href={hrefFor(kind, found?.text)} className="moment-start__chip">
                <Icon name={TOOL_ICONS[kind]} size={16} />
                {TOOLS[kind].name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default MomentStart;
