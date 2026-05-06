import {
  MOCK_USER,
  MOCK_PROGRAM,
  MOCK_SESSIONS,
  MOCK_SESSION_CONTENTS,
  MOCK_WORKBOOK_SECTIONS,
  MOCK_TASKS,
} from "@/lib/mock-data";
import CurrentSessionCard from "@/features/participant/CurrentSessionCard";
import JourneyProgressSummary from "@/features/participant/JourneyProgressSummary";
import WorkbookProgressSummary from "@/features/participant/WorkbookProgressSummary";
import OpenTasksSummary from "@/features/participant/OpenTasksSummary";
import QuickAccessGrid from "@/features/participant/QuickAccessGrid";

export default function ParticipantDashboard() {
  const activeSession = MOCK_SESSIONS.find((s) => s.status === "active");
  const completedSessions = MOCK_SESSIONS.filter((s) => s.status === "completed");

  // Open tasks: those on the active session with not_started or in_progress default status
  const openTasks = MOCK_TASKS.filter(
    (t) =>
      t.sessionId === activeSession?.id &&
      (t.defaultStatus === "not_started" || t.defaultStatus === "in_progress")
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Welcome header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {MOCK_USER.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{MOCK_PROGRAM.name}</p>
      </div>

      {/* Current session */}
      {activeSession && MOCK_SESSION_CONTENTS[activeSession.id] && (
        <div className="mb-5">
          <CurrentSessionCard
            session={activeSession}
            content={MOCK_SESSION_CONTENTS[activeSession.id]}
          />
        </div>
      )}

      {/* Open tasks */}
      <div className="mb-5">
        <OpenTasksSummary
          openCount={openTasks.length}
          activeSession={activeSession}
        />
      </div>

      {/* Progress pair */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <JourneyProgressSummary
          completedCount={completedSessions.length}
          totalCount={MOCK_SESSIONS.length}
        />
        <WorkbookProgressSummary
          sectionsWithContent={0}
          totalSections={MOCK_WORKBOOK_SECTIONS.length}
        />
      </div>

      {/* Quick access */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Quick access
        </h2>
        <QuickAccessGrid />
      </div>
    </div>
  );
}
