import type { Assignment, AssignmentStatus } from "@/lib/types";

interface ProgramAxisProps {
  assignments: Assignment[];
  statuses: Record<string, AssignmentStatus>;
}

const accentColors: Record<string, string> = {
  amber:   "#f59e0b",
  violet:  "#8b5cf6",
  teal:    "#14b8a6",
  emerald: "#10b981",
  orange:  "#f97316",
  indigo:  "#6366f1",
};

export default function ProgramAxis({ assignments, statuses }: ProgramAxisProps) {
  return (
    <div className="flex items-center gap-2" dir="rtl">
      {assignments.map((a, i) => {
        const status = statuses[a.id] ?? "locked";
        const isLocked = !a.isUnlocked || status === "locked";
        const isDone = status === "submitted" || status === "achieved";
        const isActive = !isLocked && !isDone;
        const color = accentColors[a.accentColor] ?? "#6366f1";

        return (
          <div key={a.id} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 relative"
              style={{
                borderColor: isLocked ? "#e5e7eb" : color,
                backgroundColor: isDone ? color : isActive ? `${color}20` : "#f9fafb",
                color: isDone ? "#fff" : isLocked ? "#9ca3af" : color,
              }}
            >
              {isDone ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full animate-ping opacity-20"
                  style={{ backgroundColor: color }}
                />
              )}
            </div>
            {i < assignments.length - 1 && (
              <div className="w-4 h-0.5 bg-gray-200 shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
