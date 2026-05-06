"use client";

import { useState, useEffect, useRef } from "react";
import { getAssignmentData, setAssignmentData } from "@/lib/assignment-storage";

type Quadrant = "urgent-important" | "not-urgent-important" | "urgent-not-important" | "not-urgent-not-important" | "unsorted";

interface MatrixTask {
  id: string;
  name: string;
  quadrant: Quadrant;
  delegateTo: string;
}

interface PriorityData {
  tasks: MatrixTask[];
}

const EMPTY: PriorityData = { tasks: [] };

function getId() { return Math.random().toString(36).slice(2, 9); }

const QUADRANTS: { key: Quadrant; label: string; sub: string; color: string }[] = [
  { key: "urgent-important",         label: "דחוף + חשוב",           sub: "טפל עכשיו",  color: "border-orange-400 bg-orange-50" },
  { key: "not-urgent-important",     label: "לא דחוף + חשוב",       sub: "תכנן",       color: "border-emerald-400 bg-emerald-50" },
  { key: "urgent-not-important",     label: "דחוף + לא חשוב",       sub: "האצל",       color: "border-amber-400 bg-amber-50" },
  { key: "not-urgent-not-important", label: "לא דחוף + לא חשוב",   sub: "הסר",        color: "border-gray-300 bg-gray-50" },
];

export default function PriorityMatrixTool({ assignmentId }: { assignmentId: string }) {
  const [data, setData] = useState<PriorityData>(EMPTY);
  const [newTask, setNewTask] = useState("");
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = getAssignmentData<PriorityData>(assignmentId);
    if (stored && (stored as PriorityData).tasks) setData(stored as PriorityData);
  }, [assignmentId]);

  function persist(next: PriorityData) {
    setData(next);
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setAssignmentData(assignmentId, next);
      setSaved(true);
    }, 800);
  }

  function addTask() {
    if (!newTask.trim()) return;
    const t: MatrixTask = { id: getId(), name: newTask.trim(), quadrant: "unsorted", delegateTo: "" };
    persist({ tasks: [...data.tasks, t] });
    setNewTask("");
  }

  function assignQuadrant(id: string, q: Quadrant) {
    persist({ tasks: data.tasks.map((t) => t.id === id ? { ...t, quadrant: q } : t) });
  }

  function updateDelegate(id: string, val: string) {
    persist({ tasks: data.tasks.map((t) => t.id === id ? { ...t, delegateTo: val } : t) });
  }

  function removeTask(id: string) {
    persist({ tasks: data.tasks.filter((t) => t.id !== id) });
  }

  const sortedCount = data.tasks.filter((t) => t.quadrant !== "unsorted").length;
  const delegateQ = data.tasks.filter((t) => t.quadrant === "urgent-not-important" || t.quadrant === "not-urgent-not-important");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">מטריצת עדיפויות</h2>
        <span className={`text-xs ${saved ? "text-emerald-600" : "text-gray-400"}`}>
          {saved ? "נשמר ✓" : `${sortedCount}/${data.tasks.length} ממוינות`}
        </span>
      </div>

      {/* Add task */}
      <div className="flex gap-2">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="הוסף משימה..."
          className="flex-1 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          dir="rtl"
        />
        <button
          onClick={addTask}
          disabled={!newTask.trim()}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold px-4 rounded-xl text-sm transition-colors"
        >
          +
        </button>
      </div>

      {/* Unsorted pool */}
      {data.tasks.filter((t) => t.quadrant === "unsorted").length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">מיין את המשימות לרבעים:</p>
          {data.tasks.filter((t) => t.quadrant === "unsorted").map((task) => (
            <div key={task.id} className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-800 flex-1 text-right">{task.name}</span>
              <select
                value={task.quadrant}
                onChange={(e) => assignQuadrant(task.id, e.target.value as Quadrant)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                dir="rtl"
              >
                <option value="unsorted">בחר רבע...</option>
                {QUADRANTS.map((q) => (
                  <option key={q.key} value={q.key}>{q.label}</option>
                ))}
              </select>
              <button onClick={() => removeTask(task.id)} className="text-gray-300 hover:text-red-400 text-xs">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* 2x2 matrix */}
      {sortedCount > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {QUADRANTS.map((q) => {
            const tasks = data.tasks.filter((t) => t.quadrant === q.key);
            return (
              <div key={q.key} className={`rounded-xl border-2 p-3 min-h-[80px] ${q.color}`}>
                <p className="text-xs font-bold text-gray-700 mb-1">{q.label}</p>
                <p className="text-[10px] text-gray-500 mb-2">{q.sub}</p>
                {tasks.map((t) => (
                  <span key={t.id} className="inline-block text-xs bg-white/80 rounded-full px-2 py-0.5 mr-1 mb-1 font-medium text-gray-700">
                    {t.name}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Delegation plan */}
      {delegateQ.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">תכנית האצלה</h3>
          {delegateQ.map((t) => (
            <div key={t.id} className="flex items-center gap-2 mb-2">
              <span className="text-sm flex-1 text-right">{t.name}</span>
              <input
                value={t.delegateTo}
                onChange={(e) => updateDelegate(t.id, e.target.value)}
                placeholder="למי להאציל?"
                className="text-xs border border-amber-200 bg-white rounded-lg px-2 py-1 w-28 focus:outline-none"
                dir="rtl"
              />
            </div>
          ))}
        </div>
      )}

      {sortedCount >= 3 && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium text-center">
          ✓ המטריצה בנויה — עבור לשלב הבא
        </div>
      )}
    </div>
  );
}
