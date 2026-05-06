import Link from "next/link";
import Card from "@/components/ui/Card";
import RoleBadge from "@/components/shared/RoleBadge";
import { MOCK_PARTICIPANTS, MOCK_PROGRAM } from "@/lib/mock-data";

export default function ManagerDashboard() {
  const directReports = MOCK_PARTICIPANTS.slice(0, 2);
  const avgProgress = Math.round(
    directReports.reduce((sum, p) => sum + p.progress, 0) / directReports.length
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
          <RoleBadge role="manager" active />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-500 mt-1">Your direct reports in the program</p>
      </div>

      {/* Program banner */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 text-sm text-emerald-800 font-medium">
        {MOCK_PROGRAM.name}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {directReports.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Direct Reports</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900">{avgProgress}%</div>
          <div className="text-xs text-gray-500 mt-1">Avg. Progress</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-amber-500">1</div>
          <div className="text-xs text-gray-500 mt-1">Pending Actions</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Direct reports */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">My Direct Reports</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {directReports.map((p) => (
                <div key={p.id} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {p.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {p.sessionsCompleted} of {p.totalSessions} sessions
                        completed
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-sm font-semibold text-gray-900">
                        {p.progress}%
                      </div>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
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
            <h2 className="font-semibold text-gray-900 mb-3">
              Pending Actions
            </h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                Validate session completion for Noa Katz
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
              Full action center — coming soon
            </div>
          </Card>

          <Card className="border-dashed border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-1">
              Manager Support
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Coaching conversation guides, validation frameworks, and feedback
              templates.
            </p>
            <div className="mt-3 text-xs text-gray-400">Coming soon</div>
          </Card>

          <Card className="border-dashed border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-1">
              Shared Workbook Entries
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Review outputs your team members have chosen to share with you.
            </p>
            <div className="mt-3 text-xs text-gray-400">Coming soon</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
