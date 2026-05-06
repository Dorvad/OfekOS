import { MOCK_PRACTICE_SCENARIOS, MOCK_SESSIONS } from "@/lib/mock-data";
import ParticipantPageHeader from "@/features/participant/ParticipantPageHeader";
import ScenarioCard from "@/features/practice/ScenarioCard";

export default function PracticePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <ParticipantPageHeader
        title="Practice Space"
        subtitle="Build real skills through simulated management conversations"
      />

      <p className="text-sm text-gray-500 mb-6 max-w-xl">
        Each scenario puts you in a realistic management conversation with an AI agent.
        Practice as many times as you need — there are no stakes, only learning.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_PRACTICE_SCENARIOS.map((scenario) => {
          const sessionTitle = MOCK_SESSIONS.find(
            (s) => s.id === scenario.sessionId
          )?.title;
          return (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              sessionTitle={sessionTitle}
            />
          );
        })}
      </div>
    </div>
  );
}
