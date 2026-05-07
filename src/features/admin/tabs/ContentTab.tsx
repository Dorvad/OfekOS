"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import type { AdminResource } from "@/lib/types";
import {
  setAssignmentLocked,
  addResource,
  deleteResource,
} from "@/lib/admin-service";
import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";

const TYPE_ICONS: Record<string, string> = {
  pdf: "📄",
  link: "🔗",
  template: "📝",
  video: "🎥",
  other: "📎",
};

const TYPE_LABELS: Record<string, string> = {
  pdf: "PDF",
  link: "קישור",
  template: "תבנית",
  video: "וידאו",
  other: "אחר",
};

function formatSize(kb: number | null): string {
  if (!kb) return "—";
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

interface Props {
  lockStates: Record<string, boolean>;
  resources: AdminResource[];
  onDataChange: () => void;
}

interface ResourceForm {
  name: string;
  sessionNumber: string;
  type: string;
  url: string;
  description: string;
}

const EMPTY_FORM: ResourceForm = {
  name: "",
  sessionNumber: "1",
  type: "pdf",
  url: "",
  description: "",
};

export default function ContentTab({ lockStates, resources, onDataChange }: Props) {
  const [locks, setLocks] = useState(lockStates);
  const [form, setForm] = useState<ResourceForm>(EMPTY_FORM);
  const [sessionFilter, setSessionFilter] = useState<string>("all");

  function handleToggle(assignmentId: string) {
    const next = !locks[assignmentId];
    setLocks((prev) => ({ ...prev, [assignmentId]: next }));
    setAssignmentLocked(assignmentId, next);
  }

  function handleAddResource() {
    if (!form.name.trim()) return;
    addResource({
      name: form.name.trim(),
      sessionNumber: parseInt(form.sessionNumber),
      type: form.type as AdminResource["type"],
      url: form.url.trim() || null,
      fileSizeKb: null,
      description: form.description.trim(),
    });
    setForm(EMPTY_FORM);
    onDataChange();
  }

  function handleDeleteResource(id: string) {
    deleteResource(id);
    onDataChange();
  }

  const filteredResources =
    sessionFilter === "all"
      ? resources
      : resources.filter((r) => r.sessionNumber === parseInt(sessionFilter));

  return (
    <div className="space-y-6">

      {/* ── Assignment locks ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">ניהול נעילת מטלות</h2>
        <Card padding={false}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium">
                <th className="text-right px-5 py-3 w-8">#</th>
                <th className="text-right px-4 py-3">מטלה</th>
                <th className="text-right px-4 py-3 hidden sm:table-cell">מפגש</th>
                <th className="text-right px-4 py-3">סטטוס</th>
                <th className="text-right px-4 py-3">פעולה</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_ASSIGNMENTS.map((a) => {
                const unlocked = locks[a.id] ?? false;
                return (
                  <tr key={a.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-xs text-gray-400">{a.sessionNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-400">{a.subtitle}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">מפגש {a.sessionNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        unlocked
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}>
                        {unlocked ? "🟢 פתוחה" : "🔴 נעולה"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(a.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                          unlocked
                            ? "border-red-200 text-red-600 hover:bg-red-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {unlocked ? "🔒 נעל" : "🔓 פתח"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ── Resources ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">חומרי למידה</h2>

        {/* Supabase storage note */}
        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
          🔗 העלאת קבצים בפועל תהיה זמינה לאחר חיבור Supabase Storage — כרגע ניתן להוסיף קישורים ומטא-דאטה
        </div>

        {/* Add form */}
        <Card className="mb-4">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">הוסף חומר למידה</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="sm:col-span-2">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="שם החומר"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                dir="rtl"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={form.sessionNumber}
                onChange={(e) => setForm((f) => ({ ...f, sessionNumber: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white"
                dir="rtl"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>מפגש {n}</option>
                ))}
              </select>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white"
                dir="rtl"
              >
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="קישור (אופציונלי)"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                dir="ltr"
              />
            </div>
            <button
              onClick={handleAddResource}
              disabled={!form.name.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              הוסף חומר ←
            </button>
          </div>
        </Card>

        {/* Filter + list */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-gray-500">סנן לפי מפגש:</span>
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none bg-white"
            dir="rtl"
          >
            <option value="all">הכל</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>מפגש {n}</option>
            ))}
          </select>
        </div>

        <Card padding={false}>
          {filteredResources.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">אין חומרי למידה עדיין</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium">
                  <th className="text-right px-5 py-3">שם</th>
                  <th className="text-right px-4 py-3 hidden sm:table-cell">מפגש</th>
                  <th className="text-right px-4 py-3 hidden md:table-cell">סוג</th>
                  <th className="text-right px-4 py-3 hidden lg:table-cell">גודל</th>
                  <th className="text-right px-4 py-3 hidden lg:table-cell">הועלה</th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredResources.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{TYPE_ICONS[r.type]}</span>
                        <div>
                          <p className="font-medium text-gray-900">{r.name}</p>
                          {r.url && (
                            <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline" dir="ltr">
                              {r.url.slice(0, 40)}{r.url.length > 40 ? "…" : ""}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-xs text-gray-500">מפגש {r.sessionNumber}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{TYPE_LABELS[r.type]}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">{formatSize(r.fileSizeKb)}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">{r.uploadedAt}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteResource(r.id)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 text-xs mx-auto"
                        title="מחק"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            {filteredResources.length} פריטים
          </div>
        </Card>
      </div>
    </div>
  );
}
