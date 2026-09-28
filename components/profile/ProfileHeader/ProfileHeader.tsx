import { Icon } from "@/components/primitives/Icon";
import { Monogram } from "@/components/primitives/Monogram";

export interface ProfileHeaderProps {
  /** Optional. Without it the card asks for one. */
  name?: string;
  email: string;
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
 * The top of the profile: the monogram, the name if there is one, and the
 * personal email. The whole card opens the account detail.
 */
export function ProfileHeader({ name, email, noName, onOpen, current, className }: ProfileHeaderProps) {
  const given = name?.trim();
  return (
    <button
      type="button"
      className={["profile-header", className].filter(Boolean).join(" ")}
      onClick={onOpen}
      aria-current={current ? "true" : undefined}
      data-detail-row
    >
      <Monogram name={given} />
      <span className="profile-header__text">
        <span className={given ? "profile-header__name" : "profile-header__name profile-header__name--empty"}>
          {given || noName}
        </span>
        <span className="profile-header__email">{email}</span>
      </span>
      <span className="settings-row__chevron">
        <Icon name="chevron" size={16} />
      </span>
    </button>
  );
}

export default ProfileHeader;
