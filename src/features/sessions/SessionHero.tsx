import Badge from "@/components/ui/Badge";
import type { Session } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface SessionHeroProps {
  session: Session;
  index: number;
}

export default function SessionHero({ session, index }: SessionHeroProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Session {index + 1}
        </span>
        {session.status === "completed" && <Badge label="Completed" variant="success" />}
        {session.status === "active" && <Badge label="In Progress" variant="info" />}
        {session.status === "upcoming" && <Badge label="Upcoming" variant="muted" />}
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{session.title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>{formatDate(session.date)}</span>
        <span className="text-gray-300">·</span>
        <span>{session.durationMinutes} min</span>
      </div>
      {session.status === "active" && (
        <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5 text-sm text-indigo-700 font-medium">
          This is your current session
        </div>
      )}
    </div>
  );
}
