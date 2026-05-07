"use client";

import { useState } from "react";
import { useToolData } from "@/features/assignments/useToolData";
import ToolStepper from "@/features/assignments/ToolStepper";
import Card from "@/components/ui/Card";

interface PrivacyFlags {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
  center: boolean;
  nextStep: boolean;
}

interface CompassData {
  north: string;
  south: string;
  east: string;
  west: string;
  center: string;
  nextStep: string;
  privacy: PrivacyFlags;
}

const DEFAULT: CompassData = {
  north: "",
  south: "",
  east: "",
  west: "",
  center: "",
  nextStep: "",
  privacy: {
    north: false,
    south: false,
    east: false,
    west: false,
    center: false,
    nextStep: false,
  },
};

const STEPS_LABELS = ["5 כיווני המצפן", "הצעד הבא", "כרטיס המצפן"];

const DIRECTIONS = [
  {
    key: "north" as const,
    label: "צפון",
    icon: "🔺",
    question: "לאן אני רוצה להגיע בתפקיד שלי?",
    privacyLabel: "צפון (לאן אני רוצה להגיע)",
  },
  {
    key: "south" as const,
    label: "דרום",
    icon: "🔻",
    question: "מה מושך אותי אחורה או מעכב אותי?",
    privacyLabel: "דרום (מה מעכב אותי)",
  },
  {
    key: "east" as const,
    label: "מזרח",
    icon: "◀️",
    question: "מה כבר מתחיל לזוז בכיוון הנכון?",
    privacyLabel: "מזרח (מה כבר זז)",
  },
  {
    key: "west" as const,
    label: "מערב",
    icon: "▶️",
    question: "מה אני צריך/ה לשחרר?",
    privacyLabel: "מערב (מה לשחרר)",
  },
  {
    key: "center" as const,
    label: "מרכז",
    icon: "⭕",
    question: "איזה Impact אני רוצה לייצר ביחידה השנה?",
    privacyLabel: "מרכז (ה-Impact שלי)",
  },
];

interface ToolProps {
  assignmentId: string;
  onComplete: () => void;
}

const textareaClass =
  "w-full rounded-xl border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400";

function PillToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
        checked ? "bg-indigo-500" : "bg-gray-200"
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function NorthStarTool({ assignmentId, onComplete }: ToolProps) {
  const { data, update, saved } = useToolData<CompassData>(assignmentId, DEFAULT);
  const [step, setStep] = useState(0);

  function togglePrivacy(field: keyof PrivacyFlags) {
    update("privacy", { ...data.privacy, [field]: !data.privacy[field] });
  }

  function renderStep0() {
    const mainDirs = DIRECTIONS.filter((d) => d.key !== "center");
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-indigo-50 rounded-xl px-3 py-2">
          המצפן שלך לא צריך להיות מושלם. הוא צריך לעזור לך לזוז בכיוון הנכון.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mainDirs.map((dir) => (
            <div
              key={dir.key}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{dir.icon}</span>
                <span className="text-sm font-bold text-gray-800">{dir.label}</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{dir.question}</p>
              <textarea
                value={data[dir.key]}
                onChange={(e) => update(dir.key, e.target.value)}
                rows={3}
                dir="rtl"
                className={textareaClass}
                placeholder="כתוב/י כאן..."
              />
            </div>
          ))}
        </div>

        {/* Center — full width */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⭕</span>
            <span className="text-sm font-bold text-gray-800">מרכז</span>
          </div>
          <p className="text-xs text-gray-400 mb-2">
            איזה Impact אני רוצה לייצר ביחידה השנה?
          </p>
          <textarea
            value={data.center}
            onChange={(e) => update("center", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setStep(1)}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            המשך ←
          </button>
        </div>
      </div>
    );
  }

  function renderStep1() {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            הצעד הניהולי הבא שלי הוא…
          </p>
          <textarea
            value={data.nextStep}
            onChange={(e) => update("nextStep", e.target.value)}
            rows={4}
            dir="rtl"
            className={textareaClass}
            placeholder="פעולה קונקרטית אחת שאעשה בשבועיים הקרובים..."
          />
        </div>

        {/* Privacy toggles */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            הגדרת פרטיות
          </p>
          <p className="text-xs text-gray-400">
            התוכן שמסומן כ&apos;גלוי&apos; יוצג לפסיליטייטור. שאר התוכן ישאר פרטי.
          </p>
          <div className="space-y-2">
            {DIRECTIONS.map((dir) => (
              <div
                key={dir.key}
                className="flex items-center justify-between gap-3 py-1"
              >
                <span className="text-sm text-gray-700">{dir.privacyLabel}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {data.privacy[dir.key] ? "גלוי" : "פרטי"}
                  </span>
                  <PillToggle
                    checked={data.privacy[dir.key]}
                    onChange={() => togglePrivacy(dir.key)}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 py-1">
              <span className="text-sm text-gray-700">הצעד הבא</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {data.privacy.nextStep ? "גלוי" : "פרטי"}
                </span>
                <PillToggle
                  checked={data.privacy.nextStep}
                  onChange={() => togglePrivacy("nextStep")}
                />
              </div>
            </div>
          </div>
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
            className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
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
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            כרטיס המצפן שלך
          </p>
          {DIRECTIONS.map((dir) => (
            <div key={dir.key} className="flex items-start gap-2">
              <span className="text-base mt-0.5">{dir.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500">{dir.label}</p>
                {data.privacy[dir.key] ? (
                  <p className="text-xs text-gray-400 italic">🔒 פרטי</p>
                ) : (
                  <p className="text-sm text-gray-800 break-words">
                    {data[dir.key] || <span className="italic text-gray-300">ריק</span>}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div className="border-t border-indigo-200 pt-3 flex items-start gap-2">
            <span className="text-base mt-0.5">👣</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500">הצעד הבא</p>
              {data.privacy.nextStep ? (
                <p className="text-xs text-gray-400 italic">🔒 פרטי</p>
              ) : (
                <p className="text-sm text-gray-800 break-words">
                  {data.nextStep || <span className="italic text-gray-300">ריק</span>}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep(1)}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            → חזרה
          </button>
          <button
            onClick={onComplete}
            className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            הוסף לתיק המנהל המתפתח ←
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">כיול מצפן ניהולי</h2>
        {saved && <span className="text-xs text-emerald-600">נשמר אוטומטית ✓</span>}
      </div>

      <ToolStepper steps={STEPS_LABELS} current={step} accent="indigo" />

      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
    </Card>
  );
}
