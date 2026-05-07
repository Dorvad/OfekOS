"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAssignmentStatus,
  getAssignmentData,
} from "@/lib/assignment-storage";

interface PortfolioItem {
  id: string;
  sessionNumber: number;
  title: string;
  outputName: string;
  accentColor: string;
  previewField: string | null;
  status: "empty" | "in_progress" | "saved";
}

const PORTFOLIO_CONFIG: {
  id: string;
  sessionNumber: number;
  title: string;
  outputName: string;
  accentColor: string;
  previewKey: string | null;
}[] = [
  {
    id: "a1",
    sessionNumber: 1,
    title: "יסודות המנהל החדש",
    outputName: "מצפן ניהולי אישי",
    accentColor: "indigo",
    previewKey: "north",
  },
  {
    id: "a2",
    sessionNumber: 2,
    title: "מתן משוב",
    outputName: "תסריט שיחה",
    accentColor: "violet",
    previewKey: "improvedVersion",
  },
  {
    id: "a3",
    sessionNumber: 3,
    title: "שיחות עם הצוות",
    outputName: "מפת אנרגיה של הצוות",
    accentColor: "teal",
    previewKey: "quickWin",
  },
  {
    id: "a4",
    sessionNumber: 4,
    title: "ניהול כלפי מעלה",
    outputName: "הצעת השפעה",
    accentColor: "emerald",
    previewKey: "openingSentence",
  },
  {
    id: "a5",
    sessionNumber: 5,
    title: "ניהול זמן ועדיפויות",
    outputName: "תוכנית שבועית",
    accentColor: "orange",
    previewKey: "reflectionImportant",
  },
  {
    id: "a6",
    sessionNumber: 6,
    title: "הובלת שינוי",
    outputName: "מפת שינוי ושיחת שינוי",
    accentColor: "indigo",
    previewKey: "convContainment",
  },
];

const ACCENT_STYLES: Record<
  string,
  {
    badge: string;
    badgeText: string;
    border: string;
    statusSaved: string;
  }
> = {
  indigo: {
    badge: "bg-indigo-600",
    badgeText: "text-white",
    border: "border-indigo-200",
    statusSaved: "bg-indigo-50 text-indigo-700",
  },
  violet: {
    badge: "bg-violet-600",
    badgeText: "text-white",
    border: "border-violet-200",
    statusSaved: "bg-violet-50 text-violet-700",
  },
  teal: {
    badge: "bg-teal-600",
    badgeText: "text-white",
    border: "border-teal-200",
    statusSaved: "bg-teal-50 text-teal-700",
  },
  emerald: {
    badge: "bg-emerald-600",
    badgeText: "text-white",
    border: "border-emerald-200",
    statusSaved: "bg-emerald-50 text-emerald-700",
  },
  orange: {
    badge: "bg-orange-500",
    badgeText: "text-white",
    border: "border-orange-200",
    statusSaved: "bg-orange-50 text-orange-700",
  },
};

function getAccent(color: string) {
  return ACCENT_STYLES[color] ?? ACCENT_STYLES.indigo;
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const built: PortfolioItem[] = PORTFOLIO_CONFIG.map((cfg) => {
      const status = getAssignmentStatus(cfg.id);
      const raw = getAssignmentData<Record<string, unknown>>(cfg.id);

      let previewField: string | null = null;
      if (raw && cfg.previewKey && raw[cfg.previewKey]) {
        const val = raw[cfg.previewKey];
        if (typeof val === "string" && val.trim()) {
          previewField = val.slice(0, 80);
        }
      }

      const isSaved = status === "submitted" || status === "achieved";
      const isStarted =
        raw !== null &&
        Object.values(raw).some(
          (v) => typeof v === "string" && v.trim().length > 0
        );

      const portfolioStatus: PortfolioItem["status"] = isSaved
        ? "saved"
        : isStarted
        ? "in_progress"
        : "empty";

      return {
        id: cfg.id,
        sessionNumber: cfg.sessionNumber,
        title: cfg.title,
        outputName: cfg.outputName,
        accentColor: cfg.accentColor,
        previewField,
        status: portfolioStatus,
      };
    });
    setItems(built);
    setMounted(true);
  }, []);

  const savedCount = items.filter((i) => i.status === "saved").length;

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="h-8 w-64 bg-gray-100 rounded-xl animate-pulse mb-2" />
        <div className="h-4 w-48 bg-gray-100 rounded-xl animate-pulse mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          תיק המנהל המתפתח שלי
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          התוצרים שלך ממטלות התוכנית
        </p>
      </div>

      {/* Progress counter */}
      <div className="mb-5 rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {savedCount}
            <span className="text-sm font-normal text-gray-400"> מתוך 6</span>
          </p>
          <p className="text-xs text-gray-500">תוצרים נשמרו בתיק</p>
        </div>
        <div className="flex gap-1">
          {items.map((item) => (
            <div
              key={item.id}
              className={`w-3 h-3 rounded-full transition-colors ${
                item.status === "saved"
                  ? getAccent(item.accentColor).badge
                  : item.status === "in_progress"
                  ? "bg-gray-300"
                  : "bg-gray-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Empty state */}
      {savedCount === 0 && items.every((i) => i.status === "empty") && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm mb-5">
          <p className="text-gray-400 text-sm">
            תיק המנהל שלך ריק כרגע — השלם מטלות כדי לאכלס אותו.
          </p>
        </div>
      )}

      {/* Portfolio cards */}
      <div className="space-y-3">
        {items.map((item) => {
          const accent = getAccent(item.accentColor);
          return (
            <div
              key={item.id}
              className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${
                item.status === "saved" ? `border-r-4 ${accent.border}` : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${accent.badge} ${accent.badgeText}`}
                >
                  {item.sessionNumber}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        {item.title}
                      </p>
                      <p className="font-bold text-gray-900 text-sm">
                        {item.outputName}
                      </p>
                    </div>

                    {/* Status badge */}
                    {item.status === "saved" && (
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${accent.statusSaved}`}
                      >
                        נשמר בתיק ✓
                      </span>
                    )}
                    {item.status === "in_progress" && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 shrink-0">
                        בתהליך
                      </span>
                    )}
                    {item.status === "empty" && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 shrink-0">
                        לא התחיל
                      </span>
                    )}
                  </div>

                  {/* Preview */}
                  {item.previewField && (
                    <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                      {item.previewField}
                      {item.previewField.length >= 80 ? "..." : ""}
                    </p>
                  )}
                  {!item.previewField && item.status === "empty" && (
                    <p className="mt-2 text-xs text-gray-300 italic">
                      לא נכתב תוכן עדיין
                    </p>
                  )}

                  {/* Action link */}
                  <div className="mt-3">
                    <Link
                      href={`/participant/assignments/${item.id}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      פתח מטלה ←
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
