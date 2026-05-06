import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_ASSIGNMENTS.map((a) => ({ id: a.id }));
}

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assignment = MOCK_ASSIGNMENTS.find((a) => a.id === id);
  if (!assignment) return <div className="p-8 text-gray-400">מטלה לא נמצאה</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <p className="text-gray-400 text-sm">טוען: {assignment.title}</p>
    </div>
  );
}
