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
      <ol className="version-history__list" reversed>
        {[...versions].reverse().map((v) => {
          const isShowing = v.n === showing;
          return (
            <li key={v.n} className={["version-history__item", isShowing ? "is-showing" : null].filter(Boolean).join(" ")} aria-current={isShowing || undefined}>
              <span className="version-history__n">{v.n}</span>
              <span className="version-history__text">
                <span className="version-history__what">{v.what}</span>
                <span className="version-history__when">{v.when}</span>
              </span>
              <span className="version-history__actions">
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
