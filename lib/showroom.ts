/**
 * The showroom switch.
 *
 * The showroom is the private part of the prototype: the design system, the
 * component catalogue and the playground, under `/showroom`. It is never built
 * into the public production site. The decision is made once, in
 * `next.config.ts`, and read here — see the comment there for the rules.
 *
 * Read `SHOWROOM_ENABLED` rather than `process.env` directly, so there is one
 * place to look.
 */
export const SHOWROOM_ENABLED = process.env.SHOWROOM_ENABLED === "true";
