"use client";

import { useState } from "react";
import { useToolData } from "@/features/assignments/useToolData";
import ToolStepper from "@/features/assignments/ToolStepper";
import Card from "@/components/ui/Card";

interface RehearsalData {
  conversationType: "feedback" | "difficult" | "unsure";
  openingSentence: string;
  lensEmployee: string;
  lensManager: string;
  lensRelationship: string;
  checklistConcrete: boolean;
  checklistNoGeneralizations: boolean;
  checklistBehavior: boolean;
  checklistOpenQuestion: boolean;
  checklistRoomForResponse: boolean;
  improvedVersion: string;
}

const DEFAULT: RehearsalData = {
  conversationType: "unsure",
  openingSentence: "",
  lensEmployee: "",
  lensManager: "",
  lensRelationship: "",
  checklistConcrete: false,
  checklistNoGeneralizations: false,
  checklistBehavior: false,
  checklistOpenQuestion: false,
  checklistRoomForResponse: false,
  improvedVersion: "",
};

const STEPS_LABELS = ["סוג שיחה", "המשפט שלי", "3 עדשות", "הגרסה המשופרת"];

const textareaClass =
  "w-full rounded-xl border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400";

interface ToolProps {
  assignmentId: string;
  onComplete: () => void;
}

export default function ConversationBuilderTool({
  assignmentId,
  onComplete,
}: ToolProps) {
  const { data, update, saved } = useToolData<RehearsalData>(
    assignmentId,
    DEFAULT
  );
  const [step, setStep] = useState(0);

  const checklistItems: {
    key: keyof RehearsalData;
    label: string;
  }[] = [
    { key: "checklistConcrete", label: "המשפט כולל דוגמה קונקרטית" },
    {
      key: "checklistNoGeneralizations",
      label: 'נמנע מהכללות ("תמיד", "אף פעם")',
    },
    { key: "checklistBehavior", label: "מתאר התנהגות, לא אופי" },
    { key: "checklistOpenQuestion", label: "יש בו שאלה פתוחה" },
    { key: "checklistRoomForResponse", label: "משאיר מקום לתגובה" },
  ];

  const checklistCount = checklistItems.filter(
    (item) => data[item.key] as boolean
  ).length;

  function renderStep0() {
    const types: {
      key: "feedback" | "difficult" | "unsure";
      label: string;
      desc: string;
    }[] = [
      {
        key: "feedback",
        label: "שיחת משוב",
        desc: "להעביר משוב בונה על התנהגות ספציפית",
      },
      {
        key: "difficult",
        label: "שיחה קשה",
        desc: "לטפל בנושא מורכב שנמנעת ממנו",
      },
      {
        key: "unsure",
        label: "עדיין לא בטוח/ה",
        desc: "אבחר את הסוג לפי מה שמרגיש נכון",
      },
    ];

    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-violet-50 rounded-xl px-3 py-2">
          לפני השיחה האמיתית, בוא ננסה את המשפט בחדר חזרות.
        </p>

        <div className="space-y-3">
          {types.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => update("conversationType", t.key)}
              className={`w-full text-right p-4 rounded-2xl border-2 transition-all ${
                data.conversationType === t.key
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-indigo-200"
              }`}
            >
              <p className="font-bold text-gray-900 text-sm">{t.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => setStep(1)}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          המשך ←
        </button>
      </div>
    );
  }

  function renderStep1() {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            המשפט שאתה/ת מתכנן/ת לומר
          </p>
          <textarea
            value={data.openingSentence}
            onChange={(e) => update("openingSentence", e.target.value)}
            rows={5}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י את המשפט או הפתיחה שאתה/ת מתכנן/ת לומר..."
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
        <p className="text-xs text-gray-500 bg-indigo-50 rounded-xl px-3 py-2">
          כל עדשה עוזרת לך לראות את המשפט מנקודת מבט שונה.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-gray-800 mb-1">👂 עדשת העובד/ת</p>
            <p className="text-xs text-gray-400 mb-2">
              איך זה עלול להישמע לצד השני?
            </p>
            <textarea
              value={data.lensEmployee}
              onChange={(e) => update("lensEmployee", e.target.value)}
              rows={3}
              dir="rtl"
              className={textareaClass}
              placeholder="כתוב/י כאן..."
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-gray-800 mb-1">🎯 עדשת המנהל/ת</p>
            <p className="text-xs text-gray-400 mb-2">האם זה ברור וישיר?</p>
            <textarea
              value={data.lensManager}
              onChange={(e) => update("lensManager", e.target.value)}
              rows={3}
              dir="rtl"
              className={textareaClass}
              placeholder="כתוב/י כאן..."
            />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-gray-800 mb-1">🤝 עדשת היחסים</p>
            <p className="text-xs text-gray-400 mb-2">
              האם זה משאיר מקום לדיאלוג?
            </p>
            <textarea
              value={data.lensRelationship}
              onChange={(e) => update("lensRelationship", e.target.value)}
              rows={3}
              dir="rtl"
              className={textareaClass}
              placeholder="כתוב/י כאן..."
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              בדיקת עצמי
            </p>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                checklistCount === 5
                  ? "bg-emerald-100 text-emerald-700"
                  : checklistCount >= 3
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {checklistCount}/5 בדיקות עברו
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
            className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
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
            הגרסה המשופרת
          </p>
          <p className="text-xs text-gray-500 mb-3">
            על בסיס מה שלמדת מהעדשות והבדיקות, כתוב/י את הגרסה המשופרת של המשפט.
          </p>
          <textarea
            value={data.improvedVersion}
            onChange={(e) => update("improvedVersion", e.target.value)}
            rows={5}
            dir="rtl"
            className={textareaClass}
            placeholder="הגרסה המשופרת..."
          />
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
            className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            שמור/י כ&apos;תסריט שיחה&apos; בתיק ←
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">חדר חזרות לשיחה</h2>
        {saved && <span className="text-xs text-emerald-600">נשמר אוטומטית ✓</span>}
      </div>

      <ToolStepper steps={STEPS_LABELS} current={step} accent="indigo" />

      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </Card>
  );
}
