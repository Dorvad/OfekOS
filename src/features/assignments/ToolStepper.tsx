import { cn } from "@/lib/utils";

const ACCENT: Record<string, string> = {
  amber:   "#f59e0b",
  violet:  "#8b5cf6",
  teal:    "#14b8a6",
  emerald: "#10b981",
  orange:  "#f97316",
  indigo:  "#6366f1",
};

interface ToolStepperProps {
  steps: string[];
  current: number;
  accent: string;
}

export default function ToolStepper({ steps, current, accent }: ToolStepperProps) {
  const color = ACCENT[accent] ?? ACCENT.indigo;
  return (
    <div className="flex items-center gap-0 mb-5">
      {steps.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                  done   ? "text-white border-transparent" :
                  active ? "bg-white border-current" :
                           "bg-white border-gray-200 text-gray-300"
                )}
                style={{
                  backgroundColor: done ? color : undefined,
                  borderColor:     active ? color : undefined,
                  color:           active ? color : undefined,
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={cn("text-[10px] font-medium leading-none text-center hidden sm:block max-w-[60px] truncate",
                  done || active ? "" : "text-gray-300"
                )}
                style={{ color: done || active ? color : undefined }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-px mb-4"
                style={{ backgroundColor: done ? color : "#e5e7eb" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
