/**
 * The showroom switch.
 *
 * The showroom is the prototype's working space: the design system, the
 * component catalogue and the playground, under `/showroom`. It is built on
 * every Vercel deployment, the production site included, and on a laptop with
 * `SHOWROOM=on`. The decision is made once, in `next.config.ts`, and read
 * here — see the comment there for the rules.
 *
 * Read `SHOWROOM_ENABLED` rather than `process.env` directly, so there is one
 * place to look.
 */
export const SHOWROOM_ENABLED = process.env.SHOWROOM_ENABLED === "true";
