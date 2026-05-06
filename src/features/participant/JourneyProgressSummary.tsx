import Link from "next/link";
import Card from "@/components/ui/Card";

interface JourneyProgressSummaryProps {
  completedCount: number;
  totalCount: number;
}

export default function JourneyProgressSummary({
  completedCount,
  totalCount,
}: JourneyProgressSummaryProps) {
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Your Journey</h3>
        <span className="text-xs text-gray-400">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {completedCount} of {totalCount} sessions complete
        </span>
        <Link
          href="/participant/journey"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          View path →
        </Link>
      </div>
    </Card>
  );
}
