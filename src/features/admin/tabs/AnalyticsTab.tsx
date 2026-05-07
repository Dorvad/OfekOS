"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import type { AssignmentCompletionStat, Submission } from "@/lib/types";
import type { Cohort } from "@/lib/types";
import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

const ACCENT_BG: Record<string, string> = {
  amber:   "bg-amber-400",
  violet:  "bg-violet-500",
  teal:    "bg-teal-400",
  emerald: "bg-emerald-400",
  orange:  "bg-orange-400",
  indigo:  "bg-indigo-500",
};

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

interface Props {
  completionStats: AssignmentCompletionStat[];
  submissions: Submission[];
  prepareStats: { completed: number; total: number };
  cohorts: Cohort[];
  lockStates: Record<string, boolean>;
  onReload: () => void;
}

export default function AnalyticsTab({
  completionStats,
  submissions,
  prepareStats,
  cohorts,
  lockStates,
  onReload,
}: Props) {
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [cohortFilter, setCohortFilter] = useState("all");

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("analytics-pa-submitted")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participant_assignments",
          filter: "status=eq.submitted",
        },
        () => { onReload(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [onReload]);

  const filteredSubmissions = submissions.filter((s) => {
    const matchAssignment = assignmentFilter === "all" || s.assignmentId === assignmentFilter;
    return matchAssignment;
  });

  const prepPct = prepareStats.total > 0
    ? Math.round((prepareStats.completed / prepareStats.total) * 100)
    : 0;

  return (
    <div className="space-y-6">

      {/* ── Assignment completion bars ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">השלמת מטלות</h2>
        <Card className="space-y-4">
          {completionStats.map((stat) => {
            const unlocked = lockStates[stat.assignmentId] ?? false;
            const pct = stat.total > 0
              ? Math.round((stat.submitted / stat.total) * 100)
              : 0;

            if (!unlocked) {
              return (
                <div key={stat.assignmentId} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <p className="text-xs font-semibold text-gray-400 truncate">{stat.title}</p>
                  </div>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full" />
                  <span className="text-xs text-gray-300 shrink-0 w-20 text-left">🔒 נעולה</span>
                </div>
              );
            }

            const accent = MOCK_ASSIGNMENTS.find((a) => a.id === stat.assignmentId);
            const barColor = accent ? ACCENT_BG[accent.accentColor] : "bg-indigo-400";

            return (
              <div key={stat.assignmentId}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-gray-700">{stat.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />הוגש: {stat.submitted}</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />בתהליך: {stat.inProgress}</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />לא התחיל: {stat.notStarted}</span>
                    <span className="font-bold text-gray-700">{pct}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* ── Submissions table ── */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="text-sm font-bold text-gray-700">תובנות שהוגשו</h2>
          <div className="flex gap-2">
            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none bg-white"
              dir="rtl"
            >
              <option value="all">כל המטלות</option>
              {MOCK_ASSIGNMENTS.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none bg-white"
              dir="rtl"
            >
              <option value="all">כל הקבוצות</option>
              {cohorts.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <Card padding={false}>
          {filteredSubmissions.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">אין הגשות לתצוגה</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredSubmissions.map((s) => (
                <div key={s.id} className="px-5 py-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {initials(s.userName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{s.userName}</p>
                      <p className="text-xs text-gray-400">{s.assignmentTitle} · {s.submittedAt}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-amber-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-amber-600 mb-1">💡 תובנה</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{s.insight}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-emerald-600 mb-1">✅ פעולה</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{s.action}</p>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-indigo-600 mb-1">❓ שאלה</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{s.question}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            {filteredSubmissions.length} הגשות
          </div>
        </Card>
      </div>

      {/* ── Prepare stats ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">הכנה למפגש הבא</h2>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-700">
              <span className="font-bold text-indigo-600">{prepareStats.completed}</span>
              {" "}מתוך{" "}
              <span className="font-bold">{prepareStats.total}</span>
              {" "}משתתפים השלימו את ההכנה למפגש הבא
            </p>
            <span className="text-sm font-bold text-indigo-600">{prepPct}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full transition-all"
              style={{ width: `${prepPct}%` }}
            />
          </div>
        </Card>
      </div>

      {/* ── Live indicator ── */}
      <div className="px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <p className="text-sm font-medium text-emerald-800">
          האנליטיקה מתעדכנת בזמן אמת — כל הגשה חדשה תופיע כאן אוטומטית
        </p>
      </div>
    </div>
  );
}
