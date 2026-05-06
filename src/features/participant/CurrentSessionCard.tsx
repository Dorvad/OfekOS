import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Session, SessionContent } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface CurrentSessionCardProps {
  session: Session;
  content: SessionContent;
}

export default function CurrentSessionCard({
  session,
  content,
}: CurrentSessionCardProps) {
  return (
    <Card className="border-l-4 border-l-indigo-500 border-t-0 border-r-0 border-b-0 rounded-l-none">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge label="Current Session" variant="info" />
            <span className="text-xs text-gray-400">
              {formatDate(session.date)} · {session.durationMinutes} min
            </span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {session.title}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {content.whyItMatters}
          </p>
        </div>
        <div className="shrink-0">
          <Link href={`/participant/sessions/${session.id}`}>
            <Button variant="primary" size="sm">
              Continue Session →
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
