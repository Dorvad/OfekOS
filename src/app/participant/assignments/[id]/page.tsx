import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import AssignmentDetailClient from "@/features/assignments/AssignmentDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const accentText: Record<string, string> = {
  amber:   "text-amber-700",
  violet:  "text-violet-700",
  teal:    "text-teal-700",
  emerald: "text-emerald-700",
  orange:  "text-orange-700",
  indigo:  "text-indigo-700",
};

export default async function AssignmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const mockAssignment = MOCK_ASSIGNMENTS.find((a) => a.id === id);
  if (!mockAssignment) notFound();

  const supabase = await createClient();
  const { data: dbAssignment } = await supabase
    .from("assignments")
    .select("is_unlocked")
    .eq("id", id)
    .single();

  const assignment = {
    ...mockAssignment,
    isUnlocked: dbAssignment ? dbAssignment.is_unlocked : mockAssignment.isUnlocked,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-5">
      <Link
        href="/participant/assignments"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        חזרה למטלות
      </Link>

      <div className="mb-5">
        <span className={`text-xs font-semibold uppercase tracking-wide ${accentText[assignment.accentColor]}`}>
          מפגש {assignment.sessionNumber}
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-0.5 leading-tight">{assignment.title}</h1>
        <p className="text-sm text-gray-400 mt-1">{assignment.subtitle}</p>
      </div>

      <AssignmentDetailClient assignment={assignment} />
    </div>
  );
}
