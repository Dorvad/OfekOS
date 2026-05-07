import { MOCK_RESOURCES, MOCK_SESSIONS } from "@/lib/mock-data";
import ParticipantPageHeader from "@/features/participant/ParticipantPageHeader";
import ResourcesList from "@/features/resources/ResourcesList";
import ProgramFilesClient from "@/features/resources/ProgramFilesClient";

export default function ResourcesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <ParticipantPageHeader
        title="חומרי למידה"
        subtitle="קבצים, תבניות וקישורים לתוכנית"
      />

      {/* Program files uploaded by admin */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-3">חומרי תוכנית</h2>
        <ProgramFilesClient />
      </section>

      <ResourcesList resources={MOCK_RESOURCES} sessions={MOCK_SESSIONS} />
    </div>
  );
}
