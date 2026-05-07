"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import type { Participant, Cohort } from "@/lib/types";
import {
  createParticipant,
  deleteParticipant,
  updateParticipantCohort,
} from "@/lib/admin-service";
import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function daysSince(dateStr: string): string {
  const diff = Math.round(
    (new Date("2025-05-07").getTime() - new Date(dateStr).getTime()) / 86400000
  );
  if (diff === 0) return "היום";
  if (diff === 1) return "אתמול";
  return `לפני ${diff} ימים`;
}

interface Props {
  participants: Participant[];
  cohorts: Cohort[];
  onDataChange: () => void;
}

interface AddForm {
  name: string;
  email: string;
  cohortId: string;
}

export default function ParticipantsTab({ participants, cohorts, onDataChange }: Props) {
  const [search, setSearch] = useState("");
  const [cohortFilter, setCohortFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Participant | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [changeCohortFor, setChangeCohortFor] = useState<string | null>(null);
  const [form, setForm] = useState<AddForm>({ name: "", email: "", cohortId: "" });
  const [busy, setBusy] = useState(false);

  const filtered = participants.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchCohort =
      cohortFilter === "all" ||
      (cohortFilter === "none" ? !p.cohortId : p.cohortId === cohortFilter);
    return matchSearch && matchCohort;
  });

  async function handleAdd() {
    if (!form.name.trim() || !form.email.trim()) return;
    setBusy(true);
    try {
      await createParticipant({
        name: form.name.trim(),
        email: form.email.trim(),
        cohortId: form.cohortId || null,
      });
      setForm({ name: "", email: "", cohortId: "" });
      setShowAdd(false);
      onDataChange();
    } catch (err) {
      alert("שגיאה בהוספת משתתף: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    try {
      await deleteParticipant(id);
      setDeleteTarget(null);
      onDataChange();
    } catch (err) {
      alert("שגיאה במחיקת משתתף: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  }

  async function handleChangeCohort(userId: string, cohortId: string) {
    await updateParticipantCohort(userId, cohortId === "none" ? null : cohortId);
    setChangeCohortFor(null);
    setOpenMenu(null);
    onDataChange();
  }

  function getCohortName(id: string | null): string {
    if (!id) return "ללא קבוצה";
    return cohorts.find((c) => c.id === id)?.name ?? "ללא קבוצה";
  }

  // Assignment dots — approximate from progress (0–100 → 0–6 submitted)
  function getAssignmentDots(p: Participant) {
    return MOCK_ASSIGNMENTS.map((a, i) => {
      const threshold = ((i + 1) / 6) * 100;
      if (p.progress >= threshold) return "submitted";
      if (p.progress > (i / 6) * 100) return "inProgress";
      return "none";
    });
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 חפש שם או אימייל..."
            className="w-56 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            dir="rtl"
          />
          <select
            value={cohortFilter}
            onChange={(e) => setCohortFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            dir="rtl"
          >
            <option value="all">כל הקבוצות</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            <option value="none">ללא קבוצה</option>
          </select>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          + הוסף משתתף
        </button>
      </div>

      {/* Table */}
      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium">
              <th className="text-right px-5 py-3 w-10" />
              <th className="text-right px-4 py-3">שם</th>
              <th className="text-right px-4 py-3 hidden md:table-cell">אימייל</th>
              <th className="text-right px-4 py-3 hidden sm:table-cell">קבוצה</th>
              <th className="text-right px-4 py-3">מטלות</th>
              <th className="text-right px-4 py-3 hidden lg:table-cell">פעיל לאחרונה</th>
              <th className="px-3 py-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">
                  לא נמצאו משתתפים
                </td>
              </tr>
            )}
            {filtered.map((p) => {
              const dots = getAssignmentDots(p);
              return (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                      {initials(p.name)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400 md:hidden truncate max-w-[140px]">{p.email}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-gray-500 text-xs">{p.email}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                      {getCohortName(p.cohortId)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {dots.map((dot, i) => (
                        <span
                          key={i}
                          className={`w-2.5 h-2.5 rounded-full ${
                            dot === "submitted" ? "bg-emerald-400"
                            : dot === "inProgress" ? "bg-amber-400"
                            : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">
                    {daysSince(p.lastActive)}
                  </td>
                  <td className="px-3 py-3 relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === p.id ? null : p.id)}
                      className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      ⋮
                    </button>
                    {openMenu === p.id && (
                      <div className="absolute left-0 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[140px]">
                        <button
                          onClick={() => {
                            setChangeCohortFor(p.id);
                            setOpenMenu(null);
                          }}
                          className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          שנה קבוצה
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget(p);
                            setOpenMenu(null);
                          }}
                          className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          מחק משתתף
                        </button>
                      </div>
                    )}
                    {changeCohortFor === p.id && (
                      <div className="absolute left-0 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px]">
                        <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-100">העבר לקבוצה</div>
                        {cohorts.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => handleChangeCohort(p.id, c.id)}
                            className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {c.name}
                          </button>
                        ))}
                        <button
                          onClick={() => handleChangeCohort(p.id, "none")}
                          className="w-full text-right px-4 py-2 text-sm text-gray-500 hover:bg-gray-50"
                        >
                          הסר מקבוצה
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          {filtered.length} מתוך {participants.length} משתתפים
        </div>
      </Card>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-gray-900 mb-5">הוספת משתתף</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">שם מלא</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="שם פרטי ושם משפחה"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">כתובת אימייל</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">קבוצה</label>
                <select
                  value={form.cohortId}
                  onChange={(e) => setForm((f) => ({ ...f, cohortId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                  dir="rtl"
                >
                  <option value="">בחר קבוצה (אופציונלי)</option>
                  {cohorts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                ביטול
              </button>
              <button
                onClick={handleAdd}
                disabled={!form.name.trim() || !form.email.trim() || busy}
                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold transition-colors"
              >
                {busy ? "שולח..." : "הוסף ←"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border-2 border-red-100" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-gray-900 mb-2">מחיקת משתתף</h2>
            <p className="text-sm text-gray-600 mb-1">האם למחוק את <strong>{deleteTarget.name}</strong>?</p>
            <p className="text-xs text-red-500 mb-6">פעולה זו אינה ניתנת לביטול.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                ביטול
              </button>
              <button
                onClick={() => handleDelete(deleteTarget.id)}
                disabled={busy}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold transition-colors"
              >
                {busy ? "מוחק..." : "מחק 🗑️"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click-away for menus */}
      {(openMenu || changeCohortFor) && (
        <div className="fixed inset-0 z-10" onClick={() => { setOpenMenu(null); setChangeCohortFor(null); }} />
      )}
    </div>
  );
}
