import { Icon } from "@/components/primitives/Icon";

export interface MenuButtonProps {
  expanded?: boolean;
  /** The id of the menu it opens. */
  controls?: string;
  /** A follow-up is due: the button carries the quiet dot, so it isn't
   *  hidden behind a closed menu. */
  followUpDue?: boolean;
  onClick?: () => void;
  id?: string;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/** Opens the navigation menu. Icon-only, with "Menu" as its accessible name
 *  and tooltip. It keeps its icon while the menu is open: the page stepping
 *  aside is what is tapped to close it, so there is no close mark. */
export function MenuButton({
  expanded = false,
  controls,
  followUpDue = false,
  onClick,
  id,
  demo,
  className,
}: MenuButtonProps) {
  return (
    <button
      type="button"
      id={id}
      className={["menu-button", demo ? `is-${demo}` : null, className].filter(Boolean).join(" ")}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onClick}
      title="Menu"
    >
      <Icon name="menu" size={20} />
      {followUpDue ? <span className="menu-button__dot" aria-hidden="true" /> : null}
      <span className="u-visually-hidden">
        Menu{followUpDue ? ", a follow-up is waiting" : ""}
      </span>
    </button>
  );
}

export default MenuButton;
