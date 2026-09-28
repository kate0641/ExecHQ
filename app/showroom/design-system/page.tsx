import { StyleguideViewer } from "@/components/hub/StyleguideViewer";
import { HubChrome } from "@/components/layout/HubChrome";

export const metadata = {
  title: "Design system",
};

export default function StylesheetPage() {
  return (
    <HubChrome
      page="design-system"
      intro={
        <p>
          Read directly from <code>styles/tokens.css</code>. Six brand scales —
          blue, green, yellow, orange, slate and stone, 100 to 900 — with every
          text and control pairing checked against WCAG 2.2 AA.
        </p>
      }
    >
      <StyleguideViewer />
    </HubChrome>
  );
}
