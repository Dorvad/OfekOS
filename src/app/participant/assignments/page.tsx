import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import { createServiceClient } from "@/lib/supabase/service";
import AssignmentListClient from "@/features/assignments/AssignmentListClient";
import ParticipantRefresher from "@/features/assignments/ParticipantRefresher";
import type { Assignment } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  const supabase = createServiceClient();
  const { data: dbAssignments } = await supabase
    .from("assignments")
    .select("id, is_unlocked");

  const lockMap = Object.fromEntries(
    (dbAssignments ?? []).map((a) => [a.id, a.is_unlocked])
  );

  const assignments: Assignment[] = MOCK_ASSIGNMENTS.map((a) => ({
    ...a,
    isUnlocked: lockMap[a.id] !== undefined ? lockMap[a.id] : a.isUnlocked,
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <ParticipantRefresher />
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">המטלות שלי</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          שש מטלות לאורך התוכנית — כל אחת עם חוויה ייחודית
        </p>
      </div>
      <AssignmentListClient assignments={assignments} />
    </div>
  );
}
