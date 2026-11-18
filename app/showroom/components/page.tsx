import { ComponentCatalogue } from "@/components/hub/ComponentCatalogue";
import { HubChrome } from "@/components/layout/HubChrome";
import { coverageProblems } from "@/components/states-coverage";
import { getHubPage } from "@/lib/hub-pages";

export const metadata = {
  title: "Component catalogue",
};

export default function CataloguePage() {
  const page = getHubPage("components");

  // The guardrail: a component that stops showing a state, or a new one that
  // never showed it, fails the build here — on a laptop, in the pull request
  // check and on the preview — instead of turning up in review. While the dev
  // server is running it is a list at the top of this page instead, so the
  // catalogue stays usable mid-change.
  const problems = coverageProblems();
  if (problems.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(
      `Component states need attention (see components/states-coverage.ts):\n\n- ${problems.join("\n- ")}\n`
    );
  }

  return (
    <HubChrome
      page="components"
      intro={
        <p>
          {page.description} Every component ships a sibling states file, and this
          page reads only from those — so it cannot drift out of sync with the
          components themselves. Status is per component, not per page, because
          one component may appear across several flows at different stages.
        </p>
      }
    >
      {problems.length > 0 ? (
        <section className="catalogue-problems" aria-labelledby="catalogue-problems-title">
          <h2 className="catalogue-problems__title" id="catalogue-problems-title">
            {problems.length === 1
              ? "1 state problem — the build will fail until it is fixed"
              : `${problems.length} state problems — the build will fail until they are fixed`}
          </h2>
          <ul className="catalogue-problems__list">
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </section>
      ) : null}
      <ComponentCatalogue />
    </HubChrome>
  );
}
