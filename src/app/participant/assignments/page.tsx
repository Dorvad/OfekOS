import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import AssignmentListClient from "@/features/assignments/AssignmentListClient";

export default function AssignmentsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">המטלות שלי</h1>
        <p className="text-sm text-gray-500 mt-1">
          שש מטלות לאורך התוכנית — כל אחת עם חוויה ייחודית
        </p>
      </div>

      <AssignmentListClient assignments={MOCK_ASSIGNMENTS} />
    </div>
  );
}
