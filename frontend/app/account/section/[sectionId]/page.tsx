import SectionPage from ".";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supervisor | CarbTrkr",
};

export default function Section({ params }: { params: { sectionId: string } }) {
  return <SectionPage sectionId={params.sectionId} />;
}
