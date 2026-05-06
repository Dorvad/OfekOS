import Link from "next/link";
import Card from "@/components/ui/Card";
import type { WorkbookSection } from "@/lib/types";

interface WorkbookPromptCardProps {
  section: WorkbookSection;
}

export default function WorkbookPromptCard({ section }: WorkbookPromptCardProps) {
  return (
    <Card className="bg-indigo-50 border-indigo-100 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-indigo-600">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-0.5">
            Workbook
          </p>
          <p className="text-sm font-medium text-indigo-900 mb-1">{section.title}</p>
          <p className="text-xs text-indigo-700 leading-relaxed line-clamp-2">{section.prompt}</p>
          <Link
            href={`/participant/workbook/${section.id}`}
            className="inline-block mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Write in workbook →
          </Link>
        </div>
      </div>
    </Card>
  );
}
