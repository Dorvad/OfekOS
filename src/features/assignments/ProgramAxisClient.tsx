"use client";

import { useState, useEffect } from "react";
import type { Assignment, AssignmentStatus } from "@/lib/types";
import { getAssignmentStatus } from "@/lib/assignment-storage";
import ProgramAxis from "./ProgramAxis";

interface ProgramAxisClientProps {
  assignments: Assignment[];
}

export default function ProgramAxisClient({ assignments }: ProgramAxisClientProps) {
  const [statuses, setStatuses] = useState<Record<string, AssignmentStatus>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s: Record<string, AssignmentStatus> = {};
    for (const a of assignments) {
      s[a.id] = a.isUnlocked ? getAssignmentStatus(a.id) : "locked";
    }
    setStatuses(s);
    setHydrated(true);
  }, [assignments]);

  if (!hydrated) {
    return <div className="flex gap-2">{assignments.map((a) => <div key={a.id} className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />)}</div>;
  }

  return <ProgramAxis assignments={assignments} statuses={statuses} />;
}
