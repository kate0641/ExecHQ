import Link from "next/link";
import { Icon, type IconName } from "@/components/primitives/Icon";
import type { NavDestination } from "@/lib/manifest";

/** How the list is shown. The navigation concept picks one per viewport:
 *  `drawer` on mobile (behind the page, which steps aside), `rail` on tablet
 *  (icons with short labels, widening to `sidebar`), `sidebar` on web. */
export type DrawerNavMode = "drawer" | "rail" | "sidebar";

export interface DrawerNavProps {
  items: NavDestination[];
  /** The flow slug of the page on screen. */
  current: string;
  mode?: DrawerNavMode;
  /** The nav landmark's accessible name. */
  label?: string;
  /** One line under each destination, by flow slug: what is waiting there.
   *  Hidden on the rail, where there is no room. */
  lines?: Partial<Record<string, string>>;
  /** A follow-up is due: Home carries the quiet dot. Never a count. */
  followUpDue?: boolean;
  /** A draft is still open: Toolbox shows the pencil with its tip filled. */
  draftOpen?: boolean;
  /** The account, at the foot. */
  account?: { name?: string; email: string };
  /** The control that widens the rail or folds the sidebar. Only on `rail`
   *  and `sidebar`. */
  toggle?: { label: string; expanded: boolean; onClick: () => void };
  /** Called when a destination is chosen, e.g. to close the drawer. */
  onNavigate?: () => void;
  id?: string;
  /** Catalogue only: shows one item in a state a static page can't reach. */
  demo?: { flowSlug: string; state: "hover" | "focus" | "active" };
  className?: string;
}

const ICONS: Record<string, IconName> = {
  homepage: "home",
  plan: "flag",
  toolbox: "pencil",
  "daily-briefing": "calendar",
  profile: "person",
};

/**
 * The Drawer navigation concept's list: every destination with an icon, its
 * label and one line of what is waiting there, and the account at the foot.
 *
 * The same list serves all three breakpoints. Where it sits — behind the page
 * on mobile, as a rail or a sidebar beside it — is the concept's business, not
 * this component's.
 */
export function DrawerNav({
  items,
  current,
  mode = "sidebar",
  label = "Main",
  lines = {},
  followUpDue = false,
  draftOpen = false,
  account,
  toggle,
  onNavigate,
  id,
  demo,
  className,
}: DrawerNavProps) {
  const classes = ["drawer-nav", `drawer-nav--${mode}`, className].filter(Boolean).join(" ");
  const initial = account?.name?.trim().charAt(0) || account?.email.charAt(0) || "";

  return (
    <nav className={classes} aria-label={label} id={id}>
      <div className="drawer-nav__top">
        {mode === "drawer" ? <span className="drawer-nav__wordmark">ExecHQ</span> : null}
        {toggle ? (
          <button
            type="button"
            className="drawer-nav__toggle"
            aria-expanded={toggle.expanded}
            onClick={toggle.onClick}
            title={toggle.label}
          >
            <Icon name="sidebar" size={20} />
            <span className="u-visually-hidden">{toggle.label}</span>
          </button>
        ) : null}
      </div>

      <ul className="drawer-nav__list">
        {items.map((item, index) => {
          const isCurrent = item.flowSlug === current;
          const name = item.flowSlug === "toolbox" && draftOpen ? "draft" : ICONS[item.flowSlug] ?? "document";
          const line = lines[item.flowSlug];
          const due = item.flowSlug === "homepage" && followUpDue;
          const forced = demo?.flowSlug === item.flowSlug ? `is-${demo.state}` : null;
          return (
            <li key={item.flowSlug} style={{ "--i": index } as React.CSSProperties}>
              <Link
                href={item.href}
                className={["drawer-nav__item", isCurrent ? "is-current" : null, forced].filter(Boolean).join(" ")}
                aria-current={isCurrent ? "page" : undefined}
                onClick={onNavigate}
              >
                <Icon name={name} size={20} />
                <span className="drawer-nav__text">
                  <span className="drawer-nav__label">
                    {item.label}
                    {due ? <span className="u-visually-hidden">, a follow-up is waiting</span> : null}
                  </span>
                  {line ? <span className="drawer-nav__line">{line}</span> : null}
                </span>
                {due ? <span className="drawer-nav__dot" aria-hidden="true" /> : null}
              </Link>
            </li>
          );
        })}
      </ul>

      {account ? (
        <div className="drawer-nav__account">
          <span className="drawer-nav__avatar" aria-hidden="true">{initial}</span>
          <span className="drawer-nav__who">
            {account.name ? <b>{account.name}</b> : null}
            <span>{account.email}</span>
          </span>
        </div>
      ) : null}
    </nav>
  );
}

export default DrawerNav;
