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
    "What her LinkedIn analytics export says, drawn plainly and kept quiet: three rows, each a figure with its shape in miniature (followers, impressions, posts). Tap one and its full chart opens beneath it; one is open at a time, and followers is open to begin with. Counts as LinkedIn reports them, with no score or rank and no claim that her work caused any of it. One hue throughout. Every mark has the same readout on hover, touch and keyboard. The prototype never reads her file: the data is stubbed.",
  component: LinkedInPicture,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading: "The file is read in the background before this is shown, as the upload says.",
    error: "A file that is not an export is caught at the upload, before this is shown.",
    filled: "It is only ever shown with an export in it; the default is the filled state.",
  },
  variants: [
    { label: "Followers open — default", props: base },
    {
      label: "Followers — a week read out",
      description: "A hairline follows the pointer and snaps to the nearest week. Arrow keys on the hidden range control do the same, and touch drags it.",
      props: { ...base, demoWeek: 20 },
    },
    {
      label: "Impressions open",
      description: "One column for each calendar month the export touches, so a mid-month start and end give thirteen. Only the tallest carries its number.",
      props: { ...base, initialOpen: "impressions" },
    },
    {
      label: "Impressions — a month read out",
      description: "Each column is a button: hover, focus and touch all give the same readout.",
      props: { ...base, initialOpen: "impressions", demoMonth: 5 },
    },
    {
      label: "Posts open",
      description: "The three posts LinkedIn showed most, by impressions.",
      props: { ...base, initialOpen: "posts" },
    },
    {
      label: "All closed — the calmest it gets",
      description: "Three figures with their shapes, and nothing else.",
      props: { ...base, initialOpen: null },
    },
    {
      label: "Only a few posts — empty months stay empty",
      description: "A month with no post is an empty slot with its letter, never a zero bar and never skipped.",
      props: { ...base, initialOpen: "impressions", data: { ...LINKEDIN_EXPORT, posts: LINKEDIN_EXPORT.posts.slice(0, 3) } },
    },
    {
      label: "No posts, only followers",
      description: "Only the row with something to say is shown.",
      props: { ...base, data: { ...LINKEDIN_EXPORT, posts: [] } },
    },
    {
      label: "Empty — nothing in the export",
      description: "It says so plainly and draws nothing.",
      props: { ...base, data: { ...LINKEDIN_EXPORT, followers: [], posts: [] } },
    },
    {
      label: "Long text — a long post title wraps",
      props: {
        ...base,
        initialOpen: "posts",
        data: {
          ...LINKEDIN_EXPORT,
          posts: LINKEDIN_EXPORT.posts.map((p) =>
            p.id === "p7" ? { ...p, title: "Notes from a panel on planning for growth, with the heads of marketing from three other firms, and the question about how we set targets across teams that nobody had a tidy answer for" } : p
          ),
        },
      },
    },
  ],
});
