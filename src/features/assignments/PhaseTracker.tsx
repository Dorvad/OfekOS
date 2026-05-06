import type { AssignmentPhase, AssignmentAccent } from "@/lib/types";

interface PhaseTrackerProps {
  phases: AssignmentPhase[];
  currentIndex: number;
  accentColor: AssignmentAccent;
}

const accentStroke: Record<AssignmentAccent, string> = {
  amber:   "#f59e0b",
  violet:  "#8b5cf6",
  teal:    "#14b8a6",
  emerald: "#10b981",
  orange:  "#f97316",
  indigo:  "#6366f1",
};

const accentBg: Record<AssignmentAccent, string> = {
  amber:   "bg-amber-500",
  violet:  "bg-violet-500",
  teal:    "bg-teal-500",
  emerald: "bg-emerald-500",
  orange:  "bg-orange-500",
  indigo:  "bg-indigo-500",
};

const accentText: Record<AssignmentAccent, string> = {
  amber:   "text-amber-700",
  violet:  "text-violet-700",
  teal:    "text-teal-700",
  emerald: "text-emerald-700",
  orange:  "text-orange-700",
  indigo:  "text-indigo-700",
};

export default function PhaseTracker({ phases, currentIndex, accentColor }: PhaseTrackerProps) {
  const stroke = accentStroke[accentColor];
  const bg = accentBg[accentColor];
  const activeText = accentText[accentColor];

  return (
    <div className="w-full">
      {/* Stepper row */}
      <div className="flex items-center" dir="rtl">
        {phases.map((phase, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div key={phase.id} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div className="relative flex-none">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all ${
                    isCompleted
                      ? `${bg} border-transparent text-white`
                      : isCurrent
                      ? `border-current ${activeText} bg-white`
                      : "border-gray-200 text-gray-400 bg-white"
                  }`}
                  style={isCurrent ? { borderColor: stroke } : undefined}
                >
                  {isCompleted ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                {/* Pulse on current */}
                {isCurrent && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-25"
                    style={{ backgroundColor: stroke }}
                  />
                )}
              </div>

              {/* Connector line */}
              {i < phases.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-1"
                  style={{
                    backgroundColor: i < currentIndex ? stroke : "#e5e7eb",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current phase label */}
      <p className="text-center text-xs font-medium mt-2" style={{ color: stroke }}>
        {phases[currentIndex]?.label ?? ""}
      </p>
    </div>
  );
}
