import Link from "next/link";
import Card from "@/components/ui/Card";

interface WorkbookProgressSummaryProps {
  sectionsWithContent: number;
  totalSections: number;
}

export default function WorkbookProgressSummary({
  sectionsWithContent,
  totalSections,
}: WorkbookProgressSummaryProps) {
  const percentage = Math.round((sectionsWithContent / totalSections) * 100);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">My Workbook</h3>
        <span className="text-xs text-gray-400">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {sectionsWithContent} of {totalSections} sections have content
        </span>
        <Link
          href="/participant/workbook"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          Open workbook →
        </Link>
      </div>
    </Card>
  );
}
