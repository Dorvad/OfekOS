"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { useState, useEffect } from "react";
import { countWorkbookSectionsWithContent } from "@/lib/workbook-storage";
import type { WorkbookSection } from "@/lib/types";

interface WorkbookProgressSummaryProps {
  sections: WorkbookSection[];
}

export default function WorkbookProgressSummary({ sections }: WorkbookProgressSummaryProps) {
  const [sectionsWithContent, setSectionsWithContent] = useState<number | null>(null);

  useEffect(() => {
    setSectionsWithContent(countWorkbookSectionsWithContent(sections.map((s) => s.id)));
  }, [sections]);

  const totalSections = sections.length;
  const count = sectionsWithContent ?? 0;
  const percentage = Math.round((count / totalSections) * 100);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">My Workbook</h3>
        <span className="text-xs text-gray-400">
          {sectionsWithContent === null ? "—" : `${percentage}%`}
        </span>
      </div>
      <ProgressBar
        value={sectionsWithContent !== null ? percentage : 0}
        color="emerald"
        className="mb-3"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {sectionsWithContent === null
            ? "Loading..."
            : `${count} of ${totalSections} sections have content`}
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
