import Link from "next/link";
import { HubChrome } from "@/components/layout/HubChrome";
import { registry } from "@/components/registry";
import { getBuiltConceptKeys } from "@/flows/registry";
import { SHOWROOM_ROOMS } from "@/lib/hub-pages";
import { readTokens } from "@/lib/tokens";

export const metadata = {
  title: "Showroom",
};

/**
 * The showroom's front page: the way in to its three rooms.
 *
 * Everything in the rooms is the real thing — tokens read from
 * `styles/tokens.css`, components imported from `components/`, flows rendered
 * from `flows/` — so a change made here is a change to the prototype itself.
 */
export default function ShowroomPage() {
  const counts: Record<string, string> = {
    "design-system": `${readTokens().length} tokens`,
    components: `${registry.length} components`,
    playground: `${getBuiltConceptKeys().length} built flows`,
  };

  return (
    <HubChrome
      page="showroom"
      intro={
        <p>
          Where ExecHQ is designed. Every room shows the real tokens, components
          and flows from this repo — not copies — on sample data. It runs on a
          laptop and on every pull request&apos;s preview link, and is never
          built into the public site.
        </p>
      }
    >
      <section className="hub__section" aria-labelledby="rooms-title">
        <h2 className="hub__section-title" id="rooms-title">
          Rooms
        </h2>
        <ul className="hub-tools">
          {SHOWROOM_ROOMS.map((room) => (
            <li key={room.key}>
              <Link href={room.href} className="hub-tools__card">
                <span className="hub-tools__card-title">{room.title}</span>
                <span className="hub-tools__card-description">{room.description}</span>
                <span className="hub-tools__card-count t-eyebrow">{counts[room.key]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </HubChrome>
  );
}
