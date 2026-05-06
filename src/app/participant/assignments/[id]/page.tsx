import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import AssignmentDetailClient from "@/features/assignments/AssignmentDetailClient";

export function generateStaticParams() {
  return MOCK_ASSIGNMENTS.map((a) => ({ id: a.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssignmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const assignment = MOCK_ASSIGNMENTS.find((a) => a.id === id);
  if (!assignment) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link
        href="/participant/assignments"
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        → חזרה למטלות
      </Link>

      <div className="mb-5">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          מפגש {assignment.sessionNumber}
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{assignment.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{assignment.subtitle}</p>
      </div>

      <AssignmentDetailClient assignment={assignment} />
    </div>
  );
}
