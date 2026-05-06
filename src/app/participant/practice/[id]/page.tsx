import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import { MOCK_PRACTICE_SCENARIOS, MOCK_SESSIONS } from "@/lib/mock-data";
import ScenarioDifficultyBadge from "@/features/practice/ScenarioDifficultyBadge";
import ElevenLabsEmbedPlaceholder from "@/features/practice/ElevenLabsEmbedPlaceholder";

export function generateStaticParams() {
  return MOCK_PRACTICE_SCENARIOS.map((s) => ({ id: s.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ScenarioDetailPage({ params }: PageProps) {
  const { id } = await params;

  const scenario = MOCK_PRACTICE_SCENARIOS.find((s) => s.id === id);
  if (!scenario) notFound();

  const linkedSession = MOCK_SESSIONS.find((s) => s.id === scenario.sessionId);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link
        href="/participant/practice"
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4 inline-block"
      >
        ← Back to Practice
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <ScenarioDifficultyBadge difficulty={scenario.difficulty} />
          <span className="text-xs text-gray-400">~{scenario.estimatedMinutes} min</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{scenario.title}</h1>
        <p className="text-sm text-gray-500">Skill: {scenario.skillPracticed}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main: embed placeholder */}
        <div className="flex-1 min-w-0">
          {/* About card */}
          <Card className="mb-5 bg-gray-50 border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-2">About this simulation</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{scenario.description}</p>
          </Card>

          {/* ElevenLabs embed */}
          <ElevenLabsEmbedPlaceholder
            agentId={scenario.agentId}
            scenarioTitle={scenario.title}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:w-72 shrink-0 flex flex-col gap-4">
          {/* Tips */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tips for this practice</h3>
            <ul className="space-y-3">
              {scenario.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-xs text-gray-600 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Linked session */}
          {linkedSession && (
            <Card className="bg-indigo-50 border-indigo-100">
              <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wide mb-1">
                Related Session
              </p>
              <p className="text-sm font-medium text-indigo-900 mb-2">
                {linkedSession.title}
              </p>
              <Link
                href={`/participant/sessions/${linkedSession.id}`}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View session →
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
