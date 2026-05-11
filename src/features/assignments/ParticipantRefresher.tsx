"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Invisible component that keeps participant pages fresh by:
 * 1. Calling router.refresh() when the window regains focus
 *    (covers admin toggling lock states in another tab)
 * 2. Subscribing to real-time changes on `assignments` and
 *    `participant_assignments` → router.refresh() immediately
 */
export default function ParticipantRefresher() {
  const router = useRouter();

  // Window focus refresh — reliable fallback when real-time is unavailable
  useEffect(() => {
    function handleFocus() { router.refresh(); }
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [router]);

  // Real-time subscription for instant updates when available
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("participant-page-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "assignments" }, () => {
        router.refresh();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "participant_assignments" }, () => {
        router.refresh();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [router]);

  return null;
}
