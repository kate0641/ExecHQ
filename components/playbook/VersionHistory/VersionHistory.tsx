import { Button } from "@/components/primitives/Button";
import { VERSION_COPY as C } from "@/mock/playbook";

export interface VersionSummary {
  n: number;
  when: string;
  what: string;
}

export interface VersionHistoryProps {
  /** Oldest first, as they were saved. Shown newest first. */
  versions: readonly VersionSummary[];
  /** The version showing in the editor. */
  showing: number;
  onView: (n: number) => void;
  /** Brings an earlier version back as a new version, so nothing is lost. */
  onRestore: (n: number) => void;
  className?: string;
}

/**
 * Every version of a draft, saved as she goes: what made it and when. She can
 * look at any of them, and bring one back. Bringing one back saves it as a
 * new version, so the one she leaves is kept too.
 */
export function VersionHistory({ versions, showing, onView, onRestore, className }: VersionHistoryProps) {
  const latest = versions[versions.length - 1]?.n;
  return (
    <section className={["version-history", className].filter(Boolean).join(" ")} aria-labelledby="version-history-heading">
      <h2 className="version-history__heading" id="version-history-heading">
        {C.heading}
      </h2>
      <p className="version-history__lead">{C.lead}</p>
      {/* The shared list's framed look (designer, 2026-10-30): a white card,
          rows split by lines. */}
      <ol className="version-history__list list list--framed list--dividers-full" reversed>
        {[...versions].reverse().map((v) => {
          const isShowing = v.n === showing;
          return (
            <li key={v.n} className={["version-history__item", "list__item", "list__item--two", isShowing ? "is-showing" : null].filter(Boolean).join(" ")} aria-current={isShowing || undefined}>
              {/* The number leads the line under the name: "Version 2 · Tue 20
                  Oct" (designer, 2026-10-30; it was in a circle). */}
              <span className="version-history__text list__text">
                <span className="version-history__what list__primary">{v.what}</span>
                <span className="version-history__when list__secondary">
                  {C.number(v.n)} · {v.when}
                </span>
              </span>
              <span className="version-history__actions list__trailing">
                {isShowing ? (
                  <span className="version-history__showing">{C.current}</span>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => onView(v.n)}>
                    {C.view}
                    <span className="u-visually-hidden"> version {v.n}</span>
                  </Button>
                )}
                {isShowing && v.n !== latest ? (
                  <Button variant="secondary" size="sm" onClick={() => onRestore(v.n)}>
                    {C.restore}
                  </Button>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default VersionHistory;
