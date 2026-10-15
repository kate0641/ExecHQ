import { defineComponentStates } from "@/components/types";
import { CohortForm } from "./CohortForm";

const onCreate = () => {};
const fields = "Its fields are Inputs and its button a Button, which show their own states.";

export const cohortFormStates = defineComponentStates({
  name: "CohortForm",
  group: "form controls",
  status: "draft",
  flows: ["enterprise"],
  description:
    "Starting a cohort: its name, the expected size and the program dates. Nothing about the people in it; the sponsor shares one code through its own channels.",
  component: CohortForm,
  notApplicable: {
    hover: fields,
    focus: fields,
    active: fields,
    disabled: "Create is never switched off: sending an incomplete form says what is missing.",
    loading: "Creating a cohort is a local change in the prototype: there is nothing to wait for.",
  },
  variants: [
    { label: "Blank — default, empty", props: { onCreate } },
    {
      label: "Filled",
      props: { onCreate, initial: { name: "Leadership Programme 2027", size: "50", startsOn: "2027-01-11", endsOn: "2027-04-02" } },
    },
    { label: "Sent incomplete — error", props: { onCreate, startSubmitted: true, initial: { name: "", size: "", startsOn: "2027-01-11" } } },
    {
      label: "Ends before it starts — invalid",
      props: { onCreate, startSubmitted: true, initial: { name: "Leadership Programme 2027", size: "50", startsOn: "2027-04-02", endsOn: "2027-01-11" } },
    },
    {
      label: "A long name wraps",
      props: { onCreate, initial: { name: "Northgate Leadership Programme for Senior Directors and Vice Presidents, 2027 intake", size: "120" } },
    },
  ],
});
