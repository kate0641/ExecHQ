import type { NextConfig } from "next";

/**
 * Whether the showroom (`/showroom` — design system, component catalogue and
 * playground) is built at all.
 *
 * Decided once, here, at build time, and handed to the app as
 * `process.env.SHOWROOM_ENABLED` so server and client read the same answer.
 *
 * - Every Vercel deployment, production and preview: on. Production was kept
 *   off until 2026-09-28, when Kate decided the showroom should be on the
 *   public site too.
 * - Everywhere else (a laptop, CI): on when `SHOWROOM=on`, which is what
 *   `.env.example` sets.
 *
 * It stays out of search engines everywhere: see `app/showroom/layout.tsx`.
 */
const onVercel = Boolean(process.env.VERCEL_ENV);
const showroomEnabled = onVercel || process.env.SHOWROOM === "on";

const nextConfig: NextConfig = {
  // Next.js 16.3 otherwise appends its own agent rules to CLAUDE.md on every
  // `next dev`, leaving every designer's working copy with a change to a file
  // outside the design areas. CLAUDE.md is written by hand here.
  agentRules: false,
  env: {
    SHOWROOM_ENABLED: showroomEnabled ? "true" : "false",
  },
  // The reference tools used to live at the top level. Old links still land
  // somewhere: on the showroom where it is built, and on the 404 where not.
  async redirects() {
    return [
      { source: "/catalogue", destination: "/showroom/components", permanent: false },
      { source: "/stylesheet", destination: "/showroom/design-system", permanent: false },
    ];
  },
};

export default nextConfig;
