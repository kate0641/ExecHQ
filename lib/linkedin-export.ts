import type { LinkedInExport, LinkedInPost } from "@/mock/linkedin-export";

/** 1,284 stays 1,284; 12,900 becomes 12.9K. */
export function compact(n: number): string {
  if (n >= 10_000) return `${(Math.round(n / 100) / 10).toLocaleString("en-US")}K`;
  return n.toLocaleString("en-US");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface MonthBar {
  /** "2026-03". */
  key: string;
  /** "Mar". */
  label: string;
  year: number;
  impressions: number;
  posts: number;
}

/** Impressions for every calendar month the export touches, oldest first, so a month with no post is an empty slot and not a missing one. An export that starts mid-month and ends mid-month touches thirteen. */
export function monthlyImpressions(posts: readonly LinkedInPost[], from: string, to: string): MonthBar[] {
  const out: MonthBar[] = [];
  let [year, month] = from.split("-").map(Number);
  const end = to.slice(0, 7);
  for (;;) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    const inMonth = posts.filter((p) => p.on.startsWith(key));
    out.push({ key, label: MONTHS[month - 1], year, impressions: inMonth.reduce((n, p) => n + p.impressions, 0), posts: inMonth.length });
    if (key >= end || out.length >= 24) break;
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return out;
}

/** "6 Oct 2025". */
export function fullDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** "6 Oct". */
export function dayMonth(date: string): string {
  const [, m, d] = date.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

/** Her most-seen posts, most first. */
export const topPosts = (posts: readonly LinkedInPost[], n: number) => [...posts].sort((a, b) => b.impressions - a.impressions).slice(0, n);

export const totals = (data: LinkedInExport) => ({
  followersNow: data.followers.at(-1)?.count ?? 0,
  followersThen: data.followers[0]?.count ?? 0,
  impressions: data.posts.reduce((n, p) => n + p.impressions, 0),
  posts: data.posts.length,
});
