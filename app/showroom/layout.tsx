import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SHOWROOM_ENABLED } from "@/lib/showroom";

/**
 * The gate for everything under `/showroom`.
 *
 * Where the showroom is off — always, on the public production site — every
 * page in it renders the 404 at build time, so none of it is ever served there.
 * `lib/showroom.ts` and `next.config.ts` say where it is on.
 *
 * On previews and laptops it is on, and still kept out of search engines in
 * case a preview link travels.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ShowroomLayout({ children }: { children: ReactNode }) {
  if (!SHOWROOM_ENABLED) notFound();
  return children;
}
