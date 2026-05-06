import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/lib/types";

interface TaskItemProps {
  task: Task;
  status: TaskStatus;
  onToggle?: (taskId: string) => void;
}

const typeLabel: Record<Task["type"], string> = {
  preparation: "Preparation",
  reflection: "Reflection",
  workbook: "Workbook",
  practice: "Practice",
};

export default function TaskItem({ task, status, onToggle }: TaskItemProps) {
  const isCompleted = status === "completed";
  const isLocked = status === "locked";
  const isInteractive = !isLocked && !!onToggle;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all",
        isCompleted && "border-emerald-200 bg-emerald-50/50",
        !isCompleted && !isLocked && "border-amber-200 bg-amber-50/30",
        isLocked && "border-gray-100 bg-gray-50 opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          disabled={isLocked || !onToggle}
          onClick={() => onToggle?.(task.id)}
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
            isCompleted && "bg-emerald-500 border-emerald-500",
            !isCompleted && !isLocked && "border-amber-300 bg-white hover:border-indigo-400",
            isLocked && "border-gray-200 bg-white cursor-not-allowed",
          )}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted && (
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              {typeLabel[task.type]}
            </span>
          </div>
          <p className={cn(
            "text-sm font-medium leading-snug",
            isCompleted ? "line-through text-gray-400" : "text-gray-900"
          )}>
            {task.title}
          </p>
          <p className={cn(
            "text-xs mt-1 leading-relaxed",
            isLocked ? "text-gray-400" : "text-gray-500"
          )}>
            {isLocked ? "Complete the current session to unlock" : task.description}
          </p>
        </div>
      </div>
    </div>
  );
}
