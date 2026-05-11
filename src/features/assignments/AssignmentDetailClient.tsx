"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import type { Assignment, AssignmentStatus } from "@/lib/types";
import {
  getAssignmentStatus,
  setAssignmentStatus,
  getAssignmentPhase,
  setAssignmentPhase,
  getAssignmentInsight,
  setAssignmentInsight,
  getAssignmentData,
  setAssignmentData,
  markAssignmentAchieved,
  isAssignmentAchieved,
} from "@/lib/assignment-storage";
import { createClient } from "@/lib/supabase/client";
import PhaseTracker from "./PhaseTracker";
import AchievementBadge from "./AchievementBadge";
import Card from "@/components/ui/Card";

interface ToolProps { assignmentId: string; onComplete: () => void; }

const NorthStarTool        = lazy(() => import("./tools/NorthStarTool"));
const ConversationBuilderTool = lazy(() => import("./tools/ConversationBuilderTool"));
const TeamMapTool          = lazy(() => import("./tools/TeamMapTool"));
const ManagingUpTool       = lazy(() => import("./tools/ManagingUpTool"));
const PriorityMatrixTool   = lazy(() => import("./tools/PriorityMatrixTool"));
const ChangeLeadershipTool = lazy(() => import("./tools/ChangeLeadershipTool"));

const TOOL_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<ToolProps>>> = {
  a1: NorthStarTool,
  a2: ConversationBuilderTool,
  a3: TeamMapTool,
  a4: ManagingUpTool,
  a5: PriorityMatrixTool,
  a6: ChangeLeadershipTool,
};

const accentBtn: Record<string, string> = {
  amber:   "bg-amber-500 hover:bg-amber-600",
  violet:  "bg-violet-500 hover:bg-violet-600",
  teal:    "bg-teal-500 hover:bg-teal-600",
  emerald: "bg-emerald-500 hover:bg-emerald-600",
  orange:  "bg-orange-500 hover:bg-orange-600",
  indigo:  "bg-indigo-500 hover:bg-indigo-600",
};

const accentRing: Record<string, string> = {
  amber:   "focus:ring-amber-400",
  violet:  "focus:ring-violet-400",
  teal:    "focus:ring-teal-400",
  emerald: "focus:ring-emerald-400",
  orange:  "focus:ring-orange-400",
  indigo:  "focus:ring-indigo-400",
};

interface ClosingData { insight: string; action: string; question: string; }
const EMPTY_CLOSING: ClosingData = { insight: "", action: "", question: "" };

interface AssignmentDetailClientProps { assignment: Assignment; }

export default function AssignmentDetailClient({ assignment }: AssignmentDetailClientProps) {
  const router = useRouter();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [status, setStatus]         = useState<AssignmentStatus>("available");
  const [closing, setClosing]       = useState<ClosingData>(EMPTY_CLOSING);
  const [showAchievement, setShowAchievement] = useState(false);
  const [hydrated, setHydrated]     = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`assignment-${assignment.id}-lock`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assignments", filter: `id=eq.${assignment.id}` },
        () => { router.refresh(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [assignment.id, router]);

  useEffect(() => {
    const savedStatus  = getAssignmentStatus(assignment.id);
    const savedPhaseId = getAssignmentPhase(assignment.id);
    const savedClosing = getAssignmentData<ClosingData>(assignment.id + ":closing");

    const idx = savedPhaseId
      ? Math.max(0, assignment.phases.findIndex((p) => p.id === savedPhaseId))
      : 0;

    setStatus(savedStatus === "locked" ? "available" : savedStatus);
    setPhaseIndex(idx);
    if (savedClosing) setClosing(savedClosing);
    else {
      const legacyInsight = getAssignmentInsight(assignment.id);
      if (legacyInsight) setClosing({ insight: legacyInsight, action: "", question: "" });
    }

    if (savedStatus === "available" || savedStatus === "locked") {
      setAssignmentStatus(assignment.id, "briefing");
      setStatus("briefing");
    }

    // Sync from Supabase
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setHydrated(true); return; }

      const { data: row } = await supabase
        .from("participant_assignments")
        .select("status, current_phase, insight, closing_action, closing_question")
        .eq("user_id", user.id)
        .eq("assignment_id", assignment.id)
        .single();

      if (row) {
        if (row.status && row.status !== "locked") {
          setStatus(row.status as AssignmentStatus);
          setAssignmentStatus(assignment.id, row.status as AssignmentStatus);
        }
        if (row.current_phase) {
          const phaseIdx = Math.max(0, assignment.phases.findIndex((p) => p.id === row.current_phase));
          setPhaseIndex(phaseIdx);
          setAssignmentPhase(assignment.id, row.current_phase);
        }
        if (row.insight || row.closing_action || row.closing_question) {
          const dbClosing: ClosingData = {
            insight: row.insight ?? "",
            action: row.closing_action ?? "",
            question: row.closing_question ?? "",
          };
          setClosing(dbClosing);
          setAssignmentData(assignment.id + ":closing", dbClosing);
        }
      }

      setHydrated(true);
    })();
  }, [assignment.id, assignment.phases]);

  async function syncStatus(newStatus: AssignmentStatus, phase: string) {
    await fetch("/api/participant/sync-assignment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId: assignment.id, status: newStatus, currentPhase: phase }),
    }).catch(() => {});
  }

  async function syncToSupabase(closingData: ClosingData, currentStatus: AssignmentStatus) {
    await fetch("/api/participant/sync-assignment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assignmentId: assignment.id,
        status: currentStatus,
        insight: closingData.insight,
        closingAction: closingData.action,
        closingQuestion: closingData.question,
        achievedAt: new Date().toISOString(),
      }),
    }).catch(() => {});
  }

  function advancePhase() {
    const next = Math.min(phaseIndex + 1, assignment.phases.length - 1);
    const nextPhase = assignment.phases[next];
    setPhaseIndex(next);
    setAssignmentPhase(assignment.id, nextPhase.id);
    const newStatus = deriveStatus(next);
    setAssignmentStatus(assignment.id, newStatus);
    setStatus(newStatus);
    syncStatus(newStatus, nextPhase.id).catch(() => {});
  }

  function deriveStatus(idx: number): AssignmentStatus {
    if (idx === 0) return "briefing";
    if (idx === 1) return "exploring";
    if (idx >= 2) return "insight";
    return "briefing";
  }

  function updateClosing(field: keyof ClosingData, val: string) {
    const next = { ...closing, [field]: val };
    setClosing(next);
    setAssignmentData(assignment.id + ":closing", next);
    setAssignmentInsight(assignment.id, next.insight);
  }

  function handleSubmit() {
    setAssignmentInsight(assignment.id, closing.insight);
    setAssignmentStatus(assignment.id, "submitted");
    setStatus("submitted");
    if (!isAssignmentAchieved(assignment.id)) {
      markAssignmentAchieved(assignment.id);
      setShowAchievement(true);
    }
    // Save to DB, then refresh so the assignments list and home page reflect the new status
    syncToSupabase(closing, "submitted").then(() => router.refresh()).catch(() => {});
  }

  const ToolComponent = TOOL_MAP[assignment.id];
  const currentPhase  = assignment.phases[phaseIndex];
  const btn           = accentBtn[assignment.accentColor] ?? accentBtn.indigo;
  const ring          = accentRing[assignment.accentColor] ?? accentRing.indigo;
  const closingReady  = closing.insight.trim().length > 0 && closing.action.trim().length > 0 && closing.question.trim().length > 0;

  if (!hydrated) return <div className="h-64 bg-gray-100 rounded-2xl animate-pulse mt-6" />;

  if (!assignment.isUnlocked) {
    return (
      <Card className="text-center py-12">
        <div className="text-3xl mb-3">🔒</div>
        <h2 className="font-bold text-gray-700 mb-1">מטלה נעולה</h2>
        <p className="text-sm text-gray-400">השלם את המטלה הקודמת כדי לפתוח מטלה זו.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showAchievement && (
        <AchievementBadge
          label={assignment.achievementLabel}
          accentColor={assignment.accentColor}
          onDismiss={() => setShowAchievement(false)}
        />
      )}

      {/* Phase tracker */}
      <Card className="py-3">
        <PhaseTracker phases={assignment.phases} currentIndex={phaseIndex} accentColor={assignment.accentColor} />
      </Card>

      {/* ── Briefing ── */}
      {currentPhase?.id === "briefing" && (
        <Card>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">המשימה שלך</p>
          <p className="text-sm text-gray-700 leading-relaxed mb-5">{assignment.missionBrief}</p>
          <button onClick={advancePhase} className={`w-full text-white font-semibold py-3 rounded-xl transition-colors ${btn}`}>
            הבנתי — נתחיל ←
          </button>
        </Card>
      )}

      {/* ── Main tool ── */}
      {currentPhase?.id === "main" && ToolComponent && (
        <Suspense fallback={<div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />}>
          <ToolComponent assignmentId={assignment.id} onComplete={advancePhase} />
        </Suspense>
      )}

      {/* ── Insight / closing ── */}
      {currentPhase?.id === "insight" && (
        <Card>
          <h2 className="font-bold text-gray-900 mb-1">סיכום המטלה</h2>
          <p className="text-xs text-gray-400 mb-5">מלא את שלושת השדות — זה מה שתביא למפגש הבא</p>

          {[
            { key: "insight" as const, label: "💡 תובנה", placeholder: "מה הדבר החשוב ביותר שלמדת ממטלה זו?" },
            { key: "action"  as const, label: "✅ פעולה",  placeholder: "פעולה אחת קונקרטית שתיישם בשבועיים הקרובים..." },
            { key: "question" as const, label: "❓ שאלה",   placeholder: "שאלה אחת שתרצה להביא למפגש הבא..." },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <textarea
                value={closing[key]}
                onChange={(e) => updateClosing(key, e.target.value)}
                placeholder={placeholder}
                rows={3}
                className={`w-full p-3 rounded-xl border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 ${ring}`}
                dir="rtl"
              />
            </div>
          ))}

          {status !== "submitted" && (
            <button
              onClick={handleSubmit}
              disabled={!closingReady}
              className={`w-full text-white font-semibold py-3 rounded-xl transition-colors ${
                closingReady ? btn : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {closingReady ? "הגש מטלה ←" : "מלא את כל השדות כדי להגיש"}
            </button>
          )}
          {status === "submitted" && (
            <div className="p-3 bg-emerald-50 rounded-xl text-sm text-emerald-700 font-medium text-center">
              ✓ המטלה הוגשה בהצלחה
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
