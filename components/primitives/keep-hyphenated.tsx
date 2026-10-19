"use client";

import { useEffect } from "react";

/* A word that is already hyphenated is one word: it never breaks across lines, anywhere in the product
   ("check-in", "one-page", "follow-up") (designer, 2026-10-16). CSS cannot stop a break at a hyphen, so as
   the page renders, a hyphen between two letters or digits becomes the non-breaking hyphen (U+2011),
   which every face here draws at the same width. Applied to what is on screen, never to the copy itself;
   fields, code and editable text are left as typed. */
const IN_A_WORD = /([\p{L}\p{N}])-(?=[\p{L}\p{N}])/gu;
const SKIP = "input, textarea, script, style, code, pre, [contenteditable]";

/** Whether React has taken this element over: it tags each element it
 *  hydrates or renders. Server text not yet hydrated must stay as sent, or
 *  hydration fails on it. */
const adopted = (el: Element | null) => Boolean(el && Object.keys(el).some((key) => key.startsWith("__reactFiber$")));

/** Rewrites what React owns; returns whether any text was left for later. */
function keepWhole(node: Node): boolean {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.nodeValue ?? "";
    if (!text.includes("-") || node.parentElement?.closest(SKIP)) return false;
    const next = text.replace(IN_A_WORD, "$1‑");
    if (next === text) return false;
    if (!adopted(node.parentElement)) return true;
    node.nodeValue = next;
    return false;
  }
  if (node.nodeType !== Node.ELEMENT_NODE || (node as Element).matches(SKIP)) return false;
  let waiting = false;
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  for (let text = walker.nextNode(); text; text = walker.nextNode()) waiting = keepWhole(text) || waiting;
  return waiting;
}

/** Keeps every hyphenated word on the page whole, now and as the page changes.
 *
 *  Only text React has taken over is rewritten: React checks the server's
 *  text as it hydrates, part by part (a Suspense boundary can hydrate well
 *  after the page loads), and a word rewritten before then fails hydration.
 *  Hydrating changes nothing an observer can see, so while any server text
 *  is still waiting, the page is looked at again shortly, for up to ten
 *  seconds. */
export function useWholeHyphenatedWords() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let tries = 0;
    const sweep = () => {
      timer = undefined;
      if (keepWhole(document.body) && tries++ < 40) timer = setTimeout(sweep, 250);
    };
    sweep();
    const observer = new MutationObserver((records) => {
      let waiting = false;
      for (const record of records) {
        if (record.type === "characterData") waiting = keepWhole(record.target) || waiting;
        else record.addedNodes.forEach((node) => (waiting = keepWhole(node) || waiting));
      }
      // Streamed server parts arrive as added nodes before React hydrates them.
      if (waiting && timer === undefined) {
        tries = 0;
        timer = setTimeout(sweep, 250);
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}
