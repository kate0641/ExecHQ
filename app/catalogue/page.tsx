import { ComponentCatalogue } from "@/components/hub/ComponentCatalogue";
import { HubChrome } from "@/components/layout/HubChrome";
import { getHubPage } from "@/lib/hub-pages";

export const metadata = {
  title: "Component catalogue",
};

export default function CataloguePage() {
  const page = getHubPage("catalogue");

  return (
    <HubChrome
      page="catalogue"
      intro={
        <p>
          {page.description} Every component ships a sibling states file, and this
          page reads only from those — so it cannot drift out of sync with the
          components themselves. Status is per component, not per page, because
          one component may appear across several flows at different stages.
        </p>
      }
    >
      <ComponentCatalogue />
    </HubChrome>
  );
}
