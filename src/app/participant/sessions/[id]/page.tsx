import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import {
  MOCK_SESSIONS,
  MOCK_SESSION_CONTENTS,
  MOCK_TASKS,
  MOCK_WORKBOOK_SECTIONS,
  MOCK_PRACTICE_SCENARIOS,
} from "@/lib/mock-data";
import { getSessionLockStatus } from "@/lib/progress";
import SessionHero from "@/features/sessions/SessionHero";
import CoreConceptsList from "@/features/sessions/CoreConceptsList";
import SessionTasksContainer from "@/features/sessions/SessionTasksContainer";
import WorkbookPromptCard from "@/features/sessions/WorkbookPromptCard";
import SessionResourcesPanel from "@/features/sessions/SessionResourcesPanel";

export function generateStaticParams() {
  return MOCK_SESSIONS.map((s) => ({ id: s.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionDetailPage({ params }: PageProps) {
  const { id } = await params;

  const session = MOCK_SESSIONS.find((s) => s.id === id);
  if (!session) notFound();

  const sessionIndex = MOCK_SESSIONS.findIndex((s) => s.id === id);
  const lockStatus = getSessionLockStatus(session, MOCK_SESSIONS);
  const content = MOCK_SESSION_CONTENTS[id];
  const tasks = MOCK_TASKS.filter((t) => t.sessionId === id);
  const workbookSection = content
    ? MOCK_WORKBOOK_SECTIONS.find((ws) => ws.id === content.workbookSectionId)
    : null;
  const practiceScenario = content?.practiceScenarioId
    ? MOCK_PRACTICE_SCENARIOS.find((ps) => ps.id === content.practiceScenarioId)
    : null;

  // Locked state
  if (lockStatus === "locked") {
    const prevSession = MOCK_SESSIONS[sessionIndex - 1];
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link
          href="/participant/journey"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6 inline-block"
        >
          ← Back to Journey
        </Link>
        <Card className="border-gray-200 bg-gray-50">
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-700 mb-2">{session.title}</h1>
            <p className="text-sm text-gray-500 mb-4">
              {prevSession
                ? `Complete "${prevSession.title}" to unlock this session.`
                : "This session is not yet available."}
            </p>
            <Link
              href="/participant/journey"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ← Back to Journey
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link
        href="/participant/journey"
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4 inline-block"
      >
        ← Back to Journey
      </Link>

      <SessionHero session={session} index={sessionIndex} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Why it matters */}
          {content && (
            <Card className="mb-5 bg-gray-50 border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-2">Why this session matters</h2>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                {content.whyItMatters}
              </p>
            </Card>
          )}

          {/* Core concepts */}
          {content && <CoreConceptsList concepts={content.coreConcepts} />}

          {/* Tasks */}
          {tasks.length > 0 && (
            <div className="mb-5">
              <h2 className="font-semibold text-gray-900 mb-3">Your tasks</h2>
              <SessionTasksContainer tasks={tasks} sessionStatus={session.status} />
            </div>
          )}

          {/* Practice link */}
          {practiceScenario && (
            <Card className="mb-5 bg-violet-50 border-violet-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-violet-600">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-0.5">
                    Practice
                  </p>
                  <p className="text-sm font-medium text-violet-900 mb-1">
                    {practiceScenario.title}
                  </p>
                  <p className="text-xs text-violet-700 leading-relaxed">
                    {practiceScenario.description}
                  </p>
                  <Link
                    href={`/participant/practice/${practiceScenario.id}`}
                    className="inline-block mt-2 text-xs font-semibold text-violet-600 hover:text-violet-700"
                  >
                    Go to practice →
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-72 shrink-0">
          {workbookSection && <WorkbookPromptCard section={workbookSection} />}
          {content && <SessionResourcesPanel resourceIds={content.resourceIds} />}
        </div>
      </div>
    </div>
  );
}
