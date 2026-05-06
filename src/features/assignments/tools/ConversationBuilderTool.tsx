"use client";

import { useState, useEffect, useRef } from "react";
import { getAssignmentData, setAssignmentData } from "@/lib/assignment-storage";

interface ConversationData {
  who: string;
  situation: string;
  behavior: string;
  impact: string;
  request: string;
  expectedResponse: string;
}

const STEPS: { key: keyof ConversationData; label: string; prompt: string }[] = [
  { key: "who",              label: "מי?",              prompt: "עם מי אתה רוצה לנהל את השיחה?" },
  { key: "situation",        label: "מצב (Situation)",  prompt: "תאר את המצב הספציפי שהתרחש" },
  { key: "behavior",         label: "התנהגות (Behaviour)", prompt: "מה בדיוק עשה/אמר האדם? (עובדות, לא פרשנויות)" },
  { key: "impact",           label: "השפעה (Impact)",   prompt: "מה הייתה ההשפעה של ההתנהגות הזו?" },
  { key: "request",          label: "בקשה",             prompt: "מה אתה מבקש שישתנה בעתיד?" },
  { key: "expectedResponse", label: "תגובה צפויה",      prompt: "איך אתה מצפה שהאדם יגיב? איך תתכונן לכך?" },
];

const EMPTY: ConversationData = { who: "", situation: "", behavior: "", impact: "", request: "", expectedResponse: "" };

export default function ConversationBuilderTool({ assignmentId }: { assignmentId: string }) {
  const [data, setData] = useState<ConversationData>(EMPTY);
  const [activeStep, setActiveStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = getAssignmentData<ConversationData>(assignmentId);
    if (stored) {
      setData(stored as ConversationData);
      // Find the first incomplete step
      const keys = STEPS.map((s) => s.key);
      const firstEmpty = keys.findIndex((k) => !(stored as ConversationData)[k]?.trim());
      setActiveStep(firstEmpty === -1 ? STEPS.length - 1 : firstEmpty);
    }
  }, [assignmentId]);

  function handleChange(key: keyof ConversationData, value: string) {
    const next = { ...data, [key]: value };
    setData(next);
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setAssignmentData(assignmentId, next);
      setSaved(true);
    }, 800);
  }

  function advanceStep() {
    if (activeStep < STEPS.length - 1) setActiveStep(activeStep + 1);
  }

  const completedCount = STEPS.filter((s) => data[s.key].trim().length > 0).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">בונה שיחת המשוב</h2>
        <span className={`text-xs ${saved ? "text-emerald-600" : "text-gray-400"}`}>
          {saved ? "נשמר ✓" : `${completedCount}/${STEPS.length} שלבים`}
        </span>
      </div>

      {/* Completed steps summary chips */}
      {completedCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {STEPS.slice(0, activeStep).map((step) => (
            <button
              key={step.key}
              onClick={() => setActiveStep(STEPS.indexOf(step))}
              className="flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-medium"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {step.label}
            </button>
          ))}
        </div>
      )}

      {/* Active step card */}
      {STEPS[activeStep] && (
        <div className="rounded-xl border-2 border-violet-200 bg-violet-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {activeStep + 1}
            </div>
            <span className="font-semibold text-violet-800">{STEPS[activeStep].label}</span>
          </div>
          <p className="text-xs text-violet-600 mb-2">{STEPS[activeStep].prompt}</p>
          <textarea
            value={data[STEPS[activeStep].key]}
            onChange={(e) => handleChange(STEPS[activeStep].key, e.target.value)}
            placeholder="כתוב כאן..."
            className="w-full min-h-[100px] bg-white rounded-lg border border-violet-200 p-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
            dir="rtl"
            autoFocus
          />
          {data[STEPS[activeStep].key].trim().length > 0 && activeStep < STEPS.length - 1 && (
            <button
              onClick={advanceStep}
              className="mt-3 w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
            >
              הבא ←
            </button>
          )}
        </div>
      )}

      {completedCount === STEPS.length && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium text-center">
          ✓ שיחת המשוב בנויה — עבור לשלב הבא
        </div>
      )}
    </div>
  );
}
