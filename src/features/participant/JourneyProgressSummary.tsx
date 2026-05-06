import Link from "next/link";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

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
      <ProgressBar value={percentage} color="indigo" className="mb-3" />
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
