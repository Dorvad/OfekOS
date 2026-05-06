import Link from "next/link";
import { MOCK_USER, MOCK_PROGRAM, MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import Card from "@/components/ui/Card";
import ProgramAxisClient from "@/features/assignments/ProgramAxisClient";

const accentCard: Record<string, string> = {
  amber:   "border-amber-300 bg-amber-50",
  violet:  "border-violet-300 bg-violet-50",
  teal:    "border-teal-300 bg-teal-50",
  emerald: "border-emerald-300 bg-emerald-50",
  orange:  "border-orange-300 bg-orange-50",
  indigo:  "border-indigo-300 bg-indigo-50",
};

const accentButton: Record<string, string> = {
  amber:   "bg-amber-500 hover:bg-amber-600",
  violet:  "bg-violet-500 hover:bg-violet-600",
  teal:    "bg-teal-500 hover:bg-teal-600",
  emerald: "bg-emerald-500 hover:bg-emerald-600",
  orange:  "bg-orange-500 hover:bg-orange-600",
  indigo:  "bg-indigo-500 hover:bg-indigo-600",
};

const accentLabel: Record<string, string> = {
  amber:   "text-amber-700",
  violet:  "text-violet-700",
  teal:    "text-teal-700",
  emerald: "text-emerald-700",
  orange:  "text-orange-700",
  indigo:  "text-indigo-700",
};

export default function ParticipantDashboard() {
  const currentAssignment = MOCK_ASSIGNMENTS.find((a) => a.isUnlocked);
  const unlockedCount = MOCK_ASSIGNMENTS.filter((a) => a.isUnlocked).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          שלום, {MOCK_USER.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">{MOCK_PROGRAM.name}</p>
      </div>

      {/* Current assignment card */}
      {currentAssignment && (
        <div className={`rounded-2xl border-2 p-5 mb-5 ${accentCard[currentAssignment.accentColor]}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${accentLabel[currentAssignment.accentColor]}`}>
                המטלה הנוכחית — מפגש {currentAssignment.sessionNumber}
              </p>
              <h2 className="font-bold text-gray-900 text-lg leading-snug">
                {currentAssignment.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{currentAssignment.subtitle}</p>
            </div>
            <Link
              href={`/participant/assignments/${currentAssignment.id}`}
              className={`shrink-0 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors ${accentButton[currentAssignment.accentColor]}`}
            >
              פתח ←
            </Link>
          </div>
        </div>
      )}

      {/* Program axis */}
      <Card className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">המסע שלך</h2>
          <span className="text-xs text-gray-400">
            {unlockedCount} מתוך {MOCK_ASSIGNMENTS.length} מטלות זמינות
          </span>
        </div>
        <ProgramAxisClient assignments={MOCK_ASSIGNMENTS} />
      </Card>

      {/* Quick access */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        גישה מהירה
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/participant/assignments", label: "מטלות",    desc: `${MOCK_ASSIGNMENTS.length} מטלות` },
          { href: "/participant/insights",    label: "תובנות",   desc: "האוסף שלי" },
          { href: "/participant/prepare",     label: "הכנה",     desc: "למפגש הבא" },
          { href: "/participant/resources",   label: "משאבים",   desc: "קבצים ותבניות" },
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
