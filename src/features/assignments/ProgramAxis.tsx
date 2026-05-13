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
    <div className="flex items-center" dir="rtl">
      {assignments.map((a, i) => {
        const status = statuses[a.id] ?? "locked";
        const isLocked = !a.isUnlocked || status === "locked";
        const isDone = status === "submitted" || status === "achieved";
        const isActive = !isLocked && !isDone;
        const color = accentColors[a.accentColor] ?? "#6366f1";

        const isNextConnectorFilled = i < assignments.length - 1 && isDone;

        return (
          <div key={a.id} className="flex items-center">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 relative shrink-0"
              style={{
                borderColor: isLocked ? "#e5e7eb" : color,
                backgroundColor: isDone ? color : isActive ? `${color}15` : "transparent",
                color: isDone ? "#fff" : isLocked ? "#9ca3af" : color,
              }}
            >
              {isDone ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full animate-ping opacity-25"
                  style={{ backgroundColor: color }}
                />
              )}
            </div>
            {i < assignments.length - 1 && (
              <div
                className="w-5 h-1 shrink-0 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: isNextConnectorFilled ? color : "#e5e7eb",
                  opacity: isLocked ? 0.5 : 1,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
