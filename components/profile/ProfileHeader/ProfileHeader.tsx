import { Icon } from "@/components/primitives/Icon";
import { Monogram } from "@/components/primitives/Monogram";

export interface ProfileHeaderProps {
  /** Her full name. Without it the card asks for one. */
  name?: string;
  /** Her current title, when she has given one. */
  title?: string;
  /** The first name, for the monogram. */
  initialOf?: string;
  /** What the card says when there is no name. */
  noName: string;
  /** Opens the account detail, where the name is edited. */
  onOpen?: () => void;
  /** Its detail is the one showing in the web pane. */
  current?: boolean;
  /** Catalogue only: `is-hover`, `is-focus`, `is-active`. */
  className?: string;
}

/**
 * The top of the profile: the monogram, her name and her current title if she
 * has given one. The email is not here: it lives in the account detail only.
 * The whole card opens the account detail.
 */
export function ProfileHeader({ name, title, initialOf, noName, onOpen, current, className }: ProfileHeaderProps) {
  const given = name?.trim();
  return (
    <button
      type="button"
      className={["profile-header", className].filter(Boolean).join(" ")}
      onClick={onOpen}
      aria-current={current ? "true" : undefined}
      data-detail-row
    >
      <Monogram name={initialOf ?? given} />
      <span className="profile-header__text">
        <span className={given ? "profile-header__name" : "profile-header__name profile-header__name--empty"}>
          {given || noName}
        </span>
        {title?.trim() ? <span className="profile-header__title">{title.trim()}</span> : null}
      </span>
      <span className="settings-row__chevron">
        <Icon name="chevron" size={16} />
      </span>
    </button>
  );
}

export default ProfileHeader;
