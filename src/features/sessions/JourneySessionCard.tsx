import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Session } from "@/lib/types";
import type { SessionLockStatus } from "@/lib/progress";
import { formatDate, cn } from "@/lib/utils";

interface JourneySessionCardProps {
  session: Session;
  index: number;
  lockStatus: SessionLockStatus;
  taskCount: number;
}

function StatusIndicator({ status }: { status: SessionLockStatus }) {
  if (status === "completed") {
    return (
      <div className="w-9 h-9 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-600">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  if (status === "active") {
    return (
      <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center shrink-0 relative">
        <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
      </div>
    );
  }
  if (status === "unlocked") {
    return (
      <div className="w-9 h-9 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shrink-0">
        <div className="w-2 h-2 rounded-full bg-gray-300" />
      </div>
    );
  }
  // locked
  return (
    <div className="w-9 h-9 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-gray-300">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </div>
  );
}

export default function JourneySessionCard({
  session,
  index,
  lockStatus,
  taskCount,
}: JourneySessionCardProps) {
  const isAccessible = lockStatus === "completed" || lockStatus === "active" || lockStatus === "unlocked";
  const isLocked = lockStatus === "locked";

  const cardContent = (
    <div
      className={cn(
        "bg-white rounded-xl border p-4 shadow-sm transition-all",
        lockStatus === "active" && "border-indigo-200 bg-indigo-50/30 shadow-md",
        lockStatus === "completed" && "border-gray-200",
        lockStatus === "unlocked" && "border-gray-200 hover:shadow-md hover:border-gray-300",
        lockStatus === "locked" && "border-gray-100 bg-gray-50 opacity-60",
      )}
    >
      <div className="flex items-start gap-4">
        <StatusIndicator status={lockStatus} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                Session {index + 1}
              </span>
              <h3 className={cn(
                "font-semibold text-sm leading-snug",
                isLocked ? "text-gray-400" : "text-gray-900"
              )}>
                {session.title}
              </h3>
            </div>
            <div className="shrink-0">
              {lockStatus === "completed" && <Badge label="Completed" variant="success" />}
              {lockStatus === "active" && <Badge label="In Progress" variant="info" />}
              {lockStatus === "unlocked" && <Badge label="Up Next" variant="muted" />}
              {lockStatus === "locked" && <Badge label="Locked" variant="muted" />}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className={cn("text-xs", isLocked ? "text-gray-400" : "text-gray-500")}>
              {formatDate(session.date)}
            </span>
            <span className="text-gray-300">·</span>
            <span className={cn("text-xs", isLocked ? "text-gray-400" : "text-gray-500")}>
              {session.durationMinutes} min
            </span>
            <span className="text-gray-300">·</span>
            <span className={cn("text-xs", isLocked ? "text-gray-400" : "text-gray-500")}>
              {taskCount} tasks
            </span>
          </div>
          {!isLocked && (
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
              {session.description}
            </p>
          )}
          {isLocked && (
            <p className="text-xs text-gray-400 mt-1.5">
              Complete the previous session to unlock
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (!isAccessible) {
    return <div className="cursor-default">{cardContent}</div>;
  }

  return (
    <Link href={`/participant/sessions/${session.id}`} className="block group">
      {cardContent}
    </Link>
  );
}
