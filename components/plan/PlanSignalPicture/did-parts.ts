/**
 * What she did, split for display: the title, and the detail after its last " · " (where it ran or what kind it
 * was: "LinkedIn article", "The Modern CMO"). The detail is a detail, so it rides in the eyebrow with the date,
 * not in the title's style (designer, 2026-10-21). The picture joins the two in lib/signal-picture.ts; this only
 * takes them apart again to show them. Nothing after a " · " means there is no detail.
 */
export function didParts(did: string): { title: string; detail?: string } {
  const at = did.lastIndexOf(" · ");
  return at < 0 ? { title: did } : { title: did.slice(0, at), detail: did.slice(at + 3) };
}
