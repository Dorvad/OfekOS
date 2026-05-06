"use client";

import { useState, useEffect, useRef } from "react";
import { getAssignmentData, setAssignmentData } from "@/lib/assignment-storage";

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  support: number;
  whatTheyNeed: string;
  nextAction: string;
}

interface ManagingUpData {
  stakeholders: Stakeholder[];
  topic: string;
  phrasing: string;
}

const EMPTY: ManagingUpData = { stakeholders: [], topic: "", phrasing: "" };

function getId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function ManagingUpTool({ assignmentId }: { assignmentId: string }) {
  const [data, setData] = useState<ManagingUpData>(EMPTY);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = getAssignmentData<ManagingUpData>(assignmentId);
    if (stored) setData(stored as ManagingUpData);
  }, [assignmentId]);

  function persist(next: ManagingUpData) {
    setData(next);
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setAssignmentData(assignmentId, next);
      setSaved(true);
    }, 800);
  }

  function addStakeholder() {
    if (!newName.trim()) return;
    const s: Stakeholder = {
      id: getId(),
      name: newName.trim(),
      role: newRole.trim(),
      support: 3,
      whatTheyNeed: "",
      nextAction: "",
    };
    persist({ ...data, stakeholders: [...data.stakeholders, s] });
    setNewName("");
    setNewRole("");
  }

  function updateStakeholder(id: string, key: keyof Stakeholder, value: string | number) {
    const next = data.stakeholders.map((s) => (s.id === id ? { ...s, [key]: value } : s));
    persist({ ...data, stakeholders: next });
  }

  function removeStakeholder(id: string) {
    persist({ ...data, stakeholders: data.stakeholders.filter((s) => s.id !== id) });
  }

  function updateField(key: "topic" | "phrasing", value: string) {
    persist({ ...data, [key]: value });
  }

  const avgSupport =
    data.stakeholders.length > 0
      ? Math.round(data.stakeholders.reduce((s, k) => s + k.support, 0) / data.stakeholders.length)
      : 0;

  const supportColor =
    avgSupport >= 4 ? "text-emerald-600" :
    avgSupport >= 2 ? "text-amber-600" :
    "text-red-500";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">ניהול כלפי מעלה</h2>
        <span className={`text-xs ${saved ? "text-emerald-600" : "text-gray-400"}`}>
          {saved ? "נשמר ✓" : `${data.stakeholders.length} בעלי עניין`}
        </span>
      </div>

      {/* Topic */}
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">הנושא שאני רוצה לקדם</label>
        <textarea
          value={data.topic}
          onChange={(e) => updateField("topic", e.target.value)}
          placeholder="תאר בקצרה את הנושא, הצורך או הרעיון..."
          className="w-full min-h-[80px] rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
          dir="rtl"
        />
      </div>

      {/* Add stakeholder */}
      <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
        <h3 className="text-sm font-semibold text-emerald-800 mb-3">הוסף בעל עניין</h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="שם"
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            dir="rtl"
          />
          <input
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="תפקיד"
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            dir="rtl"
          />
        </div>
        <button
          onClick={addStakeholder}
          disabled={!newName.trim()}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
        >
          + הוסף
        </button>
      </div>

      {/* Stakeholder cards */}
      {data.stakeholders.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">עוצמת קואליציה ממוצעת:</span>
            <span className={`font-bold text-sm ${supportColor}`}>{avgSupport}/5</span>
          </div>
          <div className="space-y-3">
            {data.stakeholders.map((s) => (
              <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-900">{s.name}</span>
                    {s.role && <span className="text-xs text-gray-400 mr-2">— {s.role}</span>}
                  </div>
                  <button onClick={() => removeStakeholder(s.id)} className="text-gray-300 hover:text-red-400">✕</button>
                </div>
                <div className="mb-3">
                  <label className="text-xs text-gray-500 block mb-1">רמת תמיכה ({s.support}/5)</label>
                  <input
                    type="range" min={1} max={5} value={s.support}
                    onChange={(e) => updateStakeholder(s.id, "support", Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
                <textarea
                  value={s.whatTheyNeed}
                  onChange={(e) => updateStakeholder(s.id, "whatTheyNeed", e.target.value)}
                  placeholder="מה הם צריכים לשמוע?"
                  className="w-full min-h-[60px] rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-2"
                  dir="rtl"
                />
                <input
                  value={s.nextAction}
                  onChange={(e) => updateStakeholder(s.id, "nextAction", e.target.value)}
                  placeholder="הפעולה הבאה שלי"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  dir="rtl"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Phrasing */}
      {data.stakeholders.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">הניסוח שלי לשיחה</label>
          <textarea
            value={data.phrasing}
            onChange={(e) => updateField("phrasing", e.target.value)}
            placeholder="כיצד תפתח את השיחה? מה תגיד?"
            className="w-full min-h-[100px] rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
            dir="rtl"
          />
        </div>
      )}

      {data.stakeholders.length >= 1 && data.topic.trim().length > 0 && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium text-center">
          ✓ תכנית ההשפעה בנויה — עבור לשלב הבא
        </div>
      )}
    </div>
  );
}
