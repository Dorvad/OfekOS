import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_WORKBOOK_SECTIONS, MOCK_SESSIONS } from "@/lib/mock-data";
import WorkbookEditor from "@/features/workbook/WorkbookEditor";

export function generateStaticParams() {
  return MOCK_WORKBOOK_SECTIONS.map((s) => ({ section: s.id }));
}

interface PageProps {
  params: Promise<{ section: string }>;
}

export default async function WorkbookSectionPage({ params }: PageProps) {
  const { section: sectionId } = await params;

  const section = MOCK_WORKBOOK_SECTIONS.find((s) => s.id === sectionId);
  if (!section) notFound();

  const linkedSession = section.sessionId
    ? MOCK_SESSIONS.find((s) => s.id === section.sessionId)
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link
        href="/participant/workbook"
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4 inline-block"
      >
        ← Back to Workbook
      </Link>

      <div className="mb-6">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          Section {section.order} of {MOCK_WORKBOOK_SECTIONS.length}
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{section.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{section.subtitle}</p>
        {linkedSession && (
          <p className="text-xs text-gray-400 mt-1">
            Introduced in:{" "}
            <Link
              href={`/participant/sessions/${linkedSession.id}`}
              className="text-indigo-600 hover:text-indigo-700"
            >
              {linkedSession.title}
            </Link>
          </p>
        )}
      </div>

      <WorkbookEditor section={section} />
    </div>
  );
}
