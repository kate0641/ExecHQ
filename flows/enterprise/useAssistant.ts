"use client";

import { useState } from "react";
import { assistantAnswer, assistantKeyFor, type AssistantKey, type Cohort, type Period } from "@/mock/enterprise";

export interface AssistantMessage {
  id: number;
  from: "you" | "advisor";
  text: string;
  /** Written for the sponsor to use elsewhere: offered with Copy. */
  usable?: boolean;
}

/** Keys whose answer is words the sponsor can take away. */
const USABLE: AssistantKey[] = ["follow", "summary", "note"];
const TYPING_MS = 700;
let nextId = 1;

/**
 * One conversation with the assistant about the cohort on screen: what was
 * asked, the answers, and whether one is being written. A suggestion carries
 * its own key; anything typed is read for whether it asks about a person.
 */
export function useAssistant(cohort: Cohort, window: Period) {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [typing, setTyping] = useState(false);

  function ask(text: string, key: AssistantKey = assistantKeyFor(text)) {
    if (typing) return;
    setMessages((current) => [...current, { id: nextId++, from: "you", text }]);
    setTyping(true);
    const reduce = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setTimeout(
      () => {
        setMessages((current) => [
          ...current,
          { id: nextId++, from: "advisor", text: assistantAnswer(cohort, window, key), usable: USABLE.includes(key) },
        ]);
        setTyping(false);
      },
      reduce ? 0 : TYPING_MS
    );
  }

  return { messages, typing, ask, clear: () => setMessages([]) };
}
