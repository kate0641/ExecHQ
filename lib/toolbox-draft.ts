/**
 * Thought Leadership Builder's drafts, made in the prototype without a model:
 * her words go in as hers, ExecHQ's framing goes round them, and anything only
 * she knows is a question. Nothing here invents a number, a name or a result.
 */

import { TODAYS_READS } from "@/mock/briefing";
import { READ_OPENINGS, TL_VERSIONS, type DraftSection, type DraftSegment } from "@/mock/toolbox";
import type { RevisionChoice } from "@/components/toolbox/RevisionControls/RevisionControls";

const you = (text: string): DraftSegment => ({ text, by: "you" });
const ex = (text: string): DraftSegment => ({ text, by: "exechq" });
const ask = (question: string): DraftSegment => ({ question });

const sentence = (text: string) => {
  const t = text.trim();
  return t ? (/[.!?”]$/.test(t) ? `${t} ` : `${t}. `) : "";
};

export interface DraftInputs {
  format?: string;
  topic?: string;
  pov?: string;
  example?: string;
  audience?: string;
  cta?: string;
}

/** "A post about what planning season taught me" → "What planning season
 *  taught me": the topic, without how she asked for it. */
function topicLine(topic: string): string {
  const t = topic.trim().replace(/^(an? )?(linkedin )?(post|article|piece|something)( to write)? (about|on) /i, "");
  return t ? t[0].toUpperCase() + t.slice(1) : "";
}

/** The first draft, from what she said and where she started. */
export function firstDraft(inputs: DraftInputs, readId?: string, passage?: string): DraftSection[] {
  const read = TODAYS_READS.find((r) => r.id === readId);
  // The Maya journey's read keeps the version in the mock, with her words in.
  const opening = read ? READ_OPENINGS[read.id] ?? `I read something this week that stayed with me: ${read.title}.` : sentence(topicLine(inputs.topic ?? ""));
  const post: DraftSegment[] = [
    ex(`${opening.trim()} `),
    ...(passage ? [ex(`One line stayed with me: “${passage}” `)] : []),
    ...(inputs.pov?.trim() ? [you(sentence(inputs.pov))] : [ask("What is your point of view?"), ex(" ")]),
    ...(inputs.example?.trim() ? [you(sentence(inputs.example))] : []),
    ex("What I have seen so far: "),
    ask(read?.id === "planning-season" ? "What has the workstream changed for those teams?" : "What changed because of it?"),
    ex(" "),
    inputs.cta?.trim() ? you(sentence(inputs.cta)) : ex("How does it work where you are?"),
  ];
  const hooks: DraftSection =
    read?.id === "planning-season"
      ? TL_VERSIONS[0].sections[1]
      : {
          id: "hooks",
          heading: "Other openings",
          list: true,
          segments: [
            ex(read ? `A line from ${read.title.toLowerCase()} I keep coming back to.` : "Something I have changed my mind about this year."),
            ex("I used to see this differently."),
            ex("A question I keep asking the people I work with."),
          ],
        };
  const sections: DraftSection[] = [{ id: "post", segments: post }, hooks];
  if (inputs.format && inputs.format !== "LinkedIn post") {
    sections.push({
      id: "outline",
      heading: inputs.format === "Long-form article" ? "Article outline" : "Short article outline",
      list: true,
      segments: [ex("Where scope is really decided"), ex("What I did about it"), ask("What would you tell someone a year behind you?"), ex("What to do before the next plan is written")],
    });
  }
  return sections;
}

/** What a revision says it changed: "Shorter, more direct". */
export function revisionLabel(choice: RevisionChoice, followUp: string): string {
  const parts = Object.values(choice).filter(Boolean) as string[];
  const words = parts.map((p, i) => (i === 0 ? p : p.toLowerCase())).join(", ");
  if (followUp) return words ? `${words}; “${followUp}”` : `“${followUp}”`;
  return words;
}

/** A revision, made without a model: shorter drops ExecHQ's framing but
 *  keeps her words and the questions; longer adds a question for her, never
 *  a fact; leading with her example moves it to the front. */
export function revise(sections: readonly DraftSection[], choice: RevisionChoice): DraftSection[] {
  return sections.map((section) => {
    if (section.id !== "post") return section;
    let segments = [...section.segments];
    const isEx = (s: DraftSegment) => "by" in s && s.by === "exechq";
    if (choice.length === "Shorter") {
      const firstEx = segments.findIndex(isEx);
      segments = segments.filter((s, i) => !isEx(s) || i === firstEx || i === segments.length - 1);
    }
    if (choice.length === "Longer") segments.splice(segments.length - 1, 0, ex(" Here is why it matters to me: "), ask("Why does this matter to you now?"), ex(" "));
    if (choice.emphasis === "My example") {
      const mine = segments.filter((s) => "by" in s && s.by === "you");
      segments = [...mine.slice(-1), ...segments.filter((s) => s !== mine[mine.length - 1])];
    }
    return { ...section, segments };
  });
}

/** The draft as plain text, to copy: her edits and answers in, unanswered
 *  questions left in brackets so nothing is lost. */
export function draftText(sections: readonly DraftSection[], edits: Record<string, string> = {}, answers: Record<string, string> = {}): string {
  return sections
    .map((section) => {
      if (edits[section.id]) return edits[section.id];
      const text = section.list
        ? section.segments.map((s) => `- ${"question" in s ? `[${s.question}]` : s.text}`).join("\n")
        : section.segments.map((s) => ("question" in s ? (answers[s.question] ? `${answers[s.question]} ` : `[${s.question}] `) : s.text)).join("").trim();
      return section.heading ? `${section.heading}\n${text}` : text;
    })
    .join("\n\n");
}
