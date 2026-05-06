"use client";

import Link from "next/link";
import type { Assignment, AssignmentStatus } from "@/lib/types";

interface AssignmentCardProps {
  assignment: Assignment;
  status: AssignmentStatus;
  currentPhaseIndex: number;
}

const accentStripe: Record<string, string> = {
  amber:   "bg-amber-400",
  violet:  "bg-violet-500",
  teal:    "bg-teal-400",
  emerald: "bg-emerald-400",
  orange:  "bg-orange-400",
  indigo:  "bg-indigo-500",
};

const accentRing: Record<string, string> = {
  amber:   "#f59e0b",
  violet:  "#8b5cf6",
  teal:    "#14b8a6",
  emerald: "#10b981",
  orange:  "#f97316",
  indigo:  "#6366f1",
};

const accentNumBg: Record<string, string> = {
  amber:   "bg-amber-50 text-amber-700",
  violet:  "bg-violet-50 text-violet-700",
  teal:    "bg-teal-50 text-teal-700",
  emerald: "bg-emerald-50 text-emerald-700",
  orange:  "bg-orange-50 text-orange-700",
  indigo:  "bg-indigo-50 text-indigo-700",
};

const accentButton: Record<string, string> = {
  amber:   "bg-amber-500 hover:bg-amber-600 text-white",
  violet:  "bg-violet-500 hover:bg-violet-600 text-white",
  teal:    "bg-teal-500 hover:bg-teal-600 text-white",
  emerald: "bg-emerald-500 hover:bg-emerald-600 text-white",
  orange:  "bg-orange-500 hover:bg-orange-600 text-white",
  indigo:  "bg-indigo-500 hover:bg-indigo-600 text-white",
};

const statusLabels: Record<AssignmentStatus, string> = {
  locked:    "נעול",
  available: "לא התחלת",
  briefing:  "קריאת משימה",
  exploring: "בחקירה",
  creating:  "ביצירה",
  insight:   "כתיבת תובנה",
  submitted: "הושלם",
  achieved:  "הושג",
};

export default function AssignmentCard({
  assignment,
  status,
  currentPhaseIndex,
}: AssignmentCardProps) {
  const color = assignment.accentColor;
  const ring = accentRing[color] ?? accentRing.indigo;
  const totalPhases = assignment.phases.length;
  const pct = totalPhases > 1 ? (currentPhaseIndex / (totalPhases - 1)) * 100 : 0;
  const isLocked = !assignment.isUnlocked || status === "locked";
  const isDone = status === "submitted" || status === "achieved";

  const r = 15;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  const card = (
    <div
      className={`relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm flex flex-col transition-shadow ${
        isLocked ? "opacity-55" : "hover:shadow-md"
      }`}
    >
      {/* Color stripe */}
      <div className={`h-1 w-full ${isLocked ? "bg-gray-200" : accentStripe[color]}`} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <span className={`text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${
            isLocked ? "bg-gray-100 text-gray-400" : accentNumBg[color]
          }`}>
            מפגש {assignment.sessionNumber}
          </span>

          {/* Donut ring */}
          <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90 shrink-0" aria-hidden="true">
            <circle cx="20" cy="20" r={r} fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
            {!isLocked && pct > 0 && (
              <circle
                cx="20" cy="20" r={r}
                fill="none"
                stroke={ring}
                strokeWidth="3.5"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
              />
            )}
            {isDone && (
              <g transform="rotate(90, 20, 20)">
                <polyline
                  points="13,20 18,25 27,15"
                  fill="none"
                  stroke={ring}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Title */}
        <div className="flex-1">
          <h3 className={`font-bold text-base leading-snug ${isLocked ? "text-gray-400" : "text-gray-900"}`}>
            {assignment.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{assignment.subtitle}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-50">
          <span className={`text-xs font-medium ${
            isDone ? "text-emerald-600" :
            isLocked ? "text-gray-400" :
            "text-gray-500"
          }`}>
            {isDone ? "✓ " : ""}{statusLabels[status]}
          </span>

          {isLocked ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4 text-gray-300">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          ) : (
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              isDone ? "bg-emerald-500 hover:bg-emerald-600 text-white" : accentButton[color]
            }`}>
              {isDone ? "צפה ←" : status === "available" ? "התחל ←" : "המשך ←"}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (isLocked) return card;

  return (
    <Link href={`/participant/assignments/${assignment.id}`} className="block">
      {card}
    </Link>
  );
}
