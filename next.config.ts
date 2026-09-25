import type { NextConfig } from "next";

/**
 * Whether the showroom (`/showroom` — design system, component catalogue and
 * playground) is built at all.
 *
 * Decided once, here, at build time, and handed to the app as
 * `process.env.SHOWROOM_ENABLED` so server and client read the same answer.
 *
 * - Vercel production (`VERCEL_ENV=production`): always off. No setting can
 *   turn it on, so a stray `SHOWROOM=on` in the production environment is
 *   harmless.
 * - Vercel preview deployments: always on, so every pull request's preview
 *   link opens the showroom.
 * - Everywhere else (a laptop, CI): on when `SHOWROOM=on`, which is what
 *   `.env.example` sets.
 */
const vercelEnv = process.env.VERCEL_ENV;
const showroomEnabled =
  vercelEnv !== "production" &&
  (vercelEnv === "preview" || process.env.SHOWROOM === "on");

const nextConfig: NextConfig = {
  env: {
    SHOWROOM_ENABLED: showroomEnabled ? "true" : "false",
  },
  // The reference tools used to live at the top level. Old links still land
  // somewhere; on production they land on the 404 like the rest of the showroom.
  async redirects() {
    return [
      { source: "/catalogue", destination: "/showroom/components", permanent: false },
      { source: "/stylesheet", destination: "/showroom/design-system", permanent: false },
    ];
  },
};

export default nextConfig;
