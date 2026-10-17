"use client";

import { useEffect } from "react";

/* A word that is already hyphenated is one word: it never breaks across lines, anywhere in the product
   ("check-in", "one-page", "follow-up") (designer, 2026-10-16). CSS cannot stop a break at a hyphen, so as
   the page renders, a hyphen between two letters or digits becomes the non-breaking hyphen (U+2011),
   which every face here draws at the same width. Applied to what is on screen, never to the copy itself;
   fields, code and editable text are left as typed. */
const IN_A_WORD = /([\p{L}\p{N}])-(?=[\p{L}\p{N}])/gu;
const SKIP = "input, textarea, script, style, code, pre, [contenteditable]";

function keepWhole(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.nodeValue ?? "";
    if (!text.includes("-") || node.parentElement?.closest(SKIP)) return;
    const next = text.replace(IN_A_WORD, "$1‑");
    if (next !== text) node.nodeValue = next;
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE || (node as Element).matches(SKIP)) return;
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  for (let text = walker.nextNode(); text; text = walker.nextNode()) keepWhole(text);
}

/** Keeps every hyphenated word on the page whole, now and as the page changes. */
export function useWholeHyphenatedWords() {
  useEffect(() => {
    keepWhole(document.body);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") keepWhole(record.target);
        else record.addedNodes.forEach(keepWhole);
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, []);
}
