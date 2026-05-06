import { MOCK_SESSIONS, MOCK_SESSION_CONTENTS, MOCK_TASKS } from "@/lib/mock-data";
import { getSessionLockStatus, computeOverallProgress } from "@/lib/progress";
import ParticipantPageHeader from "@/features/participant/ParticipantPageHeader";
import JourneySessionCard from "@/features/sessions/JourneySessionCard";
import JourneyConnector from "@/features/sessions/JourneyConnector";

export default function JourneyPage() {
  const overallProgress = computeOverallProgress(MOCK_SESSIONS);
  const completedCount = MOCK_SESSIONS.filter((s) => s.status === "completed").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <ParticipantPageHeader
        title="My Learning Journey"
        subtitle="Track your progress through the program"
      />

      {/* Progress summary */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-indigo-800">
            {completedCount} of {MOCK_SESSIONS.length} sessions complete
          </span>
          <span className="text-sm font-semibold text-indigo-700">{overallProgress}%</span>
        </div>
        <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Session path */}
      <div className="max-w-2xl">
        {MOCK_SESSIONS.map((session, i) => {
          const lockStatus = getSessionLockStatus(session, MOCK_SESSIONS);
          const taskCount = MOCK_TASKS.filter((t) => t.sessionId === session.id).length;
          const content = MOCK_SESSION_CONTENTS[session.id];
          const isLastCompleted = session.status === "completed";

          return (
            <div key={session.id}>
              <JourneySessionCard
                session={session}
                content={content}
                index={i}
                lockStatus={lockStatus}
                taskCount={taskCount}
              />
              {i < MOCK_SESSIONS.length - 1 && (
                <JourneyConnector isCompleted={isLastCompleted} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
