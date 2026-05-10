"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import type { Participant, Cohort } from "@/lib/types";
import {
  createCohort,
  deleteCohort,
  renameCohort,
  updateParticipantCohort,
} from "@/lib/admin-service";
import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function avgProgress(members: Participant[]): number {
  if (!members.length) return 0;
  return Math.round(members.reduce((s, p) => s + p.progress, 0) / members.length);
}

function getAssignmentDots(p: Participant) {
  return MOCK_ASSIGNMENTS.map((a, i) => {
    const threshold = ((i + 1) / 6) * 100;
    if (p.progress >= threshold) return "submitted";
    if (p.progress > (i / 6) * 100) return "inProgress";
    return "none";
  });
}

interface Props {
  participants: Participant[];
  cohorts: Cohort[];
  onDataChange: () => void;
}

export default function CohortsTab({ participants, cohorts, onDataChange }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editingName, setEditingName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [newCohortInput, setNewCohortInput] = useState("");
  const [showNewCohort, setShowNewCohort] = useState(false);

  const unassigned = participants.filter((p) => !p.cohortId);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function startRename(cohort: Cohort) {
    setEditingName(cohort.id);
    setNameInput(cohort.name);
  }

  async function commitRename() {
    if (editingName && nameInput.trim()) {
      await renameCohort(editingName, nameInput.trim());
      onDataChange();
    }
    setEditingName(null);
  }

  async function handleCreateCohort() {
    if (!newCohortInput.trim()) return;
    await createCohort(newCohortInput.trim());
    setNewCohortInput("");
    setShowNewCohort(false);
    onDataChange();
  }

  async function handleDeleteCohort(id: string) {
    if (!confirm("למחוק את הקבוצה? המשתתפים יועברו לקטגוריית 'ללא קבוצה'.")) return;
    await deleteCohort(id);
    onDataChange();
  }

  async function handleRemoveMember(userId: string) {
    await updateParticipantCohort(userId, null);
    onDataChange();
  }

  async function handleAssignToCohort(userId: string, cohortId: string) {
    await updateParticipantCohort(userId, cohortId);
    onDataChange();
  }

  return (
    <div className="space-y-4">
      {/* Header action */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-gray-500">
          {cohorts.length} קבוצות · {unassigned.length} משתתפים ללא קבוצה
        </h2>
        {!showNewCohort ? (
          <button
            onClick={() => setShowNewCohort(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            + צור קבוצה חדשה
          </button>
        ) : (
          <div className="flex gap-2 items-center">
            <input
              autoFocus
              value={newCohortInput}
              onChange={(e) => setNewCohortInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreateCohort(); if (e.key === "Escape") setShowNewCohort(false); }}
              placeholder="שם הקבוצה"
              className="px-3 py-2 rounded-xl border border-indigo-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              dir="rtl"
            />
            <button onClick={handleCreateCohort} className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-xl">צור</button>
            <button onClick={() => setShowNewCohort(false)} className="px-3 py-2 text-gray-500 text-sm hover:bg-gray-100 rounded-xl">×</button>
          </div>
        )}
      </div>

      {/* Cohort cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cohorts.map((cohort) => {
          const members = participants.filter((p) => p.cohortId === cohort.id);
          const avg = avgProgress(members);
          const isExpanded = expanded.has(cohort.id);

          return (
            <Card key={cohort.id} padding={false} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    {editingName === cohort.id ? (
                      <input
                        autoFocus
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setEditingName(null); }}
                        className="font-bold text-gray-900 bg-transparent border-b-2 border-indigo-400 focus:outline-none w-full text-sm"
                        dir="rtl"
                      />
                    ) : (
                      <h3 className="font-bold text-gray-900 text-sm">{cohort.name}</h3>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">{members.length} משתתפים</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => startRename(cohort)}
                      className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 text-xs"
                      title="שנה שם"
                    >
                      ✏️
                    </button>
                    {members.length === 0 && (
                      <button
                        onClick={() => handleDeleteCohort(cohort.id)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 text-xs"
                        title="מחק קבוצה"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-indigo-400 rounded-full transition-all"
                    style={{ width: `${avg}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mb-3">השלמה ממוצעת: {avg}%</p>

                <button
                  onClick={() => toggle(cohort.id)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {isExpanded ? "▲ הסתר חברים" : "▼ הצג חברים"}
                </button>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {members.length === 0 && (
                    <p className="px-4 py-3 text-xs text-gray-400">הקבוצה ריקה</p>
                  )}
                  {members.map((m) => {
                    const dots = getAssignmentDots(m);
                    return (
                      <div key={m.id} className="px-4 py-2.5 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {initials(m.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">{m.name}</p>
                          <div className="flex gap-0.5 mt-1">
                            {dots.map((d, i) => (
                              <span key={i} className={`w-2 h-2 rounded-full ${
                                d === "submitted" ? "bg-emerald-400"
                                : d === "inProgress" ? "bg-amber-400"
                                : "bg-gray-200"
                              }`} />
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveMember(m.id)}
                          className="text-xs text-gray-400 hover:text-red-500 shrink-0"
                          title="הסר מקבוצה"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Unassigned */}
      {unassigned.length > 0 && (
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 text-sm">ללא קבוצה</h3>
            <span className="text-xs text-gray-400">{unassigned.length} משתתפים</span>
          </div>
          <div className="divide-y divide-gray-50">
            {unassigned.map((p) => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">
                  {initials(p.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.email}</p>
                </div>
                <div className="relative">
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) handleAssignToCohort(p.id, e.target.value);
                    }}
                    className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-600"
                    dir="rtl"
                  >
                    <option value="" disabled>הוסף לקבוצה ▾</option>
                    {cohorts.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
