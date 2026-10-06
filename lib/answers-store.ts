/**
 * What she has answered in the Plan: the targeted questions and the weekly
 * reflections. Kept on her device and read through useSyncExternalStore, like
 * the presence store, and put back by the dock's reset.
 *
 * Her words are hers: a reflection's "what is in the way" is kept for her
 * advisor and never shown back unasked. What came of a thing she did joins
 * the record, next to the thing it followed.
 */

import { useSyncExternalStore } from "react";
import type { LoopDate } from "@/lib/loop";
import type { MomentumEvent } from "@/lib/momentum";

export interface QuestionAnswer {
  stepId: string;
  /** What it is filed under: "Who decides". */
  label: string;
  answer: string;
  on: LoopDate;
}

export interface Reflection {
  on: LoopDate;
  /** What moved, as she chose from the things she did that week. */
  things: string[];
  /** What she says came of one of them, and which. */
  linkText?: string;
  came?: string;
  /** In her words, kept for her advisor. Never shown back unasked. */
  block?: string;
}

export interface Answers {
  questions: QuestionAnswer[];
  reflections: Reflection[];
}

const STORAGE_KEY = "exechq-answers";
const NONE: Answers = { questions: [], reflections: [] };

let cached: Answers | undefined;
const listeners = new Set<() => void>();

function read(): Answers {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<Answers> | null;
    return {
      questions: Array.isArray(parsed?.questions) ? parsed.questions : [],
      reflections: Array.isArray(parsed?.reflections) ? parsed.reflections : [],
    };
  } catch {
    return NONE;
  }
}

function get(): Answers {
  if (cached === undefined) cached = read();
  return cached;
}

function write(next: Answers): void {
  cached = next;
  try {
    if (next.questions.length + next.reflections.length === 0) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

export function saveQuestionAnswer(answer: QuestionAnswer): void {
  write({ ...get(), questions: [...get().questions.filter((q) => q.stepId !== answer.stepId), answer] });
}

export function saveReflection(reflection: Reflection): void {
  write({ ...get(), reflections: [...get().reflections, reflection] });
}

export function resetAnswers(): void {
  write(NONE);
}

export function useAnswers(): Answers {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    get,
    () => NONE
  );
}

/** Each answer and each reflection is a completed action in Momentum. Declining one adds nothing and takes nothing away. */
export function answerEvents(answers: Answers): MomentumEvent[] {
  return [
    ...answers.questions.map((q, i) => ({ id: `answer:${q.stepId}:${i}`, figure: "completed" as const, text: `Answered: ${q.label}`, on: q.on })),
    ...answers.reflections.map((r, i) => ({ id: `reflection:${r.on}:${i}`, figure: "completed" as const, text: "Wrote your weekly reflection", on: r.on })),
  ];
}
