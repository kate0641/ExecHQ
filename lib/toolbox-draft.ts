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
  // The main piece: the post, the pitch, or the first section of a brief.
  const main = sections.find((s) => s.id === "post" || s.id === "pitch")?.id ?? sections.find((s) => !s.list)?.id;
  return sections.map((section) => {
    if (section.id !== main) return section;
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

/* -----------------------------------------------------------------------------
   PITCH BUILDER
   -------------------------------------------------------------------------- */

/** A pitch, its subject lines, a short and an expanded version, the angle
 *  and why now, and the follow-up, all on the same artifact so the Loop shows
 *  one pitch with one history. */
export function pitchDraft(v: Record<string, string>): DraftSection[] {
  const angle = v.angle?.trim() ?? "";
  const target = v.target?.trim();
  const kind = (v.type || "Speaking").toLowerCase();
  const said = (text: string) => (text ? [you(sentence(text))] : []);
  const angleOrAsk = angle ? you(angle) : ask("What would you talk about?");
  return [
    {
      id: "subjects",
      heading: "Subject lines",
      list: true,
      segments: [
        angleOrAsk,
        ex(`A ${kind === "press" ? "story" : kind === "podcast" ? "conversation" : "session"} idea${target ? ` for ${target}` : ""}`),
        ex("From someone doing the work, not watching it"),
      ],
    },
    {
      id: "pitch",
      heading: "Pitch",
      segments: [
        ex("Hi "),
        ask("Who are you writing to?"),
        ex(`, I’d like to suggest ${kind === "podcast" ? "a conversation" : kind === "press" ? "a story" : "a session"}${target ? ` for ${target}` : ""} on `),
        angleOrAsk,
        ex(". "),
        ...said(v.proof ?? ""),
        ex("It matters now because "),
        ask("Why does this matter to their audience this month?"),
        ex(" I can send a short outline."),
      ],
    },
    {
      id: "expanded",
      heading: "Expanded version",
      segments: [
        ex("The three points I’d cover: "),
        ask("What are the three points you would cover?"),
        ex(" "),
        ...said(v.links ?? ""),
        ex("I can work to your format and length."),
      ],
    },
    {
      id: "angle",
      heading: "Angle and why now",
      segments: [angleOrAsk, ex(". Why now: "), ask("What makes this timely?")],
    },
    {
      id: "follow-up",
      heading: "Follow-up, if you hear nothing in a week",
      segments: [ex("Hi, following up on my note about "), angleOrAsk, ex(". Happy to fit your schedule, or to suggest someone else on my team if the timing is wrong.")],
    },
  ];
}

/* -----------------------------------------------------------------------------
   SITUATION BRIEF
   -------------------------------------------------------------------------- */

/** One page for a moment that matters: objective, context, key messages,
 *  evidence, likely questions and the decision asked for; then the opening
 *  statement and the follow-up email. */
export function briefDraft(v: Record<string, string>, when?: string): DraftSection[] {
  const objective = v.objective?.trim();
  const audience = v.audience?.trim();
  const evidence = v.evidence?.trim();
  return [
    { id: "objective", heading: "Objective", segments: [objective ? you(sentence(objective)) : ask("What do you want to come out of it?")] },
    {
      id: "context",
      heading: "Context",
      segments: [
        ex(`${v.type ? v.type[0].toUpperCase() + v.type.slice(1) : "The meeting"}${when ? ` ${when}` : ""}, with `),
        audience ? you(audience) : ask("Who will be there?"),
        ex(". "),
        ask("What has happened so far that they need to know?"),
      ],
    },
    {
      id: "messages",
      heading: "Key messages",
      list: true,
      segments: [ex("Where things stand, in a sentence"), ex("What you are asking for, and why you"), ask("What is the one thing they must remember?")],
    },
    {
      id: "evidence",
      heading: "Supporting evidence",
      list: true,
      segments: evidence ? [you(evidence), ask("Is there a result you can point to?")] : [ask("What result can you point to?"), ask("Who else would back this up?")],
    },
    {
      id: "questions",
      heading: "Likely questions",
      list: true,
      segments: [ex("What does this take from your current work?"), ex("Why now, and not next quarter?"), ex("Who else is affected?")],
    },
    {
      id: "decision",
      heading: "Decision or next step asked for",
      segments: objective ? [ex("I’d like us to agree: "), you(sentence(objective))] : [ask("What decision or next step do you want?")],
    },
    {
      id: "opening",
      heading: "Opening statement",
      segments: [ex("Thank you for the time. I’d like to leave today with one thing agreed: "), objective ? you(sentence(objective)) : ask("What do you want agreed?")],
    },
    {
      id: "email",
      heading: "Follow-up email",
      segments: [ex("Thank you for today. As we agreed, "), ask("What did you agree?"), ex(" I’ll come back to you by "), ask("When?"), ex(".")],
    },
  ];
}

/* -----------------------------------------------------------------------------
   POSITIONING BUILDER
   -------------------------------------------------------------------------- */

const INTRO_OPENINGS: Record<string, string> = {
  "A promotion conversation": "I’d like to talk about what comes next for me. ",
  "An executive introduction": "Thank you for making the time. ",
  "A conference program": "",
};

/** Her statement, carried from onboarding, then bios in three lengths, the
 *  leadership narrative, an introduction for the moment she chose, and what
 *  to use it for next. Bios use her name, never a pronoun ExecHQ assumed. */
export function positioningDraft(v: Record<string, string>, name: string): DraftSection[] {
  const first = name.split(" ")[0] || name;
  const statement = v.statement?.trim();
  const role = v.role?.trim();
  const known = v.knownFor?.trim();
  const toward = v.toward?.trim();
  const wins = v.wins?.trim();
  const strengths = v.strengths?.trim();
  const roleSeg = role ? you(role) : ask("What is your role?");
  // Mid-sentence, her words take a small first letter, unless they start with
  // "I" or a name in capitals ("CRM", "EMEA").
  const midSentence = (t: string) => (/^[A-Z][a-z]/.test(t) && !/^I\b/.test(t) ? t[0].toLowerCase() + t.slice(1) : t).replace(/[.]$/, "");
  const knownSeg = known ? you(midSentence(known)) : ask("What are you known for?");

  const short: DraftSegment[] = [you(name), ex(" is "), roleSeg, ex(", known for "), knownSeg, ex(". ")];
  const medium: DraftSegment[] = [
    ...short,
    ex(`${first} is building toward `),
    toward ? you(midSentence(toward)) : ask("Where are you headed?"),
    ex(". "),
    wins ? you(sentence(wins.split("\n")[0])) : ask("Which result would you put in the second line?"),
  ];
  const long: DraftSegment[] = [
    ...medium,
    ex(" "),
    ...(wins && wins.split("\n").length > 1 ? [you(sentence(wins.split("\n").slice(1).join(" ")))] : []),
    ...(strengths ? [ex("Colleagues name "), you(strengths.replace(/[.]$/, "")), ex(" as what they rely on. ")] : []),
    ...(statement ? [ex(`In ${first}’s words: “`), you(statement.replace(/\s+$/, "")), ex("” ")] : []),
    ask("What came before your current role?"),
    ex(" "),
    ask("Anything you’d like people to know outside work?"),
  ];

  const sections: DraftSection[] = [
    { id: "statement", heading: "Positioning statement", segments: [statement ? you(statement) : ask("What is your positioning statement?")] },
    { id: "bio-short", heading: "Short bio", segments: short },
    { id: "bio-medium", heading: "Medium bio", segments: medium },
    { id: "bio-long", heading: "Long bio", segments: long },
    {
      id: "narrative",
      heading: "Leadership narrative",
      segments: [...(statement ? [you(sentence(statement))] : []), ex("What I do: "), roleSeg, ex(". What I am known for: "), knownSeg, ex(". What I am building toward: "), toward ? you(toward.replace(/[.]$/, "")) : ask("Where are you headed?"), ex(".")],
    },
  ];
  if (v.context) {
    sections.push({
      id: "intro",
      heading: `Introduction for ${v.context.replace(/^(a|an) /i, "").toLowerCase()}`,
      segments:
        v.context === "A conference program"
          ? [...short, ex(`${first} will speak on `), ask("What is the session about?")]
          : [ex(INTRO_OPENINGS[v.context] ?? ""), ...(statement ? [you(sentence(statement))] : []), ex("I’m known for "), knownSeg, ex(", and I’m building toward "), toward ? you(toward.replace(/[.]$/, "")) : ask("Where are you headed?"), ex(".")],
    });
  }
  sections.push({ id: "next-use", heading: "Recommended next use", segments: [ex("Use the short bio wherever you are introduced, and the narrative to open your next conversation about scope.")] });
  return sections;
}

/** The statement alone, as onboarding left it: the artifact's first version. */
export function statementOnly(statement: string): DraftSection[] {
  return [{ id: "statement", heading: "Positioning statement", segments: [you(statement)] }];
}
