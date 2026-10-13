import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRIEFING_COPY as C, publisherName, TODAYS_READS } from "@/mock/briefing";

/**
 * The prototype's stand-in for a read's article at its publisher, where
 * Briefing Concept 1 sends her in a new tab. Every publisher is invented, so
 * there is nowhere real to go: this page is deliberately not ExecHQ (no
 * chrome, no navigation), a plain article page with the publisher's name,
 * the headline and standfirst, and grey lines where the article would run.
 *
 * Not a product page, so not in the manifest. It follows the reviewer's
 * viewport, as the publisher's site would follow her phone.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return TODAYS_READS.map((read) => ({ read: read.id }));
}

const find = (id: string) => TODAYS_READS.find((read) => read.id === id);

export async function generateMetadata({ params }: { params: Promise<{ read: string }> }): Promise<Metadata> {
  const read = find((await params).read);
  return { title: read ? `${read.title} — ${publisherName(read.publisherId)}` : "Not found" };
}

const LINES = [100, 96, 98, 72, 0, 100, 94, 99, 97, 58, 0, 100, 92, 96, 81];

export default async function SourcePage({ params }: { params: Promise<{ read: string }> }) {
  const read = find((await params).read);
  if (!read) notFound();
  const publisher = publisherName(read.publisherId);

  return (
    <div className="source-page">
      <p className="source-page__note">{C.read.sourceNote(publisher)}</p>
      <header className="source-page__masthead">
        <p className="source-page__publisher">{publisher}</p>
      </header>
      <main id="main" className="source-page__article">
        <h1 className="source-page__title">{read.title}</h1>
        <p className="source-page__standfirst">{read.standfirst}</p>
        <p className="u-visually-hidden">{C.read.sourceBody}</p>
        <div className="source-page__body" aria-hidden="true">
          {LINES.map((width, i) =>
            width ? (
              <span key={i} className="source-page__line" style={{ width: `${width}%` }} />
            ) : (
              <span key={i} className="source-page__gap" />
            )
          )}
        </div>
      </main>
    </div>
  );
}
