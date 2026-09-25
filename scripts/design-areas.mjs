/**
 * The design areas: the only parts of the repo a design session changes.
 *
 * One list, read by the Claude Code hook that stops edits outside it
 * (`scripts/design-guard.mjs`) and by the pull request check that fails a
 * design branch touching anything else (`scripts/check-design-scope.mjs`).
 * CLAUDE.md describes the same list in words; change both together.
 *
 * Everything else — CLAUDE.md, DESIGN.md, the manifest, specs, routes, lib/,
 * scripts/, config, packages and the lockfile — is Kate's to change.
 */
export const DESIGN_AREAS = [
  "components/", // every component, its states file and the registry
  "styles/", // tokens.css and app.css
  "mock/", // sample content
  "flows/", // the built concepts' screens
  "app/showroom/", // the showroom's own pages
];

/**
 * Kate's git addresses. Sessions committing as any of these are hers, and the
 * design-session guard stays out of the way.
 */
export const MAINTAINER_EMAILS = [
  "khester@cassihome.com",
  "kate@thinkbiggerinnovation.com",
  "kate@charmingrobot.com",
];

/** True for a repo-relative path (forward slashes) inside a design area. */
export function inDesignArea(path) {
  return DESIGN_AREAS.some((area) => path.startsWith(area));
}

export function isMaintainer(email) {
  return MAINTAINER_EMAILS.includes(email.trim().toLowerCase());
}
