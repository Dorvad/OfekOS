"use client";

import { useEffect, useState } from "react";
import type { AdminResource } from "@/lib/types";

const TYPE_ICONS: Record<string, string> = {
  pdf: "📄",
  link: "🔗",
  template: "📝",
  video: "🎥",
  other: "📎",
};

const TYPE_LABELS: Record<string, string> = {
  pdf: "PDF",
  link: "קישור",
  template: "תבנית",
  video: "וידאו",
  other: "קובץ",
};

function formatSize(kb: number | null): string {
  if (!kb) return "";
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

const STORAGE_KEY = "ofekos:admin:resources";

export default function ProgramFilesClient() {
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AdminResource[];
        setResources(parsed);
      }
    } catch {
      // ignore parse errors
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (resources.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-gray-400">לא הועלו חומרי תוכנית עדיין</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {resources.map((r) => (
        <div
          key={r.id}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex items-center gap-4"
        >
          <span className="text-2xl shrink-0">{TYPE_ICONS[r.type] ?? "📎"}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900">{r.name}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                {TYPE_LABELS[r.type] ?? "קובץ"}
              </span>
              <span className="text-xs text-gray-400">מפגש {r.sessionNumber}</span>
              {r.fileSizeKb && (
                <span className="text-xs text-gray-400">{formatSize(r.fileSizeKb)}</span>
              )}
            </div>
          </div>
          {r.url && r.url.startsWith("data:") ? (
            <a
              href={r.url}
              download={r.name}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors shrink-0"
            >
              הורד ←
            </a>
          ) : r.url ? (
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors shrink-0"
            >
              פתח ←
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}
