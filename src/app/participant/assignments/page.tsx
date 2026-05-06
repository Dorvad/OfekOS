import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import AssignmentListClient from "@/features/assignments/AssignmentListClient";

export default function AssignmentsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">המטלות שלי</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          שש מטלות לאורך התוכנית — כל אחת עם חוויה ייחודית
        </p>
      </div>
      <AssignmentListClient assignments={MOCK_ASSIGNMENTS} />
    </div>
  );
}
