"use client";

import Link from "next/link";
import type { Assignment, AssignmentStatus } from "@/lib/types";

interface AssignmentCardProps {
  assignment: Assignment;
  status: AssignmentStatus;
  currentPhaseIndex: number;
}

const accentMap: Record<
  string,
  { ring: string; bg: string; text: string; border: string; button: string }
> = {
  amber:  { ring: "#f59e0b", bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200", button: "bg-amber-500 hover:bg-amber-600" },
  violet: { ring: "#8b5cf6", bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200", button: "bg-violet-500 hover:bg-violet-600" },
  teal:   { ring: "#14b8a6", bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-200", button: "bg-teal-500 hover:bg-teal-600" },
  emerald:{ ring: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", button: "bg-emerald-500 hover:bg-emerald-600" },
  orange: { ring: "#f97316", bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200", button: "bg-orange-500 hover:bg-orange-600" },
  indigo: { ring: "#6366f1", bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200", button: "bg-indigo-500 hover:bg-indigo-600" },
};

const statusLabels: Record<AssignmentStatus, string> = {
  locked:    "נעול",
  available: "זמין",
  briefing:  "בהכנה",
  exploring: "חוקר",
  creating:  "יוצר",
  insight:   "תובנה",
  submitted: "הוגש",
  achieved:  "הושג",
};

export default function AssignmentCard({
  assignment,
  status,
  currentPhaseIndex,
}: AssignmentCardProps) {
  const accent = accentMap[assignment.accentColor] ?? accentMap.indigo;
  const totalPhases = assignment.phases.length;
  const pct = totalPhases > 1 ? (currentPhaseIndex / (totalPhases - 1)) * 100 : 0;
  const isLocked = !assignment.isUnlocked || status === "locked";
  const isDone = status === "submitted" || status === "achieved";

  // SVG donut ring
  const r = 16;
  const circ = 2 * Math.PI * r; // ~100.5
  const dash = (pct / 100) * circ;

  return (
    <div
      className={`relative rounded-2xl border-2 p-5 flex flex-col gap-3 transition-shadow ${
        isLocked ? "opacity-60 bg-gray-50 border-gray-200" : `${accent.bg} ${accent.border}`
      }`}
    >
      {/* Top row: session badge + donut ring */}
      <div className="flex items-start justify-between">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isLocked ? "bg-gray-200 text-gray-500" : `bg-white ${accent.text}`}`}>
          מפגש {assignment.sessionNumber}
        </span>

        {/* Donut progress ring */}
        <svg viewBox="0 0 44 44" className="w-11 h-11 -rotate-90" aria-hidden="true">
          <circle cx="22" cy="22" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
          {!isLocked && (
            <circle
              cx="22"
              cy="22"
              r={r}
              fill="none"
              stroke={accent.ring}
              strokeWidth="4"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 leading-snug">{assignment.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{assignment.subtitle}</p>
      </div>

      {/* Status badge */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          isDone ? "bg-emerald-100 text-emerald-700" :
          isLocked ? "bg-gray-100 text-gray-500" :
          `bg-white ${accent.text}`
        }`}>
          {statusLabels[status]}
        </span>

        {isLocked ? (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            נעול
          </span>
        ) : (
          <Link
            href={`/participant/assignments/${assignment.id}`}
            className={`text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors ${accent.button}`}
          >
            {isDone ? "צפה ←" : status === "available" ? "פתח ←" : "המשך ←"}
          </Link>
        )}
      </div>
    </div>
  );
}
