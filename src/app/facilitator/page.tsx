import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import RoleBadge from "@/components/shared/RoleBadge";
import { MOCK_PARTICIPANTS, MOCK_SESSIONS, MOCK_PROGRAM } from "@/lib/mock-data";

export default function FacilitatorDashboard() {
  const completedCount = MOCK_PARTICIPANTS.filter(
    (p) => p.progress === 100
  ).length;
  const avgProgress = Math.round(
    MOCK_PARTICIPANTS.reduce((sum, p) => sum + p.progress, 0) /
      MOCK_PARTICIPANTS.length
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Home
          </Link>
          <RoleBadge role="facilitator" active />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Facilitator Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Cohort overview and session management
        </p>
      </div>

      {/* Program banner */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-sm text-amber-800 font-medium">
        {MOCK_PROGRAM.name}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <div className="text-2xl font-bold text-amber-600">
            {MOCK_PROGRAM.cohortSize}
          </div>
          <div className="text-xs text-gray-500 mt-1">Participants</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900">{avgProgress}%</div>
          <div className="text-xs text-gray-500 mt-1">Avg. Progress</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {completedCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">Fully Complete</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {MOCK_PROGRAM.activeSessions}
          </div>
          <div className="text-xs text-gray-500 mt-1">Active Sessions</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cohort progress */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Cohort Progress</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_PARTICIPANTS.map((p) => (
                <div
                  key={p.id}
                  className="px-6 py-3 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-medium text-sm text-gray-900">
                      {p.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {p.sessionsCompleted}/{p.totalSessions} sessions
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-sm font-semibold text-gray-900 w-10 text-right">
                      {p.progress}%
                    </div>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          p.progress === 100
                            ? "bg-emerald-500"
                            : p.progress >= 60
                            ? "bg-amber-400"
                            : "bg-red-300"
                        }`}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <Card padding={false}>
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-semibold text-sm text-gray-900">Sessions</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_SESSIONS.map((session) => (
                <div key={session.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-medium text-gray-800 leading-relaxed">
                      {session.title}
                    </div>
                    <div className="shrink-0">
                      {session.status === "completed" && (
                        <Badge label="Done" variant="success" />
                      )}
                      {session.status === "active" && (
                        <Badge label="Active" variant="info" />
                      )}
                      {session.status === "upcoming" && (
                        <Badge label="Soon" variant="muted" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-dashed border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-1">
              Facilitation Tools
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Session facilitation guides, cohort messaging, and aggregate
              analytics.
            </p>
            <div className="mt-3 text-xs text-gray-400">Coming soon</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
