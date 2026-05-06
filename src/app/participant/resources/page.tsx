import ParticipantPageHeader from "@/features/participant/ParticipantPageHeader";

export default function ResourcesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <ParticipantPageHeader
        title="Resources"
        subtitle="Files, templates, and links for your program"
      />
      <p className="text-gray-500 text-sm">Resources library — coming in Phase 8.</p>
    </div>
  );
}
