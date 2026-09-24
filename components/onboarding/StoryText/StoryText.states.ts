import { defineComponentStates } from "@/components/types";
import { bioFor, goalFor, narrativeFor } from "@/mock/onboarding";
import { StoryText } from "./StoryText";

const goal = goalFor("C-suite in 3 years");
const empty = { name: "", role: "", own: "", teamSize: "", strengths: [], result: "", audience: "" };
const filled = {
  name: "Maya Chen",
  role: "VP of Marketing",
  own: "brand, demand and product marketing",
  teamSize: "51–200",
  strengths: ["Building teams", "Growing revenue"],
  result: "grew pipeline 40% in a year",
  audience: "My manager",
};

export const storyTextStates = defineComponentStates({
  name: "StoryText",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "A Positioning Builder output. What the user told us is written in; what they have not is a dashed gap, announced as “To add”, never made up.",
  component: StoryText,
  variants: [
    { label: "Filled", props: { segments: narrativeFor(filled, goal)[0].segments } },
    { label: "With gaps", props: { segments: narrativeFor(empty, goal)[0].segments } },
    { label: "Bio — long, part filled", props: { segments: bioFor({ ...empty, role: "VP of Marketing" }, goal, "long") } },
  ],
});
