"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AdminTabNav, { type AdminTab } from "@/features/admin/AdminTabNav";
import OverviewTab from "@/features/admin/tabs/OverviewTab";
import ParticipantsTab from "@/features/admin/tabs/ParticipantsTab";
import CohortsTab from "@/features/admin/tabs/CohortsTab";
import ContentTab from "@/features/admin/tabs/ContentTab";
import AnalyticsTab from "@/features/admin/tabs/AnalyticsTab";
import {
  getParticipants,
  getCohorts,
  getResources,
  getAssignmentLockStates,
  getCompletionStats,
  getSubmissions,
  getPrepareStats,
} from "@/lib/admin-service";
import type { Participant, Cohort, AdminResource, AssignmentCompletionStat, Submission } from "@/lib/types";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState<string>("");

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [lockStates, setLockStates] = useState<Record<string, boolean>>({});
  const [completionStats, setCompletionStats] = useState<AssignmentCompletionStat[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [prepareStats, setPrepareStats] = useState({ completed: 0, total: 0 });

  // Guard: check admin role on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace("/login"); return; }
      supabase
        .from("users")
        .select("role, name")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.role !== "admin") { router.replace("/participant"); return; }
          setAdminName(data.name?.split(" ")[0] ?? "Admin");
        });
    });
  }, [router]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c, r, ls, cs, s, ps] = await Promise.all([
        getParticipants(),
        getCohorts(),
        getResources(),
        getAssignmentLockStates(),
        getCompletionStats(),
        getSubmissions(),
        getPrepareStats(),
      ]);
      setParticipants(p);
      setCohorts(c);
      setResources(r);
      setLockStates(ls);
      setCompletionStats(cs);
      setSubmissions(s);
      setPrepareStats(ps);
    } catch (err) {
      console.error("reload error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload().then(() => setHydrated(true));
  }, [reload]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-14 bg-white border-b border-gray-200" />
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-900">OfekOS</span>
            <span className="text-gray-200">|</span>
            <h1 className="text-sm font-bold text-gray-700">ניהול מערכת</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}>
              {loading ? "..." : (adminName ? `Admin · ${adminName}` : "Admin")}
            </span>
            <Link
              href="/participant"
              className="text-xs text-gray-500 hover:text-indigo-600 transition-colors px-2.5 py-1 rounded-lg hover:bg-indigo-50 font-medium border border-gray-200 hover:border-indigo-200"
            >
              צפה כמשתתף
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2.5 py-1 rounded-lg hover:bg-red-50 font-medium border border-gray-200 hover:border-red-200"
            >
              יציאה
            </button>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <AdminTabNav active={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "overview" && (
          <OverviewTab
            participants={participants}
            submissions={submissions}
            lockStates={lockStates}
            cohortCount={cohorts.length}
            onNavigate={setActiveTab}
            onReload={reload}
          />
        )}
        {activeTab === "participants" && (
          <ParticipantsTab
            participants={participants}
            cohorts={cohorts}
            onDataChange={() => { reload(); }}
          />
        )}
        {activeTab === "cohorts" && (
          <CohortsTab
            participants={participants}
            cohorts={cohorts}
            onDataChange={() => { reload(); }}
          />
        )}
        {activeTab === "content" && (
          <ContentTab
            lockStates={lockStates}
            resources={resources}
            onDataChange={() => { reload(); }}
          />
        )}
        {activeTab === "analytics" && (
          <AnalyticsTab
            completionStats={completionStats}
            submissions={submissions}
            prepareStats={prepareStats}
            cohorts={cohorts}
            lockStates={lockStates}
            onReload={reload}
          />
        )}
      </main>
    </div>
  );
}
