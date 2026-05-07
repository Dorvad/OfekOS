"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PREPARE_KEY = "ofekos:prepare:u1:data";

interface PrepareData {
  insight: string;
  dilemma: string;
  action: string;
  question: string;
}

interface PrepareReminderClientProps {
  sessionNumber: number;
  sessionTitle: string;
  sessionDate: string;
}

export default function PrepareReminderClient({
  sessionNumber,
  sessionTitle,
  sessionDate,
}: PrepareReminderClientProps) {
  const [filled, setFilled] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(PREPARE_KEY);
    if (raw) {
      try {
        const d: PrepareData = JSON.parse(raw);
        setFilled(Object.values(d).filter((v) => v.trim().length > 0).length);
      } catch { /* ignore */ }
    }
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const isDone = filled >= 4;

  return (
    <Link href="/participant/prepare" className="block group">
      <div className={`rounded-2xl border-2 p-4 transition-all group-hover:shadow-md ${
        isDone
          ? "border-emerald-200 bg-emerald-50"
          : filled > 0
          ? "border-amber-200 bg-amber-50"
          : "border-orange-200 bg-orange-50"
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{isDone ? "✅" : "📋"}</span>
              <span className="text-xs font-semibold text-gray-500">
                הכנה למפגש {sessionNumber}
              </span>
            </div>
            <p className="font-semibold text-gray-900 text-sm leading-snug">{sessionTitle}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sessionDate}</p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isDone
                ? "bg-emerald-100 text-emerald-700"
                : "bg-white/80 text-gray-600 border border-gray-200"
            }`}>
              {filled}/4
            </span>
            <span className={`text-xs font-semibold ${
              isDone ? "text-emerald-600" : "text-orange-600"
            } group-hover:underline`}>
              {isDone ? "מוכן ✓" : "הכנה ←"}
            </span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mt-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < filled
                  ? isDone ? "bg-emerald-400" : "bg-amber-400"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        {!isDone && (
          <p className="text-xs text-gray-500 mt-2">
            {filled === 0
              ? "טרם התחלת את ההכנה למפגש הבא"
              : `עוד ${4 - filled} שדות להשלמה לפני המפגש`}
          </p>
        )}
      </div>
    </Link>
  );
}
