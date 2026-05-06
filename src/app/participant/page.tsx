import Link from "next/link";
import { MOCK_USER, MOCK_PROGRAM, MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import Card from "@/components/ui/Card";

export default function ParticipantDashboard() {
  const currentAssignment = MOCK_ASSIGNMENTS.find((a) => a.isUnlocked);
  const unlockedCount = MOCK_ASSIGNMENTS.filter((a) => a.isUnlocked).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          שלום, {MOCK_USER.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{MOCK_PROGRAM.name}</p>
      </div>

      {/* Current assignment banner */}
      {currentAssignment && (
        <Card className="mb-5 border-r-4 border-amber-400 bg-amber-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
                המטלה הנוכחית
              </p>
              <h2 className="font-bold text-gray-900">{currentAssignment.title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{currentAssignment.subtitle}</p>
            </div>
            <Link
              href={`/participant/assignments/${currentAssignment.id}`}
              className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              פתח ←
            </Link>
          </div>
        </Card>
      )}

      {/* Progress strip */}
      <Card className="mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">המסע שלך</h2>
        <div className="flex items-center gap-2">
          {MOCK_ASSIGNMENTS.map((a, i) => (
            <div key={a.id} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  a.isUnlocked
                    ? "border-indigo-500 bg-indigo-100 text-indigo-700"
                    : "border-gray-200 bg-gray-50 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              {i < MOCK_ASSIGNMENTS.length - 1 && (
                <div className="w-4 h-0.5 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {unlockedCount} מתוך {MOCK_ASSIGNMENTS.length} מטלות זמינות
        </p>
      </Card>

      {/* Quick access */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        גישה מהירה
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/participant/assignments", label: "מטלות", desc: "6 מטלות", color: "indigo" },
          { href: "/participant/insights", label: "תובנות", desc: "האוסף שלי", color: "violet" },
          { href: "/participant/prepare", label: "הכנה", desc: "למפגש הבא", color: "emerald" },
          { href: "/participant/resources", label: "משאבים", desc: "קבצים ותבניות", color: "amber" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <div className="font-semibold text-sm text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
