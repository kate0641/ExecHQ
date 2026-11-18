import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SHOWROOM_ENABLED } from "@/lib/showroom";

/**
 * The gate for everything under `/showroom`.
 *
 * Where the showroom is off — a laptop without `SHOWROOM=on` — every page in
 * it renders the 404 at build time. `lib/showroom.ts` and `next.config.ts` say
 * where it is on: every Vercel deployment, production included.
 *
 * Wherever it is on, it is kept out of search engines: it is shared by link,
 * not found by search.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ShowroomLayout({ children }: { children: ReactNode }) {
  if (!SHOWROOM_ENABLED) notFound();
  return children;
}
