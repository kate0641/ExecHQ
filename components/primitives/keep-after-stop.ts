/**
 * Never leaves a sentence's first word alone at the end of a line: the word
 * after each full stop is bound to the word that follows it with a no-break
 * space, so "in it. You drop" breaks before "You", not after it (designer,
 * 2026-10-15). The full-stop twin of keepAfterComma. Applied to copy as it is
 * rendered, never to the copy itself.
 */
export function keepAfterStop(text: string): string {
  return text.replace(/([.?!]) (\S+) /g, "$1 $2 ");
}
