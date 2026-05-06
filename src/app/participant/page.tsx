import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import RoleBadge from "@/components/shared/RoleBadge";
import {
  MOCK_USER,
  MOCK_SESSIONS,
  MOCK_PROGRAM,
  MOCK_WORKBOOK_ENTRIES,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function ParticipantDashboard() {
  const completed = MOCK_SESSIONS.filter((s) => s.status === "completed");

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
          <RoleBadge role="participant" active />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">My Learning Journey</h1>
        <p className="text-gray-500 mt-1">Welcome back, {MOCK_USER.name}</p>
      </div>

      {/* Program banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-sm text-indigo-800 font-medium">
        {MOCK_PROGRAM.name}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {completed.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Sessions Completed</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {MOCK_SESSIONS.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total Sessions</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {MOCK_WORKBOOK_ENTRIES.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Workbook Entries</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-amber-600">60%</div>
          <div className="text-xs text-gray-500 mt-1">Overall Progress</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions list */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Program Sessions</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_SESSIONS.map((session) => (
                <div
                  key={session.id}
                  className="px-6 py-4 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-gray-900">
                      {session.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {formatDate(session.date)} · {session.durationMinutes} min
                    </div>
                    {session.status === "active" && (
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                        {session.description}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {session.status === "completed" && (
                      <Badge label="Completed" variant="success" />
                    )}
                    {session.status === "active" && (
                      <Badge label="In Progress" variant="info" />
                    )}
                    {session.status === "upcoming" && (
                      <Badge label="Upcoming" variant="muted" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <Card>
            <h2 className="font-semibold text-gray-900 mb-3">My Workbook</h2>
            <div className="space-y-2">
              {MOCK_WORKBOOK_ENTRIES.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between text-sm gap-2"
                >
                  <span className="text-gray-700 truncate">
                    {entry.sessionTitle}
                  </span>
                  {entry.isShared && (
                    <Badge label="Shared" variant="success" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
              Full workbook — coming soon
            </div>
          </Card>

          <Card className="border-dashed border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-1">
              AI Practice Space
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Practice difficult conversations and receive AI-powered feedback
              in a safe simulation environment.
            </p>
            <div className="mt-3 text-xs text-gray-400">Coming soon</div>
          </Card>

          <Card className="border-dashed border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-1">Resources</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Readings, frameworks, and additional materials from your program.
            </p>
            <div className="mt-3 text-xs text-gray-400">Coming soon</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
