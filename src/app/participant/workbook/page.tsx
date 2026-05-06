import { MOCK_WORKBOOK_SECTIONS, MOCK_SESSIONS } from "@/lib/mock-data";
import ParticipantPageHeader from "@/features/participant/ParticipantPageHeader";
import WorkbookSectionCard from "@/features/workbook/WorkbookSectionCard";

export default function WorkbookPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <ParticipantPageHeader
        title="My Workbook"
        subtitle="Your personal management portfolio — private by default"
      />

      <p className="text-sm text-gray-500 mb-6 max-w-xl">
        Each section is a cumulative reflection you build throughout the program.
        Sections are private by default. You can choose to share individual sections
        with your manager.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_WORKBOOK_SECTIONS.map((section) => {
          const sessionTitle = section.sessionId
            ? MOCK_SESSIONS.find((s) => s.id === section.sessionId)?.title
            : undefined;
          return (
            <WorkbookSectionCard
              key={section.id}
              section={section}
              sessionTitle={sessionTitle}
            />
          );
        })}
      </div>
    </div>
  );
}
