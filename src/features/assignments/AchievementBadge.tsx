import type { AssignmentAccent } from "@/lib/types";

interface AchievementBadgeProps {
  label: string;
  accentColor: AssignmentAccent;
  onDismiss: () => void;
}

const accentStyles: Record<AssignmentAccent, { bg: string; text: string; ring: string }> = {
  amber:   { bg: "bg-amber-100",   text: "text-amber-800",   ring: "ring-amber-400" },
  violet:  { bg: "bg-violet-100",  text: "text-violet-800",  ring: "ring-violet-400" },
  teal:    { bg: "bg-teal-100",    text: "text-teal-800",    ring: "ring-teal-400" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-800", ring: "ring-emerald-400" },
  orange:  { bg: "bg-orange-100",  text: "text-orange-800",  ring: "ring-orange-400" },
  indigo:  { bg: "bg-indigo-100",  text: "text-indigo-800",  ring: "ring-indigo-400" },
};

export default function AchievementBadge({ label, accentColor, onDismiss }: AchievementBadgeProps) {
  const style = accentStyles[accentColor];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl animate-badge-appear">
        {/* Badge icon */}
        <div
          className={`w-24 h-24 rounded-full ${style.bg} ${style.ring} ring-4 flex items-center justify-center mx-auto mb-4`}
        >
          <span className="text-4xl">🏅</span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">הישג נפתח!</h2>
        <p className={`text-lg font-semibold ${style.text} mb-6`}>{label}</p>

        <button
          onClick={onDismiss}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          המשך
        </button>
      </div>
    </div>
  );
}
