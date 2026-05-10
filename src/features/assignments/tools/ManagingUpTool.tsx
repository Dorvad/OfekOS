"use client";

import { useState } from "react";
import { useToolData } from "@/features/assignments/useToolData";
import ToolStepper from "@/features/assignments/ToolStepper";
import Card from "@/components/ui/Card";

interface InfluenceData {
  rawComplaint: string;
  problemFraming: string;
  managerPerspective: string;
  commonInterest: string;
  solution: string;
  managerGain: string;
  concreteRequest: string;
  openingSentence: string;
  checklistClearProblem: boolean;
  checklistSolution: boolean;
  checklistRequest: boolean;
  checklistNonBlaming: boolean;
  checklistManagerInterest: boolean;
}

const DEFAULT: InfluenceData = {
  rawComplaint: "",
  problemFraming: "",
  managerPerspective: "",
  commonInterest: "",
  solution: "",
  managerGain: "",
  concreteRequest: "",
  openingSentence: "",
  checklistClearProblem: false,
  checklistSolution: false,
  checklistRequest: false,
  checklistNonBlaming: false,
  checklistManagerInterest: false,
};

const STEPS_LABELS = ["נקודת המוצא", "נקודת המבט", "ההצעה", "פתיחה ובדיקה"];

const textareaClass =
  "w-full rounded-xl border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400";

interface ToolProps {
  assignmentId: string;
  onComplete: () => void;
}

export default function ManagingUpTool({ assignmentId, onComplete }: ToolProps) {
  const { data, update, saved } = useToolData<InfluenceData>(
    assignmentId,
    DEFAULT
  );
  const [step, setStep] = useState(0);

  const checklistItems: {
    key: keyof InfluenceData;
    label: string;
  }[] = [
    { key: "checklistClearProblem", label: "יש בעיה ברורה" },
    { key: "checklistSolution", label: "יש פתרון מוצע" },
    { key: "checklistRequest", label: "יש בקשה קונקרטית" },
    { key: "checklistNonBlaming", label: "השפה לא מאשימה" },
    { key: "checklistManagerInterest", label: "יש חיבור לאינטרס של המנהל/ת" },
  ];

  const checkCount = checklistItems.filter(
    (item) => data[item.key] as boolean
  ).length;

  const checkColor =
    checkCount >= 4
      ? "text-emerald-700 bg-emerald-100"
      : checkCount >= 2
      ? "text-amber-700 bg-amber-100"
      : "text-red-600 bg-red-100";

  function renderStep0() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-emerald-50 rounded-xl px-3 py-2">
          המטרה היא לא לצאת צודק. המטרה היא להגדיל את הסיכוי שמשהו יזוז.
        </p>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            תלונה גולמית
          </p>
          <p className="text-xs text-gray-500 mb-2">מה מפריע לי כרגע?</p>
          <textarea
            value={data.rawComplaint}
            onChange={(e) => update("rawComplaint", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן בחופשיות, בלי לסנן..."
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            ניסוח הבעיה
          </p>
          <p className="text-xs text-gray-500 mb-2">
            מה בעצם הבעיה המקצועית או הניהולית?
          </p>
          <textarea
            value={data.problemFraming}
            onChange={(e) => update("problemFraming", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="נסח/י את הבעיה בשפה מקצועית..."
          />
        </div>

        <button
          onClick={() => setStep(1)}
          className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors"
        >
          המשך ←
        </button>
      </div>
    );
  }

  function renderStep1() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-emerald-50 rounded-xl px-3 py-2">
          לפני שיחה, כדאי להבין את הנקודת מבט של הממונה.
        </p>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            נקודת המבט של הממונה/ת
          </p>
          <p className="text-xs text-gray-500 mb-2">
            מה חשוב לו/לה? אילו לחצים או יעדים משפיעים?
          </p>
          <textarea
            value={data.managerPerspective}
            onChange={(e) => update("managerPerspective", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            מטרה משותפת
          </p>
          <p className="text-xs text-gray-500 mb-2">
            איפה יש לנו מטרה משותפת?
          </p>
          <textarea
            value={data.commonInterest}
            onChange={(e) => update("commonInterest", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep(0)}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            → חזרה
          </button>
          <button
            onClick={() => setStep(2)}
            className="py-2.5 px-6 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors"
          >
            המשך ←
          </button>
        </div>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-emerald-50 rounded-xl px-3 py-2">
          הגע/י לשיחה עם פתרון — לא רק עם בעיה.
        </p>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            מה אני מציע/ה לעשות?
          </p>
          <textarea
            value={data.solution}
            onChange={(e) => update("solution", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="הצעת הפעולה שלך..."
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            מה הערך לממונה/ת?
          </p>
          <p className="text-xs text-gray-500 mb-2">
            מה הערך של זה מבחינת המנהל/ת?
          </p>
          <textarea
            value={data.managerGain}
            onChange={(e) => update("managerGain", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            הבקשה הקונקרטית שלי
          </p>
          <p className="text-xs text-gray-500 mb-2">
            מה בדיוק אני מבקש/ת?
          </p>
          <textarea
            value={data.concreteRequest}
            onChange={(e) => update("concreteRequest", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep(1)}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            → חזרה
          </button>
          <button
            onClick={() => setStep(3)}
            className="py-2.5 px-6 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors"
          >
            המשך ←
          </button>
        </div>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            משפט הפתיחה
          </p>
          <p className="text-xs text-gray-500 mb-2">
            כיצד תפתח/י את השיחה?
          </p>
          <textarea
            value={data.openingSentence}
            onChange={(e) => update("openingSentence", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י את משפט הפתיחה שלך..."
          />
        </div>

        {/* Influence checklist */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              מדד השפעה
            </p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${checkColor}`}>
              {checkCount}/5
            </span>
          </div>

          <div className="space-y-2">
            {checklistItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() =>
                  update(item.key, !data[item.key] as boolean)
                }
                className={`flex items-center gap-3 w-full text-right px-3 py-2.5 rounded-xl border transition-colors ${
                  data[item.key]
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    data[item.key]
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-gray-300"
                  }`}
                >
                  {data[item.key] && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth={3}
                      className="w-2.5 h-2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>

          {checkCount >= 4 && (
            <p className="mt-3 text-xs text-emerald-700 font-medium text-center">
              הצעת ההשפעה שלך מאוזנת ומוכנה ✓
            </p>
          )}
          {checkCount < 4 && checkCount >= 2 && (
            <p className="mt-3 text-xs text-amber-700 font-medium text-center">
              כדאי להשלים עוד נקודות לפני הגשה
            </p>
          )}
          {checkCount < 2 && (
            <p className="mt-3 text-xs text-red-600 font-medium text-center">
              כדאי לחזור ולהשלים את הסעיפים החסרים
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep(2)}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            → חזרה
          </button>
          <button
            onClick={onComplete}
            className="py-2.5 px-6 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors"
          >
            שמור/י כ&apos;הצעת השפעה&apos; בתיק ←
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">
          מסלול השפעה: מתלונה להצעה
        </h2>
        {saved && <span className="text-xs text-emerald-600">נשמר אוטומטית ✓</span>}
      </div>

      <ToolStepper steps={STEPS_LABELS} current={step} accent="emerald" />

      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </Card>
  );
}
