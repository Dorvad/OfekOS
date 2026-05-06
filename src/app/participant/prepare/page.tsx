"use client";

import { useState, useEffect } from "react";
import { MOCK_SESSIONS, MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import Card from "@/components/ui/Card";
import Link from "next/link";

const PREPARE_KEY = "ofekos:prepare:u1:data";

interface PrepareData {
  insight: string;
  dilemma: string;
  action: string;
  question: string;
}

const EMPTY: PrepareData = { insight: "", dilemma: "", action: "", question: "" };

const FIELDS: { key: keyof PrepareData; label: string; placeholder: string }[] = [
  { key: "insight",  label: "תובנה",  placeholder: "מה למדת מהמפגש הקודם?" },
  { key: "dilemma",  label: "דילמה",  placeholder: "מה מעסיק אותך כרגע בתפקיד המנהל?" },
  { key: "action",   label: "פעולה",  placeholder: "מה התחייבת לעשות? האם עשית זאת?" },
  { key: "question", label: "שאלה",   placeholder: "מה שאלה שתרצה לשאול במפגש הבא?" },
];

export default function PreparePage() {
  const [data, setData] = useState<PrepareData>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(PREPARE_KEY);
    if (raw) {
      try { setData(JSON.parse(raw)); } catch { /* ignore */ }
    }
    setHydrated(true);
  }, []);

  function handleChange(key: keyof PrepareData, value: string) {
    const next = { ...data, [key]: value };
    setData(next);
    setSaved(false);
    localStorage.setItem(PREPARE_KEY, JSON.stringify(next));
    setSaved(true);
  }

  const nextSession = MOCK_SESSIONS.find(
    (s) => s.status === "active" || s.status === "upcoming"
  );

  const nextAssignment = MOCK_ASSIGNMENTS.find((a) => a.isUnlocked);
  const filledCount = Object.values(data).filter((v) => v.trim().length > 0).length;

  if (!hydrated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">הכנה למפגש</h1>
        <p className="text-sm text-gray-500 mt-1">
          {filledCount > 0 ? `${filledCount} מתוך 4 שדות מולאו` : "מלא את 4 השדות לפני המפגש הבא"}
        </p>
      </div>

      {/* Next session info */}
      {nextSession && (
        <Card className="mb-5 border-indigo-200 bg-indigo-50">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">
            המפגש הבא
          </p>
          <h2 className="font-bold text-gray-900">{nextSession.title}</h2>
          <p className="text-xs text-gray-500 mt-1">{nextSession.date} · {nextSession.durationMinutes} דקות</p>
        </Card>
      )}

      {/* Prepare fields */}
      <div className="space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {field.label}
            </label>
            <textarea
              value={data[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full min-h-[100px] rounded-xl border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              dir="rtl"
            />
          </div>
        ))}
      </div>

      {saved && (
        <p className="text-xs text-emerald-600 font-medium mt-3 text-center">נשמר ✓</p>
      )}

      {/* Link to next assignment */}
      {nextAssignment && (
        <Card className="mt-6 border-dashed border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-1">המטלה הבאה שלך</h2>
          <p className="text-sm text-gray-500 mb-3">{nextAssignment.title} — {nextAssignment.subtitle}</p>
          <Link
            href={`/participant/assignments/${nextAssignment.id}`}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            פתח מטלה ←
          </Link>
        </Card>
      )}
    </div>
  );
}
