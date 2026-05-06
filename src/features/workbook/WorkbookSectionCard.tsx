"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getWorkbookEntry } from "@/lib/workbook-storage";
import type { WorkbookSection } from "@/lib/types";

interface WorkbookSectionCardProps {
  section: WorkbookSection;
  sessionTitle?: string;
}

export default function WorkbookSectionCard({
  section,
  sessionTitle,
}: WorkbookSectionCardProps) {
  const [hasContent, setHasContent] = useState(false);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    const entry = getWorkbookEntry(section.id);
    setHasContent(!!entry && entry.content.trim().length > 0);
    setIsShared(entry?.privacy === "shared");
  }, [section.id]);

  return (
    <Link href={`/participant/workbook/${section.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            Section {section.order}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {hasContent && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Written
              </span>
            )}
            {isShared && (
              <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                Shared
              </span>
            )}
          </div>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{section.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed flex-1">{section.subtitle}</p>
        {sessionTitle && (
          <p className="text-[10px] text-gray-400 mt-3">From: {sessionTitle}</p>
        )}
        {!hasContent && (
          <div className="mt-3 text-xs font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors">
            Start writing →
          </div>
        )}
        {hasContent && (
          <div className="mt-3 text-xs font-medium text-gray-400 group-hover:text-indigo-600 transition-colors">
            Open →
          </div>
        )}
      </div>
    </Link>
  );
}
