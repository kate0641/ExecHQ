/**
 * Thought Leadership Builder's drafts, made in the prototype without a model:
 * her words go in as hers, ExecHQ's framing goes round them, and anything only
 * she knows is a question. Nothing here invents a number, a name or a result.
 */

import { TODAYS_READS } from "@/mock/briefing";
import { OUTLET_COPY, READ_OPENINGS, TL_VERSIONS, outletFor, type DraftSection, type DraftSegment } from "@/mock/playbook";
import type { RevisionChoice } from "@/components/playbook/RevisionControls/RevisionControls";

const you = (text: string): DraftSegment => ({ text, by: "you" });
const ex = (text: string): DraftSegment => ({ text, by: "exechq" });
const ask = (question: string): DraftSegment => ({ question });

const sentence = (text: string) => {
  const t = text.trim();
  return t ? (/[.!?”]$/.test(t) ? `${t} ` : `${t}. `) : "";
};

/** Her words inside a sentence: a small first letter, unless they start with
 *  "I" or a name in capitals ("CRM", "EMEA"), and no full stop of their own. */
const midSentence = (t: string) => (/^[A-Z][a-z]/.test(t) && !/^I\b/.test(t) ? t[0].toLowerCase() + t.slice(1) : t).replace(/[.]$/, "");

export interface DraftInputs {
  format?: string;
  topic?: string;
  pov?: string;
  example?: string;
  audience?: string;
  cta?: string;
  evidence?: string;
  voice?: string;
  length?: string;
}

/** "A post about what planning season taught me" → "What planning season
 *  taught me": the topic, without how she asked for it. */
function topicLine(topic: string): string {
  const t = topic.trim().replace(/^(an? )?(linkedin )?(post|article|piece|something)( to write)? (about|on) /i, "");
  return t ? t[0].toUpperCase() + t.slice(1) : "";
}

/** ExecHQ's closing line when she gives no call to action, by voice. */
const CLOSE_BY_VOICE: Record<string, string> = {
  Plainer: "How does it work where you are?",
  Warmer: "I’d love to hear how it works where you are.",
  "More direct": "What would you do?",
};

/** The closing line by who it is for (a revision for audience). */
const CLOSE_BY_AUDIENCE: Record<string, string> = {
  Peers: "How does it work where you are?",
  "Senior leaders": "If you lead a function, what would you want your teams to know?",
  "My team": "What would you add?",
};

/** The opening, by voice, from her topic. A read keeps its own opening. */
function openingFor(topic: string, voice?: string): string {
  const t = topicLine(topic);
  if (!t) return "";
  if (voice === "Warmer") return `Something I’ve been thinking about: ${midSentence(t)}.`;
  if (voice === "More direct") return `Here is what I think about ${midSentence(t)}.`;
  return sentence(t).trim();
}

/** What to do with it next, and after: when and how to publish, the plan
 *  step it serves, and that ExecHQ will ask how it landed. */
function nextUse(article: boolean, nextStep?: string): DraftSection {
  const parts = [
    article
      ? "Publish it as a LinkedIn article, with a short post that links to it."
      : "Post it on a weekday morning, and reply to comments the same day.",
    nextStep ? `It serves your next step: ${nextStep[0].toLowerCase()}${nextStep.slice(1)}.` : "",
    "When someone responds, answer in your own words. ExecHQ will ask how it landed in a week.",
  ].filter(Boolean);
  return { id: "next-use", heading: "Recommended next use", segments: [ex(parts.join(" "))] };
}

/** The first draft, from what she said and where she started: a post, or an
 *  article when she chose one, then what to do with it. Her voice sets
 *  ExecHQ's opening and closing lines; her length applies the same rules as
 *  Shorter and Longer. Evidence she gives fills "What I have seen so far";
 *  without it, that stays a question for her. */
export function firstDraft(inputs: DraftInputs, readId?: string, passage?: string, nextStep?: string): DraftSection[] {
  const read = TODAYS_READS.find((r) => r.id === readId);
  const article = Boolean(inputs.format && inputs.format !== "LinkedIn post");
  // The Maya journey's read keeps the version in the mock, with her words in.
  const opening = read ? READ_OPENINGS[read.id] ?? `I read something this week that stayed with me: ${read.title}.` : openingFor(inputs.topic ?? "", inputs.voice);
  const pov: DraftSegment = inputs.pov?.trim() ? you(sentence(inputs.pov)) : ask("What is your point of view?");
  const evidence: DraftSegment = inputs.evidence?.trim()
    ? you(sentence(inputs.evidence))
    : ask(read?.id === "planning-season" ? "What has the workstream changed for those teams?" : "What changed because of it?");
  const close: DraftSegment = inputs.cta?.trim() ? you(sentence(inputs.cta)) : ex(CLOSE_BY_VOICE[inputs.voice ?? ""] ?? "How does it work where you are?");
  const part = (name: string, segments: DraftSegment[]): DraftSegment[] => segments.map((seg) => ({ ...seg, part: name }));

  let sections: DraftSection[];
  if (!article) {
    const post: DraftSegment[] = [
      ...part("opening", [ex(`${opening.trim()} `)]),
      ...part("passage", passage ? [ex(`One line stayed with me: “${passage}” `)] : []),
      ...part("pov", [pov, ex(" ")]),
      ...part("example", inputs.example?.trim() ? [you(sentence(inputs.example))] : []),
      ...part("seen", [ex("What I have seen so far: "), evidence, ex(" ")]),
      ...part("close", [close]),
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
    sections = [{ id: "post", segments: post }, hooks];
  } else {
    const subject = topicLine(inputs.topic ?? "") || (read ? read.title : "");
    const long = inputs.format === "Long-form article";
    sections = [
      {
        id: "headlines",
        heading: "Headline options",
        list: true,
        segments: subject
          ? // Her subject first, then two built on the end of it, so any topic reads ("…: what I would do again").
            [you(subject), ex(`${subject}: what I would do again`), ex(`${subject}, in three lessons`)]
          : [ask("What is the article about, in a line?")],
      },
      {
        id: "intro",
        heading: "Introduction",
        segments: [...part("opening", [ex(`${opening.trim()} `)]), ...part("passage", passage ? [ex(`One line stayed with me: “${passage}” `)] : []), ...part("pov", [pov])],
      },
      {
        id: "idea",
        heading: "The idea",
        segments: [ex("Here is why I hold this view. "), ask("Why do you hold this view?")],
      },
      {
        id: "seen",
        heading: "What I have seen",
        segments: [...(inputs.example?.trim() ? [you(sentence(inputs.example))] : [ask("What is one example from your own work?")]), ex(" "), evidence],
      },
      ...(long
        ? [
            {
              id: "hard",
              heading: "Where it gets hard",
              segments: [ex("The strongest argument against this: "), ask("What is the strongest argument against your view?"), ex(" "), ask("How do you answer it?")],
            },
          ]
        : []),
      {
        id: "do",
        heading: "What to do about it",
        segments: [inputs.cta?.trim() ? you(sentence(inputs.cta)) : ask("What should a reader do differently?")],
      },
      // ExecHQ's closing line by voice; her call to action is already in "What to do about it".
      ...(long ? [{ id: "closing", heading: "Closing", segments: [...part("close", [ex(CLOSE_BY_VOICE[inputs.voice ?? ""] ?? "How does it work where you are?")])] }] : []),
    ];
  }
  sections.push(nextUse(article, nextStep));
  // Her length, applied as a first revision would.
  if (inputs.length === "Short") sections = reviseThought(sections, { length: "Shorter" });
  if (inputs.length === "Long") sections = reviseThought(sections, { length: "Longer" });
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
  if (sections.some((x) => x.id === "bio-short")) return revisePositioning(sections, choice);
  if (sections.some((x) => x.id === "pitch") && sections.some((x) => x.id === "subjects")) return revisePitch(sections, choice);
  if (sections.some((x) => x.id === "objective") && sections.some((x) => x.id === "decision")) return reviseBrief(sections, choice);
  if (sections.some((x) => x.id === "post" || x.id === "intro")) return reviseThought(sections, choice);
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

/** The narrative's three parts, by the label ExecHQ gave each. */
const NARRATIVE_PARTS = [
  { key: "do", label: "What I do: ", emphasis: "What I lead" },
  { key: "known", label: "What I am known for: ", emphasis: "What I’m known for" },
  { key: "toward", label: "What I am building toward: ", emphasis: "Where I’m headed" },
] as const;

/** Positioning Builder's revisions act on the bios and the narrative, never
 *  on her statement: shorter takes the long and medium bios' open questions
 *  out; longer adds a question for her to the long bio and the narrative,
 *  never a fact; emphasis puts that part of the narrative first. */
function revisePositioning(sections: readonly DraftSection[], choice: RevisionChoice): DraftSection[] {
  const isAsk = (seg: DraftSegment) => "question" in seg;
  return sections.map((section) => {
    let segments = [...section.segments];
    if (section.id === "narrative" && choice.emphasis) {
      const labelAt = (key: string) => segments.findIndex((seg) => "text" in seg && seg.text.includes(NARRATIVE_PARTS.find((p) => p.key === key)!.label.trim()));
      const starts = NARRATIVE_PARTS.map((p) => labelAt(p.key));
      if (starts.every((i) => i >= 0)) {
        // A narrative revised before may already be in another order.
        const lead = segments.slice(0, Math.min(...starts));
        const parts = NARRATIVE_PARTS.map((p, i) => ({ ...p, value: segments[starts[i] + 1] }));
        const tail = segments.slice(Math.max(...starts) + 2);
        const first = parts.find((p) => p.emphasis === choice.emphasis);
        const ordered = first ? [first, ...parts.filter((p) => p !== first)] : parts;
        segments = [
          ...lead,
          ...ordered.flatMap((p, i) => [ex(`${i === 0 ? "" : ". "}${p.label}`), p.value]),
          ...tail,
        ];
      }
    }
    if (choice.length === "Shorter" && (section.id === "bio-long" || section.id === "bio-medium")) {
      segments = segments.filter((seg) => !isAsk(seg));
    }
    if (choice.length === "Longer") {
      if (section.id === "bio-long") segments.push(ex(" "), ask("Which decision are you proudest of, and why?"));
      if (section.id === "narrative") segments.push(ex(" Why it matters to me: "), ask("Why does this direction matter to you?"));
    }
    return { ...section, segments };
  });
}

/** Thought Leadership's revisions keep every sentence whole.
 *  - Shorter: a post loses the quoted line and an unanswered "What I have
 *    seen so far"; an article loses "The idea" and "Where it gets hard".
 *  - Longer: asks why it matters to her, never adds a fact.
 *  - Voice and audience: change ExecHQ's closing line (never hers).
 *  - Emphasis: My example or The article's point comes straight after the
 *    opening; The question at the end opens the post as well as closing it. */
function reviseThought(sections: readonly DraftSection[], choice: RevisionChoice): DraftSection[] {
  const isAsk = (seg: DraftSegment) => "question" in seg;
  const isEx = (seg: DraftSegment) => "by" in seg && seg.by === "exechq";
  let out = sections.map((section) => {
    let segments = [...section.segments];
    const of = (name: string) => segments.filter((seg) => seg.part === name);
    // ExecHQ's own closing line, re-said for the voice or audience asked for.
    const newClose = (choice.audience && CLOSE_BY_AUDIENCE[choice.audience]) || (choice.voice && CLOSE_BY_VOICE[choice.voice]);
    if (newClose) segments = segments.map((seg) => (seg.part === "close" && isEx(seg) ? { ...seg, text: newClose } : seg));
    if (section.id === "post") {
      if (choice.emphasis === "My example" || choice.emphasis === "The article’s point") {
        const lead = choice.emphasis === "My example" ? "example" : "passage";
        segments = ["opening", lead, ...["passage", "pov", "example", "seen", "close"].filter((p) => p !== lead)].flatMap(of);
      }
      if (choice.emphasis === "The question at the end") {
        const q = of("close")[0];
        if (q && "text" in q) segments = [...of("opening"), { ...q, part: "lead-question", text: `${q.text} ` }, ...segments.filter((seg) => seg.part !== "opening")];
      }
      if (choice.length === "Shorter") {
        const seen = of("seen");
        segments = segments.filter((seg) => seg.part !== "passage" && !(seg.part === "seen" && seen.some(isAsk)));
      }
      if (choice.length === "Longer") {
        const at = segments.findIndex((seg) => seg.part === "close");
        segments.splice(at < 0 ? segments.length : at, 0, ...[ex("Here is why it matters to me: "), ask("Why does this matter to you now?"), ex(" ")].map((seg) => ({ ...seg, part: "why" })));
      }
    }
    return { ...section, segments };
  });
  const article = out.some((x) => x.id === "intro");
  // An article keeps its headlines, introduction, what she has seen, what to
  // do and the next use; the explaining sections go.
  if (article && choice.length === "Shorter") out = out.filter((x) => !["idea", "hard", "why-me"].includes(x.id));
  if (article && choice.length === "Longer") {
    const at = out.findIndex((x) => x.id === "do");
    out.splice(at < 0 ? out.length : at, 0, { id: "why-me", heading: "Why it matters to me", segments: [ask("Why does this matter to you now?")] });
  }
  return out;
}

/** Which section each Situation Brief emphasis brings up under the objective. */
const BRIEF_EMPHASIS: Record<string, string> = { "The ask": "decision", "The evidence": "evidence", "The risks": "questions" };

/** The Situation Brief's revisions keep it to one page: shorter keeps two key
 *  messages and two likely questions (her own risks first); longer adds a
 *  question to each, never a fact; emphasis moves the ask, the evidence or
 *  the likely questions up, straight under the objective. */
function reviseBrief(sections: readonly DraftSection[], choice: RevisionChoice): DraftSection[] {
  let out = sections.map((section) => {
    let segments = [...section.segments];
    if (choice.length === "Shorter" && section.id === "messages") segments = segments.slice(0, 2);
    if (choice.length === "Shorter" && section.id === "questions") {
      const hers = segments.filter((seg) => "by" in seg && seg.by === "you");
      segments = segments.slice(0, Math.max(2, hers.length));
    }
    if (choice.length === "Longer" && section.id === "messages") segments.push(ask("What would change their mind?"));
    if (choice.length === "Longer" && section.id === "questions") segments.push(ex("What happens if we wait?"));
    return { ...section, segments };
  });
  const up = choice.emphasis ? BRIEF_EMPHASIS[choice.emphasis] : undefined;
  if (up) {
    const moved = out.find((x) => x.id === up);
    if (moved) {
      out = out.filter((x) => x !== moved);
      out.splice(out.findIndex((x) => x.id === "objective") + 1, 0, moved);
    }
  }
  return out;
}

/** Pitch Builder's revisions keep every sentence whole: shorter drops the
 *  offer of an outline and the expanded version's closing line; longer asks
 *  for a second proof point, never invents one; emphasis puts the proof or
 *  why now straight after the greeting. */
function revisePitch(sections: readonly DraftSection[], choice: RevisionChoice): DraftSection[] {
  return sections.map((section) => {
    let segments = [...section.segments];
    if (section.id === "pitch") {
      const of = (name: string) => segments.filter((seg) => seg.part === name);
      if (choice.emphasis === "The proof" || choice.emphasis === "Why now") {
        const lead = choice.emphasis === "The proof" ? "proof" : "why-now";
        const order = ["greeting", lead, "ask", ...["proof", "why-now"].filter((p) => p !== lead), "close"];
        segments = order.flatMap(of);
      } else if (choice.emphasis === "The angle") {
        segments = ["greeting", "ask", "proof", "why-now", "close"].flatMap(of);
      }
      // Straight after "Hi …, " a sentence of ExecHQ's starts small ("it matters now").
      const after = segments.findIndex((seg) => seg.part !== "greeting");
      const next = segments[after];
      if (next && "by" in next && next.by === "exechq" && /^[A-Z][a-z]/.test(next.text) && !/^I[’' ]/.test(next.text)) {
        segments[after] = { ...next, text: next.text[0].toLowerCase() + next.text.slice(1) };
      }
      if (choice.length === "Shorter") segments = segments.filter((seg) => seg.part !== "close");
      if (choice.length === "Longer") {
        const close = segments.findIndex((seg) => seg.part === "close");
        const more: DraftSegment[] = [ex("I can also point to "), ask("What else can you prove?"), ex(". ")].map((seg) => ({ ...seg, part: "proof" }));
        segments.splice(close < 0 ? segments.length : close, 0, ...more);
      }
    }
    if (section.id === "expanded" && choice.length === "Shorter") {
      segments = segments.filter((seg) => !("text" in seg && seg.text === "I can work to your format and length."));
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
  const role = v.role?.trim();
  const statement = v.statement?.trim();
  const audience = v.audience?.trim();
  const proof = v.proof?.trim() ?? "";
  const kind = (v.type || "Speaking").toLowerCase();
  const what = kind === "podcast" ? "a conversation" : kind === "press" ? "a story" : "a session";
  const said = (text: string) => (text ? [you(sentence(text))] : []);
  const angleOrAsk = angle ? you(angle) : ask("What would you talk about?");
  // Mid-sentence ("…a conversation on how planning…"), her angle fits the sentence.
  const angleMid = angle ? you(midSentence(angle)) : ask("What would you talk about?");
  const whyNow = audience ? `Why does this matter to ${midSentence(audience)} this month?` : "Why does this matter to their audience this month?";
  const part = (name: string, segments: DraftSegment[]): DraftSegment[] => segments.map((seg) => ({ ...seg, part: name }));
  return fitOutlet(target, [
    {
      id: "subjects",
      heading: "Subject lines",
      list: true,
      segments: [angleOrAsk, ex(`A ${what.slice(2)} idea${target ? ` for ${target}` : ""}`), ex("From someone doing the work, not watching it")],
    },
    {
      id: "pitch",
      heading: "Pitch",
      // Each sentence is a part, so emphasis can move the proof or why now up.
      segments: [
        ...part("greeting", [ex("Hi "), ask("Who are you writing to?"), ex(", ")]),
        ...part("ask", [
          ...(role ? [ex("I’m "), you(role.replace(/[.]$/, "")), ex(", and I’d like")] : [ex("I’d like")]),
          ex(` to suggest ${what}${target ? ` for ${target}` : ""} on `),
          angleMid,
          ...(audience ? [ex(", for "), you(midSentence(audience))] : []),
          ex(". "),
        ]),
        ...part("proof", said(proof)),
        ...part("why-now", [ex("It matters now because "), ask(whyNow), ex(" ")]),
        ...part("close", [ex("I can send a short outline.")]),
      ],
    },
    {
      id: "short",
      heading: "Short version, for a message or a speaker form",
      segments: [angleOrAsk, ex(". "), proof ? you(sentence(firstSentence(proof))) : ask("What can you prove, in a line?")],
    },
    {
      id: "expanded",
      heading: "Expanded version",
      segments: [
        ex("About me: "),
        statement ? you(sentence(statement)) : ask("Why are you the person to say this?"),
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
      segments: [ex("Hi, following up on my note about "), angleMid, ex(". Happy to fit your schedule, or to suggest someone else on my team if the timing is wrong.")],
    },
  ]);
}

/** Words in a section, her words and ExecHQ's, leaving out its questions. */
export function wordCount(section: DraftSection): number {
  return section.segments
    .map((seg) => ("text" in seg ? seg.text : ""))
    .join("")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** The draft fits their ask (Kate, 14 Oct): where the part the outlet limits
 *  runs over, it says so as a question at its end, never by cutting her words. */
function fitOutlet(target: string | undefined, sections: DraftSection[]): DraftSection[] {
  const limit = outletFor(target)?.ask?.limit;
  if (!limit) return sections;
  return sections.map((section) => {
    if (section.id !== limit.part) return section;
    const words = wordCount(section);
    return words > limit.words ? { ...section, segments: [...section.segments, ex(" "), ask(OUTLET_COPY.overLimit(limit.words, words))] } : section;
  });
}

/* -----------------------------------------------------------------------------
   SITUATION BRIEF
   -------------------------------------------------------------------------- */

/** One page for a moment that matters: objective, context, key messages,
 *  evidence, likely questions and the decision asked for; then the opening
 *  statement and the follow-up email. */
/** One of her risks as a question to prepare for. */
function riskQuestion(risk: string): string {
  const r = risk.trim().replace(/[.]$/, "");
  return /\?$/.test(r) ? r : `What if ${midSentence(r)}?`;
}

export function briefDraft(v: Record<string, string>, when?: string): DraftSection[] {
  const objective = v.objective?.trim();
  const audience = v.audience?.trim();
  const evidence = v.evidence?.trim();
  const stakes = v.stakes?.trim();
  const statement = v.statement?.trim();
  const risks = (v.risks ?? "").split(/\n+/).map((r) => r.trim()).filter(Boolean);
  const moment = !v.type || v.type === "Something else" ? "The meeting" : v.type[0].toUpperCase() + v.type.slice(1);
  return [
    { id: "objective", heading: "Objective", segments: [objective ? you(sentence(objective)) : ask("What do you want to come out of it?")] },
    {
      id: "context",
      heading: "Context",
      segments: [
        ex(`${moment}${when ? ` ${when}` : ""}, with `),
        audience ? you(midSentence(audience)) : ask("Who will be there?"),
        ex(". "),
        // What they care about, from her: the PRD's stakeholder context.
        ...(stakes ? [ex("They care about "), you(midSentence(stakes)), ex(". ")] : []),
        ask("What has happened so far that they need to know?"),
      ],
    },
    {
      id: "messages",
      heading: "Key messages",
      list: true,
      segments: [
        ex("Where things stand, in a sentence"),
        ex(stakes ? "What you are asking for, and how it serves what they care about" : "What you are asking for, and why you"),
        ask("What is the one thing they must remember?"),
      ],
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
      // Her own risks first, as questions to prepare for, then ExecHQ's.
      segments: [
        ...risks.map((r) => you(riskQuestion(r))),
        ex("What does this take from your current work?"),
        ex("Why now, and not next quarter?"),
        ex("Who else is affected?"),
      ],
    },
    {
      id: "decision",
      heading: "Decision or next step asked for",
      // Her outcome as she put it: the heading already says it is the ask, so
      // no lead-in that her words would have to fit grammatically.
      segments: objective ? [you(sentence(objective))] : [ask("What decision or next step do you want?")],
    },
    {
      id: "opening",
      heading: "Opening statement",
      // Her positioning statement, in her words, says where she is coming from
      // before the ask.
      segments: [
        ex("Thank you for the time. "),
        ...(statement ? [you(sentence(statement))] : []),
        ex("By the end of today, I’m hoping for one outcome: "),
        objective ? you(midSentence(objective)) : ask("What do you want agreed?"),
        ...(objective ? [ex(".")] : []),
      ],
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

/** Which bio suits where she'll use it first. */
const BIO_FOR_FORMAT: Record<string, { label: string }> = {
  "LinkedIn About section": { label: "long bio" },
  "A speaker bio": { label: "medium bio" },
  "An internal profile": { label: "short bio" },
  "An email introduction": { label: "short bio" },
};

/** The long bio's last question, by who it is mainly for. */
const AUDIENCE_QUESTION: Record<string, string> = {
  "Senior leaders where I work": "Which result would your leadership remember you for?",
  "An external audience": "Where have you spoken or been published?",
  "Recruiters and boards": "Which decision best shows your judgment?",
};

/** A pasted bio's first sentence, for what came before her current role. */
function firstSentence(text: string): string {
  const t = text.trim().split(/\n/)[0] ?? "";
  const m = t.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : t).trim();
}

/** The version made for where she'll use it first (CEO, 19 Oct; the wording
 *  is proposed): its heading, and what it says from what she gave. */
function formatVersion(format: string, p: { name: string; first: string; roleSeg: DraftSegment; knownSeg: DraftSegment; toward?: string; win?: string }): DraftSection | undefined {
  const towardSeg = p.toward ? you(p.toward.replace(/[.]$/, "")) : ask("Where are you headed?");
  const segments: Record<string, DraftSegment[]> = {
    // First person and longer: what she leads, a result, where she is headed.
    "LinkedIn About section": [
      ex("I’m "), p.roleSeg, ex(". I’m known for "), p.knownSeg, ex(". "),
      ...(p.win ? [you(sentence(p.win)), ex(" ")] : [ask("Which result would you lead with?"), ex(" ")]),
      ex("What I’m building toward: "), towardSeg, ex(". If that’s work you care about, I’d like to hear from you."),
    ],
    // Third person, about 100 words, ending with what she speaks on.
    "A speaker bio": [you(p.name), ex(" is "), p.roleSeg, ex(", known for "), p.knownSeg, ex(". "), ...(p.win ? [you(sentence(p.win)), ex(" ")] : []), ex(`${p.first} speaks on `), ask("What do you speak about?"), ex(".")],
    // First person: the medium bio, plus what she is focused on now.
    "An internal profile": [ex("I’m "), p.roleSeg, ex(", known for "), p.knownSeg, ex(". I’m building toward "), towardSeg, ex(". This quarter I’m focused on "), ask("What are you focused on this quarter?"), ex(".")],
    // A short third-person paragraph someone can forward.
    "An email introduction": [ex("I’d like to introduce "), you(p.name), ex(", "), p.roleSeg, ex(". "), ex(`${p.first} is known for `), p.knownSeg, ex(", and is building toward "), towardSeg, ex(". I think you’d have a lot to talk about.")],
  };
  if (!segments[format]) return undefined;
  const heading: Record<string, string> = {
    "LinkedIn About section": "For your LinkedIn About section",
    "A speaker bio": "For your speaker bio",
    "An internal profile": "For your internal profile",
    "An email introduction": "For an email introduction",
  };
  return { id: "format", heading: heading[format], segments: segments[format] };
}

/** Her statement, carried from onboarding, then bios in three lengths, the
 *  leadership narrative, an introduction for each moment she chose (CEO, 19
 *  Oct: more than one), a version for where she'll use it first, and what to
 *  use it for next. Bios use her name, never a pronoun ExecHQ assumed.
 *
 *  The PRD's optional inputs each change something: who it is mainly for
 *  sets the long bio's last question; where she'll use it first adds a
 *  version made for it and names it in the next use; a bio she pasted is
 *  read whole (CEO, 19 Oct): its first sentence answers "What came before
 *  your current role?" and the rest goes into the long bio as her words.
 *  The next use points at her plan's next step. */
export function positioningDraft(v: Record<string, string>, name: string, nextStep?: string): DraftSection[] {
  const first = name.split(" ")[0] || name;
  const statement = v.statement?.trim();
  const role = v.role?.trim();
  const known = v.knownFor?.trim();
  const toward = v.toward?.trim();
  const wins = v.wins?.trim();
  const strengths = v.strengths?.trim();
  const source = v.source?.trim();
  const before = source ? firstSentence(source) : "";
  // The rest of what she pasted, as she wrote it.
  const rest = source ? source.slice(source.indexOf(before) + before.length).replace(/\s+/g, " ").trim() : "";
  const format = v.format?.trim();
  const audience = v.audience?.trim();
  const roleSeg = role ? you(role) : ask("What is your role?");
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
    before ? you(sentence(before)) : ask("What came before your current role?"),
    ex(" "),
    ...(rest ? [you(sentence(rest))] : []),
    ask(AUDIENCE_QUESTION[audience ?? ""] ?? "Anything you’d like people to know outside work?"),
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
  // One introduction for each moment she chose, kept one a line.
  const contexts = (v.context ?? "").split("\n").map((c) => c.trim()).filter(Boolean);
  contexts.forEach((context, i) => {
    sections.push({
      id: i === 0 ? "intro" : `intro-${i + 1}`,
      heading: `Introduction for ${context.replace(/^(a|an) /i, "").toLowerCase()}`,
      segments:
        context === "A conference program"
          ? [...short, ex(`${first} will speak on `), ask("What is the session about?")]
          : [ex(INTRO_OPENINGS[context] ?? ""), ...(statement ? [you(sentence(statement))] : []), ex("I’m known for "), knownSeg, ex(", and I’m building toward "), toward ? you(toward.replace(/[.]$/, "")) : ask("Where are you headed?"), ex(".")],
    });
  });
  const made = format ? formatVersion(format, { name, first, roleSeg, knownSeg, toward, win: wins?.split("\n")[0] }) : undefined;
  if (made) sections.push(made);
  const bio = format ? BIO_FOR_FORMAT[format] : undefined;
  const nextUse = [
    // "A speaker bio" → "your speaker bio"; "LinkedIn About section" keeps its capital.
    made ? `Start with the version made for your ${format!.replace(/^(a|an) /i, "")}.` : bio ? `Start with the ${bio.label} for your ${format!.replace(/^(a|an) /i, "")}.` : "Use the short bio wherever you are introduced.",
    nextStep ? `Then use the narrative for your next step: ${nextStep[0].toLowerCase()}${nextStep.slice(1)}.` : "Use the narrative to open your next conversation about scope.",
  ].join(" ");
  sections.push({ id: "next-use", heading: "Recommended next use", segments: [ex(nextUse)] });
  return sections;
}

/** The statement alone, as onboarding left it: the artifact's first version. */
export function statementOnly(statement: string): DraftSection[] {
  return [{ id: "statement", heading: "Positioning statement", segments: [you(statement)] }];
}
