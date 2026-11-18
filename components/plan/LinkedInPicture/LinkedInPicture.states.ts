import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { LINKEDIN_EXPORT } from "@/mock/linkedin-export";
import { LinkedInPicture } from "./LinkedInPicture";

const base = { data: LINKEDIN_EXPORT };

export const linkedInPictureStates = defineComponentStates({
  name: "LinkedInPicture",
  group: "cards",
  status: "draft",
  flows: ["signals"],
  description:
    "How far her posts reach and who they reach, from her LinkedIn export (the onboarding spec's purpose; designer with Kate, 2026-10-21). Four totals, her posts that went furthest by date and reach with a link to each (the export gives no titles), and who she is reaching, one kind at a time. Counts as LinkedIn reports them, with no score or rank and no claim that her work caused any of it. The prototype never reads her file: the data is stubbed.",
  component: LinkedInPicture,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "The file is read in the background before this is shown, as the upload says.",
    error: "A file that is not an export is caught at the upload, before this is shown.",
    filled: "It is only ever shown with an export in it; the default is the filled state.",
  },
  variants: [
    { label: "Location — default", props: base },
    { label: "Industry", props: { ...base, initialKind: "industry" as const } },
    { label: "Seniority", props: { ...base, initialKind: "seniority" as const } },
    {
      label: "No reach or audience in the file — the totals and posts only",
      description: "An export without members reached or demographics shows what it has.",
      props: { ...base, data: { ...LINKEDIN_EXPORT, membersReached: undefined, audience: undefined } },
    },
    {
      label: "No posts, only followers",
      description: "Only the figure with something to say is shown.",
      props: { ...base, data: { ...LINKEDIN_EXPORT, posts: [], membersReached: undefined } },
    },
    {
      label: "Empty — nothing in the export",
      description: "It says so plainly and draws nothing.",
      props: { ...base, data: { ...LINKEDIN_EXPORT, followers: [], posts: [], membersReached: undefined, audience: undefined } },
    },
    {
      label: "Long text — a long place name wraps",
      props: {
        ...base,
        data: {
          ...LINKEDIN_EXPORT,
          audience: { ...LINKEDIN_EXPORT.audience!, location: [{ value: "Washington DC–Baltimore Metropolitan Area and the surrounding region", percent: 18 }, ...LINKEDIN_EXPORT.audience!.location.slice(1)] },
        },
      },
    },
  ],
});
