import { notFound } from "next/navigation";
import { SpecDocument } from "@/components/hub/SpecDocument";
import { HubChrome } from "@/components/layout/HubChrome";
import { TextLink } from "@/components/primitives/TextLink";
import { HANDOFF_NOTES, getHandoffNote } from "@/lib/handoff-notes";

export const dynamicParams = false;

export function generateStaticParams() {
  return HANDOFF_NOTES.map((note) => ({ note: note.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ note: string }> }) {
  const note = getHandoffNote((await params).note);
  return { title: note ? `${note.title} — dev handoff` : "Dev handoff" };
}

/**
 * One dev handoff note, read from `handoff/<slug>.md` at build time and drawn
 * by the same renderer as the interaction specs and briefs. For the
 * developers, not a product page.
 */
export default async function HandoffNotePage({ params }: { params: Promise<{ note: string }> }) {
  const note = getHandoffNote((await params).note);
  if (!note) notFound();

  return (
    <HubChrome
      page="hub"
      bare
      title={`${note.title}: dev handoff`}
      intro={
        <p>
          <TextLink href="/#handoff" tone="standalone">
            Back to the file hub
          </TextLink>
        </p>
      }
    >
      {note.content ? (
        <SpecDocument source={note.content} />
      ) : (
        <p>
          Not written yet. It will live at <code>{note.path}</code>.
        </p>
      )}
    </HubChrome>
  );
}
