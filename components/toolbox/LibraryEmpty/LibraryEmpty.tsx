import Link from "next/link";
import { Icon } from "@/components/primitives/Icon";
import { LIBRARY_COPY as C } from "@/mock/toolbox";

export interface LibraryEmptyProps {
  /** Her first action step, by title, and where it starts. */
  step: string;
  stepHref: string;
  className?: string;
}

/**
 * The library with nothing in it. Only someone who left onboarding before
 * saving ever sees it: anyone who finished has their statement here. It
 * points to her first action step, never to a blank page.
 */
export function LibraryEmpty({ step, stepHref, className }: LibraryEmptyProps) {
  return (
    <div className={["library-empty", className].filter(Boolean).join(" ")}>
      <p className="library-empty__heading">{C.empty.heading}</p>
      <p className="library-empty__body">{C.empty.body}</p>
      <Link href={stepHref} className="library-empty__step">
        <Icon name="compass" size={16} />
        <span>{step}</span>
        <Icon name="chevron" size={16} className="library-empty__go" />
      </Link>
    </div>
  );
}

export default LibraryEmpty;
