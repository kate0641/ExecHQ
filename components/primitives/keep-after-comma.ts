/**
 * Never leaves one word alone after a comma at the end of a line: the word
 * after each comma is bound to the word that follows it with a no-break
 * space, so "a result, so it says" breaks before "so", not after it
 * (designer, 2026-10-13). Applied to copy as it is rendered, never to the
 * copy itself.
 */
export function keepAfterComma(text: string): string {
  return text.replace(/, (\S+) /g, ", $1\u00a0");
}
