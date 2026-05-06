import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import RoleBadge from "@/components/shared/RoleBadge";
import { MOCK_PARTICIPANTS, MOCK_SESSIONS, MOCK_PROGRAM } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const completedSessions = MOCK_SESSIONS.filter(
    (s) => s.status === "completed"
  ).length;

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
          <RoleBadge role="admin" active />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Program overview and operations</p>
      </div>

      {/* Program card */}
      <Card className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
              Active Program
            </div>
            <div className="font-semibold text-gray-900">{MOCK_PROGRAM.name}</div>
            <div className="text-sm text-gray-500 mt-1">
              {formatDate(MOCK_PROGRAM.startDate)} →{" "}
              {formatDate(MOCK_PROGRAM.endDate)}
            </div>
          </div>
          <Badge label="Active" variant="success" />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <div className="text-2xl font-bold text-slate-700">
            {MOCK_PROGRAM.cohortSize}
          </div>
          <div className="text-xs text-gray-500 mt-1">Participants</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {MOCK_PROGRAM.completionRate}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Avg. Completion</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {completedSessions}
          </div>
          <div className="text-xs text-gray-500 mt-1">Sessions Done</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {MOCK_SESSIONS.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total Sessions</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* All participants */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">All Participants</h2>
              <span className="text-xs text-gray-400">
                {MOCK_PARTICIPANTS.length} shown
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_PARTICIPANTS.map((p) => (
                <div
                  key={p.id}
                  className="px-6 py-3 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-gray-900">
                      {p.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {p.email}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-sm font-semibold text-gray-700 w-10 text-right">
                      {p.progress}%
                    </div>
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          p.progress === 100
                            ? "bg-emerald-500"
                            : p.progress >= 60
                            ? "bg-slate-500"
                            : "bg-gray-300"
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
          <Card>
            <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                "Manage cohort settings",
                "Invite participants",
                "Export progress report",
              ].map((action) => (
                <div
                  key={action}
                  className="text-xs text-gray-600 p-2.5 bg-gray-50 rounded-lg cursor-not-allowed opacity-60"
                >
                  {action}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
              Full admin panel — coming soon
            </div>
          </Card>

          <Card className="border-dashed border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-1">Analytics</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Completion rates, engagement trends, cohort health metrics, and
              session analytics.
            </p>
            <div className="mt-3 text-xs text-gray-400">Coming soon</div>
          </Card>

          <Card className="border-dashed border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-1">
              Program Settings
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Configure program timeline, session structure, roles, and
              notifications.
            </p>
            <div className="mt-3 text-xs text-gray-400">Coming soon</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
