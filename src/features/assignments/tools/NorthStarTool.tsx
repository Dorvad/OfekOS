"use client";

import { useState, useEffect, useRef } from "react";
import { getAssignmentData, setAssignmentData } from "@/lib/assignment-storage";

interface NorthStarData {
  responsible: string;
  teamResponsible: string;
  doingForTeam: string;
  wantMore: string;
}

const quadrants = [
  { key: "responsible" as keyof NorthStarData, label: "מה אני אחראי עליו?", color: "border-amber-300 bg-amber-50" },
  { key: "teamResponsible" as keyof NorthStarData, label: "מה הצוות אחראי עליו?", color: "border-amber-200 bg-amber-50/60" },
  { key: "doingForTeam" as keyof NorthStarData, label: "מה אני עושה שהצוות צריך לעשות?", color: "border-orange-200 bg-orange-50/60" },
  { key: "wantMore" as keyof NorthStarData, label: "מה אני רוצה לעשות יותר?", color: "border-green-200 bg-green-50/60" },
];

const EMPTY: NorthStarData = { responsible: "", teamResponsible: "", doingForTeam: "", wantMore: "" };

export default function NorthStarTool({ assignmentId }: { assignmentId: string }) {
  const [data, setData] = useState<NorthStarData>(EMPTY);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = getAssignmentData<NorthStarData>(assignmentId);
    if (stored) setData(stored as NorthStarData);
  }, [assignmentId]);

  function handleChange(key: keyof NorthStarData, value: string) {
    const next = { ...data, [key]: value };
    setData(next);
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setAssignmentData(assignmentId, next);
      setSaved(true);
    }, 800);
  }

  const filledCount = Object.values(data).filter((v) => v.trim().length > 10).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">המצפן שלי — 4 רבעים</h2>
        <span className={`text-xs ${saved ? "text-emerald-600" : "text-gray-400"}`}>
          {saved ? "נשמר ✓" : `${filledCount}/4 רבעים`}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quadrants.map((q) => (
          <div key={q.key} className={`rounded-xl border-2 p-4 ${q.color}`}>
            <label className="block text-xs font-semibold text-gray-700 mb-2 leading-snug">
              {q.label}
            </label>
            <textarea
              value={data[q.key]}
              onChange={(e) => handleChange(q.key, e.target.value)}
              placeholder="כתוב כאן..."
              className="w-full min-h-[100px] bg-white/80 rounded-lg border border-white/0 p-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300"
              dir="rtl"
            />
          </div>
        ))}
      </div>

      {filledCount === 4 && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium text-center">
          ✓ כל הרבעים מולאו — עבור לשלב הבא
        </div>
      )}
    </div>
  );
}
