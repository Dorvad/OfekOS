"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getAssignmentData, setAssignmentData } from "@/lib/assignment-storage";
import { createClient } from "@/lib/supabase/client";

export function useToolData<T extends object>(
  assignmentId: string,
  defaultData: T
): {
  data: T;
  update: <K extends keyof T>(key: K, value: T[K]) => void;
  updateMany: (patch: Partial<T>) => void;
  saved: boolean;
} {
  const [data, setData] = useState<T>(defaultData);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const stored = getAssignmentData<T>(assignmentId);
    if (stored) setData((prev) => ({ ...prev, ...stored }));
  }, [assignmentId]);

  const syncData = useCallback(async (id: string, next: T) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("participant_assignments").upsert({
      user_id: user.id,
      assignment_id: id,
      data: next,
    }, { onConflict: "user_id,assignment_id" });
  }, []);

  const persist = useCallback((next: T) => {
    clearTimeout(timer.current);
    setSaved(false);
    timer.current = setTimeout(() => {
      setAssignmentData(assignmentId, next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      syncData(assignmentId, next).catch(() => {});
    }, 500);
  }, [assignmentId, syncData]);

  const update = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      persist(next);
      return next;
    });
  }, [persist]);

  const updateMany = useCallback((patch: Partial<T>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, [persist]);

  return { data, update, updateMany, saved };
}
