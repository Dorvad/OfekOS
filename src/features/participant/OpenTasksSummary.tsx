import Link from "next/link";
import Card from "@/components/ui/Card";
import type { Session } from "@/lib/types";

interface OpenTasksSummaryProps {
  openCount: number;
  activeSession: Session | undefined;
}

export default function OpenTasksSummary({
  openCount,
  activeSession,
}: OpenTasksSummaryProps) {
  const sessionHref = activeSession
    ? `/participant/sessions/${activeSession.id}`
    : "/participant/journey";

  if (openCount === 0) {
    return (
      <Card className="bg-emerald-50 border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">All caught up</p>
            <p className="text-xs text-emerald-600">No open tasks right now</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-amber-50 border-amber-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-amber-700">{openCount}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {openCount} task{openCount !== 1 ? "s" : ""} pending
            </p>
            <p className="text-xs text-amber-600">
              {activeSession ? `From: ${activeSession.title}` : "Current session"}
            </p>
          </div>
        </div>
        <Link
          href={sessionHref}
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 shrink-0"
        >
          View tasks →
        </Link>
      </div>
    </Card>
  );
}
