"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Assignment, AssignmentStatus } from "@/lib/types";
import {
  getAssignmentStatus,
  getAssignmentPhase,
} from "@/lib/assignment-storage";
import AssignmentCard from "./AssignmentCard";
import ProgramAxis from "./ProgramAxis";
import Card from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";

interface AssignmentListClientProps {
  assignments: Assignment[];
}

export default function AssignmentListClient({ assignments }: AssignmentListClientProps) {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, AssignmentStatus>>({});
  const [phaseIndices, setPhaseIndices] = useState<Record<string, number>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("participant-assignment-locks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assignments" },
        () => { router.refresh(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  useEffect(() => {
    // 1. Seed from localStorage immediately for fast render
    const s: Record<string, AssignmentStatus> = {};
    const p: Record<string, number> = {};
    for (const a of assignments) {
      if (!a.isUnlocked) {
        s[a.id] = "locked";
        p[a.id] = 0;
      } else {
        s[a.id] = getAssignmentStatus(a.id);
        const phaseId = getAssignmentPhase(a.id);
        p[a.id] = phaseId
          ? Math.max(0, a.phases.findIndex((ph) => ph.id === phaseId))
          : 0;
      }
    }
    setStatuses(s);
    setPhaseIndices(p);
    setHydrated(true);

    // 2. Overlay with Supabase data (DB is authoritative; recovers cleared localStorage)
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: rows } = await supabase
        .from("participant_assignments")
        .select("assignment_id, status, current_phase")
        .eq("user_id", user.id);
      if (!rows || rows.length === 0) return;

      setStatuses((prev) => {
        const next = { ...prev };
        for (const row of rows) {
          const a = assignments.find((a) => a.id === row.assignment_id);
          if (a?.isUnlocked && row.status && row.status !== "locked") {
            next[row.assignment_id] = row.status as AssignmentStatus;
            // keep localStorage in sync
            import("@/lib/assignment-storage").then(({ setAssignmentStatus }) =>
              setAssignmentStatus(row.assignment_id, row.status as AssignmentStatus)
            );
          }
        }
        return next;
      });

      setPhaseIndices((prev) => {
        const next = { ...prev };
        for (const row of rows) {
          if (row.current_phase) {
            const a = assignments.find((a) => a.id === row.assignment_id);
            if (a) {
              const idx = a.phases.findIndex((ph) => ph.id === row.current_phase);
              if (idx >= 0) {
                next[row.assignment_id] = idx;
                import("@/lib/assignment-storage").then(({ setAssignmentPhase }) =>
                  setAssignmentPhase(row.assignment_id, row.current_phase)
                );
              }
            }
          }
        }
        return next;
      });
    })();
  }, [assignments]);

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assignments.map((a) => (
            <div key={a.id} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const completedCount = Object.values(statuses).filter(
    (s) => s === "submitted" || s === "achieved"
  ).length;

  return (
    <div className="space-y-5">
      {/* Program axis strip */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">מסע התוכנית</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {completedCount}/{assignments.length} הושלמו
          </span>
        </div>
        <ProgramAxis assignments={assignments} statuses={statuses} />
      </Card>

      {/* Assignment grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {assignments.map((a) => (
          <AssignmentCard
            key={a.id}
            assignment={a}
            status={statuses[a.id] ?? "locked"}
            currentPhaseIndex={phaseIndices[a.id] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
