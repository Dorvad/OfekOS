"use client";

import Card from "@/components/ui/Card";
import type { Participant, Submission } from "@/lib/types";
import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import type { AdminTab } from "../AdminTabNav";

const ACCENT_COLOR: Record<string, string> = {
  amber:   "bg-amber-400",
  violet:  "bg-violet-500",
  teal:    "bg-teal-400",
  emerald: "bg-emerald-400",
  orange:  "bg-orange-400",
  indigo:  "bg-indigo-500",
};

interface CellStatus {
  assignmentId: string;
  status: "locked" | "inProgress" | "submitted";
}

function getParticipantCells(
  participant: Participant,
  lockStates: Record<string, boolean>,
  submissions: Submission[]
): CellStatus[] {
  return MOCK_ASSIGNMENTS.map((a) => {
    if (!lockStates[a.id]) return { assignmentId: a.id, status: "locked" };
    const submitted = submissions.some(
      (s) => s.assignmentId === a.id && s.userId === participant.id
    );
    if (submitted) return { assignmentId: a.id, status: "submitted" };
    if (participant.progress > (a.sessionNumber - 1) * 15)
      return { assignmentId: a.id, status: "inProgress" };
    return { assignmentId: a.id, status: "locked" };
  });
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date("2025-05-07");
  const diffDays = Math.round((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "היום";
  if (diffDays === 1) return "אתמול";
  return `לפני ${diffDays} ימים`;
}

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

interface Props {
  participants: Participant[];
  submissions: Submission[];
  lockStates: Record<string, boolean>;
  cohortCount: number;
  onNavigate: (tab: AdminTab) => void;
}

export default function OverviewTab({
  participants,
  submissions,
  lockStates,
  cohortCount,
  onNavigate,
}: Props) {
  const openCount = Object.values(lockStates).filter(Boolean).length;
  const totalProgress = participants.reduce((s, p) => s + p.progress, 0);
  const avgCompletion = participants.length
    ? Math.round(totalProgress / participants.length)
    : 0;

  const recentSubmissions = [...submissions]
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "משתתפים",         value: participants.length, color: "text-indigo-600" },
          { label: "קבוצות",          value: cohortCount,          color: "text-teal-600" },
          { label: "מטלות פתוחות",    value: openCount,            color: "text-emerald-600" },
          { label: "השלמה ממוצעת",    value: `${avgCompletion}%`,  color: "text-amber-600" },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Completion matrix */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-sm">מטריצת השלמה</h2>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block" />לא התחיל</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />בתהליך</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />הוגש</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-right px-5 py-2 text-xs text-gray-400 font-medium w-36">משתתף</th>
                    {MOCK_ASSIGNMENTS.map((a) => (
                      <th key={a.id} className="px-2 py-2 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${ACCENT_COLOR[a.accentColor]}`}>
                          {a.sessionNumber}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {participants.map((p) => {
                    const cells = getParticipantCells(p, lockStates, submissions);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {initials(p.name)}
                            </div>
                            <span className="text-xs text-gray-700 font-medium truncate max-w-[80px]">{p.name.split(" ")[0]}</span>
                          </div>
                        </td>
                        {cells.map((cell) => (
                          <td key={cell.assignmentId} className="px-2 py-3 text-center">
                            <span className={`inline-block w-3 h-3 rounded-full ${
                              cell.status === "submitted" ? "bg-emerald-400"
                              : cell.status === "inProgress" ? "bg-amber-400"
                              : "bg-gray-200"
                            }`} />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Recent submissions */}
        <div>
          <Card padding={false}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-sm">הגשות אחרונות</h2>
              <button
                onClick={() => onNavigate("analytics")}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                כולן ←
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {recentSubmissions.length === 0 ? (
                <p className="px-5 py-6 text-sm text-gray-400 text-center">אין הגשות עדיין</p>
              ) : (
                recentSubmissions.map((s) => (
                  <div key={s.id} className="px-5 py-3 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {initials(s.userName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{s.userName}</p>
                      <p className="text-xs text-gray-500 truncate">{s.assignmentTitle}</p>
                      <p className="text-xs text-gray-400">{timeAgo(s.submittedAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <Card>
        <h2 className="font-semibold text-gray-900 text-sm mb-3">פעולות מהירות</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate("participants")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            + הוסף משתתף
          </button>
          <button
            onClick={() => onNavigate("content")}
            className="px-4 py-2 bg-white border border-gray-200 hover:border-indigo-300 text-gray-700 text-sm font-medium rounded-xl transition-colors"
          >
            🔓 נהל נעילת מטלות
          </button>
          <button
            onClick={() => onNavigate("analytics")}
            className="px-4 py-2 bg-white border border-gray-200 hover:border-indigo-300 text-gray-700 text-sm font-medium rounded-xl transition-colors"
          >
            📊 אנליטיקה מלאה
          </button>
        </div>
      </Card>
    </div>
  );
}
