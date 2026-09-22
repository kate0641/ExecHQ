import { StyleguideViewer } from "@/components/hub/StyleguideViewer";
import { HubChrome } from "@/components/layout/HubChrome";

export const metadata = {
  title: "Stylesheet",
};

export default function StylesheetPage() {
  return (
    <HubChrome
      page="stylesheet"
      intro={
        <p>
          Read directly from <code>styles/tokens.css</code>. Greyscale for this
          sprint: the raw palette and the brand slots are the only things that
          change when navy, gold and slate blue arrive, and contrast will need
          re-verifying then.
        </p>
      }
    >
      <StyleguideViewer />
    </HubChrome>
  );
}
