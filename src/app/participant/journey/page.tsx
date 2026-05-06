import ParticipantPageHeader from "@/features/participant/ParticipantPageHeader";

export default function JourneyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <ParticipantPageHeader
        title="My Learning Journey"
        subtitle="Track your progress through the program"
      />
      <p className="text-gray-500 text-sm">Journey view — coming in Phase 4.</p>
    </div>
  );
}
