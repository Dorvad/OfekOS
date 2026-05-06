"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import type { Assignment, AssignmentStatus } from "@/lib/types";
import {
  getAssignmentStatus,
  setAssignmentStatus,
  getAssignmentPhase,
  setAssignmentPhase,
  getAssignmentInsight,
  setAssignmentInsight,
  markAssignmentAchieved,
  isAssignmentAchieved,
} from "@/lib/assignment-storage";
import PhaseTracker from "./PhaseTracker";
import AchievementBadge from "./AchievementBadge";
import Card from "@/components/ui/Card";

// Lazy-load each tool
const NorthStarTool        = lazy(() => import("./tools/NorthStarTool"));
const ConversationBuilderTool = lazy(() => import("./tools/ConversationBuilderTool"));
const TeamMapTool          = lazy(() => import("./tools/TeamMapTool"));
const ManagingUpTool       = lazy(() => import("./tools/ManagingUpTool"));
const PriorityMatrixTool   = lazy(() => import("./tools/PriorityMatrixTool"));
const ChangeLeadershipTool = lazy(() => import("./tools/ChangeLeadershipTool"));

const TOOL_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<{ assignmentId: string }>>> = {
  a1: NorthStarTool,
  a2: ConversationBuilderTool,
  a3: TeamMapTool,
  a4: ManagingUpTool,
  a5: PriorityMatrixTool,
  a6: ChangeLeadershipTool,
};

const accentBg: Record<string, string> = {
  amber:   "bg-amber-50 border-amber-200",
  violet:  "bg-violet-50 border-violet-200",
  teal:    "bg-teal-50 border-teal-200",
  emerald: "bg-emerald-50 border-emerald-200",
  orange:  "bg-orange-50 border-orange-200",
  indigo:  "bg-indigo-50 border-indigo-200",
};

const accentButton: Record<string, string> = {
  amber:   "bg-amber-500 hover:bg-amber-600",
  violet:  "bg-violet-500 hover:bg-violet-600",
  teal:    "bg-teal-500 hover:bg-teal-600",
  emerald: "bg-emerald-500 hover:bg-emerald-600",
  orange:  "bg-orange-500 hover:bg-orange-600",
  indigo:  "bg-indigo-500 hover:bg-indigo-600",
};

interface AssignmentDetailClientProps {
  assignment: Assignment;
}

export default function AssignmentDetailClient({ assignment }: AssignmentDetailClientProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [status, setStatus] = useState<AssignmentStatus>("available");
  const [insight, setInsightText] = useState("");
  const [showAchievement, setShowAchievement] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [missionExpanded, setMissionExpanded] = useState(true);

  useEffect(() => {
    const savedStatus = getAssignmentStatus(assignment.id);
    const savedPhaseId = getAssignmentPhase(assignment.id);
    const savedInsight = getAssignmentInsight(assignment.id);

    const idx = savedPhaseId
      ? Math.max(0, assignment.phases.findIndex((p) => p.id === savedPhaseId))
      : 0;

    setStatus(savedStatus === "locked" ? "available" : savedStatus);
    setPhaseIndex(idx);
    setInsightText(savedInsight);

    // Mark as opened on first visit
    if (savedStatus === "available" || savedStatus === "locked") {
      setAssignmentStatus(assignment.id, "briefing");
      setStatus("briefing");
    }

    setHydrated(true);
  }, [assignment.id, assignment.phases]);

  function advancePhase() {
    const next = Math.min(phaseIndex + 1, assignment.phases.length - 1);
    const nextPhase = assignment.phases[next];
    setPhaseIndex(next);
    setAssignmentPhase(assignment.id, nextPhase.id);

    const newStatus = deriveStatus(nextPhase.id);
    setAssignmentStatus(assignment.id, newStatus);
    setStatus(newStatus);
  }

  function retreatPhase() {
    if (phaseIndex === 0) return;
    const prev = phaseIndex - 1;
    const prevPhase = assignment.phases[prev];
    setPhaseIndex(prev);
    setAssignmentPhase(assignment.id, prevPhase.id);
    const newStatus = deriveStatus(prevPhase.id);
    setAssignmentStatus(assignment.id, newStatus);
    setStatus(newStatus);
  }

  function deriveStatus(phaseId: string): AssignmentStatus {
    const idx = assignment.phases.findIndex((p) => p.id === phaseId);
    if (idx === 0) return "briefing";
    if (idx === 1) return "exploring";
    if (idx === 2) return "creating";
    if (idx === 3) return "insight";
    return "briefing";
  }

  function handleSubmit() {
    setAssignmentInsight(assignment.id, insight);
    setAssignmentStatus(assignment.id, "submitted");
    setStatus("submitted");
    if (!isAssignmentAchieved(assignment.id)) {
      markAssignmentAchieved(assignment.id);
      setShowAchievement(true);
    }
  }

  const ToolComponent = TOOL_MAP[assignment.id];
  const isLastPhase = phaseIndex === assignment.phases.length - 1;
  const currentPhase = assignment.phases[phaseIndex];

  if (!hydrated) {
    return <div className="h-64 bg-gray-100 rounded-2xl animate-pulse mt-6" />;
  }

  if (!assignment.isUnlocked) {
    return (
      <Card className="text-center py-12">
        <div className="text-4xl mb-3">🔒</div>
        <h2 className="font-bold text-gray-700 mb-1">מטלה נעולה</h2>
        <p className="text-sm text-gray-400">
          השלם את המטלה הקודמת כדי לפתוח מטלה זו.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Achievement overlay */}
      {showAchievement && (
        <AchievementBadge
          label={assignment.achievementLabel}
          accentColor={assignment.accentColor}
          onDismiss={() => setShowAchievement(false)}
        />
      )}

      {/* Phase tracker */}
      <Card>
        <PhaseTracker
          phases={assignment.phases}
          currentIndex={phaseIndex}
          accentColor={assignment.accentColor}
        />
      </Card>

      {/* Mission brief (collapsible) */}
      <div className={`rounded-xl border p-4 ${accentBg[assignment.accentColor]}`}>
        <button
          onClick={() => setMissionExpanded((v) => !v)}
          className="w-full flex items-center justify-between gap-2 text-right"
        >
          <span className="font-semibold text-gray-800 text-sm">המשימה שלך</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`w-4 h-4 text-gray-500 transition-transform ${missionExpanded ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {missionExpanded && (
          <p className="text-sm text-gray-700 mt-3 leading-relaxed">
            {assignment.missionBrief}
          </p>
        )}
      </div>

      {/* Phase content */}
      {currentPhase?.id === "briefing" && (
        <Card>
          <h2 className="font-bold text-gray-900 mb-2">קריאת המשימה</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {assignment.missionBrief}
          </p>
          <p className="text-xs text-gray-400 mb-4">
            {currentPhase.description}
          </p>
          <button
            onClick={advancePhase}
            className={`w-full text-white font-semibold py-3 rounded-xl transition-colors ${accentButton[assignment.accentColor]}`}
          >
            הבנתי, נמשיך ←
          </button>
        </Card>
      )}

      {currentPhase?.id === "exploring" && ToolComponent && (
        <Suspense fallback={<div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />}>
          <ToolComponent assignmentId={assignment.id} />
        </Suspense>
      )}

      {currentPhase?.id === "creating" && ToolComponent && (
        <Suspense fallback={<div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />}>
          <ToolComponent assignmentId={assignment.id} />
        </Suspense>
      )}

      {currentPhase?.id === "insight" && (
        <Card>
          <h2 className="font-bold text-gray-900 mb-1">תובנה אישית</h2>
          <p className="text-sm text-gray-500 mb-4">
            מה הדבר החשוב ביותר שלמדת ממטלה זו?
          </p>
          <textarea
            value={insight}
            onChange={(e) => {
              setInsightText(e.target.value);
              setAssignmentInsight(assignment.id, e.target.value);
            }}
            placeholder="כתוב כאן את התובנה שלך..."
            className="w-full min-h-[140px] p-3 rounded-xl border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            dir="rtl"
          />
          {insight.trim().length > 0 && status !== "submitted" && (
            <button
              onClick={handleSubmit}
              className={`w-full mt-4 text-white font-semibold py-3 rounded-xl transition-colors ${accentButton[assignment.accentColor]}`}
            >
              שלח ←
            </button>
          )}
          {status === "submitted" && (
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-sm text-emerald-700 font-medium text-center">
              ✓ הוגש בהצלחה
            </div>
          )}
        </Card>
      )}

      {/* Phase navigation */}
      {currentPhase?.id !== "briefing" && currentPhase?.id !== "insight" && (
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={retreatPhase}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            → חזרה
          </button>
          <button
            onClick={advancePhase}
            disabled={isLastPhase}
            className={`text-sm font-semibold flex items-center gap-1 ${isLastPhase ? "text-gray-300 cursor-not-allowed" : "text-indigo-600 hover:text-indigo-700"}`}
          >
            הבא ←
          </button>
        </div>
      )}
    </div>
  );
}
