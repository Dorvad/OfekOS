"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import { getAssignmentInsight } from "@/lib/assignment-storage";
import Card from "@/components/ui/Card";

const accentBorder: Record<string, string> = {
  amber:   "border-amber-300",
  violet:  "border-violet-300",
  teal:    "border-teal-300",
  emerald: "border-emerald-300",
  orange:  "border-orange-300",
  indigo:  "border-indigo-300",
};

const accentText: Record<string, string> = {
  amber:   "text-amber-700",
  violet:  "text-violet-700",
  teal:    "text-teal-700",
  emerald: "text-emerald-700",
  orange:  "text-orange-700",
  indigo:  "text-indigo-700",
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const ins: Record<string, string> = {};
    for (const a of MOCK_ASSIGNMENTS) {
      ins[a.id] = getAssignmentInsight(a.id);
    }
    setInsights(ins);
    setHydrated(true);
  }, []);

  const collectedCount = Object.values(insights).filter((i) => i.trim().length > 0).length;

  if (!hydrated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">התובנות שלי</h1>
        <p className="text-sm text-gray-500 mt-1">
          {collectedCount > 0
            ? `${collectedCount} מתוך ${MOCK_ASSIGNMENTS.length} תובנות נשמרו`
            : "השלם מטלות כדי לאסוף תובנות"}
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_ASSIGNMENTS.map((a) => {
          const insight = insights[a.id] ?? "";
          const hasInsight = insight.trim().length > 0;
          const isLocked = !a.isUnlocked;

          return (
            <div
              key={a.id}
              className={`rounded-2xl border-2 p-5 ${
                hasInsight
                  ? `${accentBorder[a.accentColor]} bg-white`
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className={`text-xs font-semibold ${hasInsight ? accentText[a.accentColor] : "text-gray-400"}`}>
                    מפגש {a.sessionNumber}
                  </span>
                  <h3 className={`font-bold mt-0.5 ${hasInsight ? "text-gray-900" : "text-gray-400"}`}>
                    {a.title}
                  </h3>
                </div>
                {isLocked && (
                  <span className="text-gray-300 text-lg">🔒</span>
                )}
                {!isLocked && !hasInsight && (
                  <Link
                    href={`/participant/assignments/${a.id}`}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 shrink-0"
                  >
                    השלם מטלה ←
                  </Link>
                )}
              </div>

              {hasInsight ? (
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  &quot;{insight}&quot;
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  {isLocked ? "מטלה נעולה" : "תובנה לא נוספה עדיין"}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {collectedCount === 0 && (
        <Card className="mt-6 text-center py-8">
          <div className="text-3xl mb-2">💡</div>
          <p className="text-gray-500 font-medium">עוד אין תובנות</p>
          <p className="text-xs text-gray-400 mt-1">
            השלם מטלה וכתוב תובנה כדי שתופיע כאן
          </p>
          <Link
            href="/participant/assignments"
            className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            לך למטלות ←
          </Link>
        </Card>
      )}
    </div>
  );
}
