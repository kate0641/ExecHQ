import type { ReactNode } from "react";
import { HubNav } from "@/components/hub/HubNav";
import { getHubPage, type HubPageKey } from "@/lib/hub-pages";

export interface HubChromeProps {
  /** Which of the prototype's own pages this is. */
  page: HubPageKey;
  /** Overrides the title from HUB_PAGES, where a page wants its own wording. */
  title?: string;
  intro?: ReactNode;
  children: ReactNode;
}

/**
 * The chrome shared by the prototype's own pages — the hub, the component
 * catalogue and the stylesheet.
 *
 * Deliberately not the product's `AppChrome`: these are reference tools for
 * designing ExecHQ, not screens in it.
 */
export function HubChrome({ page, title, intro, children }: HubChromeProps) {
  const hubPage = getHubPage(page);

  return (
    <div className="hub">
      <header className="hub__header">
        <p className="t-eyebrow">ExecHQ design prototype</p>
        <h1 className="hub__title">{title ?? hubPage.title}</h1>
        {intro ? <div className="hub__intro t-measure">{intro}</div> : null}
        <HubNav current={page} />
      </header>

      <main className="hub__main" id="main">
        {children}
      </main>

      <footer className="hub__footer">
        <p className="hub__footer-text">
          Sprint 0 — shell only. Product screens are designed in sprints 1 to 5.
        </p>
      </footer>
    </div>
  );
}

export default HubChrome;
