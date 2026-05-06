import Link from "next/link";
import { MOCK_USER, MOCK_PROGRAM, MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import Card from "@/components/ui/Card";
import ProgramAxisClient from "@/features/assignments/ProgramAxisClient";

const accentHero: Record<string, string> = {
  amber:   "from-amber-400 to-amber-500",
  violet:  "from-violet-500 to-violet-600",
  teal:    "from-teal-400 to-teal-500",
  emerald: "from-emerald-400 to-emerald-500",
  orange:  "from-orange-400 to-orange-500",
  indigo:  "from-indigo-500 to-indigo-600",
};

export default function ParticipantDashboard() {
  const currentAssignment = MOCK_ASSIGNMENTS.find((a) => a.isUnlocked);
  const unlockedCount = MOCK_ASSIGNMENTS.filter((a) => a.isUnlocked).length;
  const firstName = MOCK_USER.name.split(" ")[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">שלום, {firstName}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{MOCK_PROGRAM.name.split("—")[0].trim()}</p>
      </div>

      {/* Current assignment — hero card */}
      {currentAssignment && (
        <Link href={`/participant/assignments/${currentAssignment.id}`} className="block group">
          <div className={`rounded-2xl bg-gradient-to-br ${accentHero[currentAssignment.accentColor]} p-5 shadow-md group-hover:shadow-lg transition-shadow`}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 bg-white/20 text-white">
                  מפגש {currentAssignment.sessionNumber} · מטלה פעילה
                </span>
                <h2 className="text-white font-bold text-xl leading-snug">
                  {currentAssignment.title}
                </h2>
                <p className="text-white/80 text-sm mt-1">{currentAssignment.subtitle}</p>
              </div>
              <div className="shrink-0 mt-1 px-3 py-2 rounded-xl text-sm font-semibold bg-white/20 group-hover:bg-white/30 text-white transition-colors">
                פתח ←
              </div>
            </div>
            <p className="text-white/70 text-xs leading-relaxed line-clamp-2">
              {currentAssignment.missionBrief}
            </p>
          </div>
        </Link>
      )}

      {/* Program journey */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">המסע שלך</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {unlockedCount}/{MOCK_ASSIGNMENTS.length} פתוחות
          </span>
        </div>
        <ProgramAxisClient assignments={MOCK_ASSIGNMENTS} />
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-400">6 מטלות · 4 שלבים כל אחת</span>
          <Link
            href="/participant/assignments"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            כל המטלות ←
          </Link>
        </div>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/participant/insights">
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="text-2xl font-bold text-indigo-600 mb-1">0</div>
            <div className="text-xs text-gray-500">תובנות שנשמרו</div>
          </Card>
        </Link>
        <Link href="/participant/assignments">
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="text-2xl font-bold text-gray-700 mb-1">
              {unlockedCount}
            </div>
            <div className="text-xs text-gray-500">מטלות זמינות</div>
          </Card>
        </Link>
      </div>

    </div>
  );
}
