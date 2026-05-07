"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [hydrated, setHydrated] = useState(false);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [lockStates, setLockStates] = useState<Record<string, boolean>>({});
  const [completionStats, setCompletionStats] = useState<AssignmentCompletionStat[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [prepareStats, setPrepareStats] = useState({ completed: 0, total: 0 });

  const reload = useCallback(() => {
    setParticipants(getParticipants());
    setCohorts(getCohorts());
    setResources(getResources());
    setLockStates(getAssignmentLockStates());
    setCompletionStats(getCompletionStats());
    setSubmissions(getSubmissions());
    setPrepareStats(getPrepareStats());
  }, []);

  useEffect(() => {
    reload();
    setHydrated(true);
  }, [reload]);

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
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              ← בית
            </Link>
            <span className="text-gray-200">|</span>
            <h1 className="text-sm font-bold text-gray-900">ניהול מערכת</h1>
          </div>
          <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
            Admin
          </span>
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
          />
        )}
        {activeTab === "participants" && (
          <ParticipantsTab
            participants={participants}
            cohorts={cohorts}
            onDataChange={reload}
          />
        )}
        {activeTab === "cohorts" && (
          <CohortsTab
            participants={participants}
            cohorts={cohorts}
            onDataChange={reload}
          />
        )}
        {activeTab === "content" && (
          <ContentTab
            lockStates={lockStates}
            resources={resources}
            onDataChange={reload}
          />
        )}
        {activeTab === "analytics" && (
          <AnalyticsTab
            completionStats={completionStats}
            submissions={submissions}
            prepareStats={prepareStats}
            cohorts={cohorts}
            lockStates={lockStates}
          />
        )}
      </main>
    </div>
  );
}
