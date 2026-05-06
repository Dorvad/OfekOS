import { MOCK_RESOURCES, MOCK_SESSIONS } from "@/lib/mock-data";
import ParticipantPageHeader from "@/features/participant/ParticipantPageHeader";
import ResourcesList from "@/features/resources/ResourcesList";

export default function ResourcesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <ParticipantPageHeader
        title="Resources"
        subtitle="Files, templates, and links for your program"
      />
      <ResourcesList resources={MOCK_RESOURCES} sessions={MOCK_SESSIONS} />
    </div>
  );
}
