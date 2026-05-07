"use client";

import { useState } from "react";
import { useToolData } from "@/features/assignments/useToolData";
import ToolStepper from "@/features/assignments/ToolStepper";
import Card from "@/components/ui/Card";

interface WeekTask {
  id: string;
  text: string;
  urgent: boolean;
  important: boolean;
}

interface DisruptionItem {
  id: string;
  text: string;
  decision: "move" | "delegate" | "cancel" | "keep" | "";
}

interface WeekData {
  tasks: WeekTask[];
  activeDisruptions: string[];
  disruptions: DisruptionItem[];
  reflectionImportant: string;
  reflectionDisplaced: string;
  reflectionDelegation: string;
  formText: string;
  formUrgent: boolean;
  formImportant: boolean;
}

const DEFAULT: WeekData = {
  tasks: [],
  activeDisruptions: [],
  disruptions: [],
  reflectionImportant: "",
  reflectionDisplaced: "",
  reflectionDelegation: "",
  formText: "",
  formUrgent: false,
  formImportant: false,
};

const DISRUPTION_CARDS = [
  "ישיבה דחופה נכנסה ליומן לאמצע יום העבודה",
  "עובד/ת מבקש/ת עזרה מיידית בבעיה דחופה",
  "משימה שתוכננה לשעה התארכה לשלוש שעות",
  "בקשה לא צפויה מהממונה הדורשת מענה מהיר",
  "תקלה בממשק עם יחידה אחרת שעוצרת תהליך",
  "ישיבה חשובה שהוקדמה ביום",
];

const STEPS_LABELS = ["מה יש השבוע?", "קלפי בלת\"ם", "שיקוף"];

const textareaClass =
  "w-full rounded-xl border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400";

function getId(): string {
  return Math.random().toString(36).slice(2, 9);
}

interface ToolProps {
  assignmentId: string;
  onComplete: () => void;
}

export default function PriorityMatrixTool({ assignmentId, onComplete }: ToolProps) {
  const { data, update, updateMany, saved } = useToolData<WeekData>(
    assignmentId,
    DEFAULT
  );
  const [step, setStep] = useState(0);

  function addTask() {
    if (!data.formText.trim()) return;
    const task: WeekTask = {
      id: getId(),
      text: data.formText.trim(),
      urgent: data.formUrgent,
      important: data.formImportant,
    };
    updateMany({
      tasks: [...data.tasks, task],
      formText: "",
      formUrgent: false,
      formImportant: false,
    });
  }

  function removeTask(id: string) {
    update(
      "tasks",
      data.tasks.filter((t) => t.id !== id)
    );
  }

  function goToStep1() {
    // Generate disruptions only once
    if (data.activeDisruptions.length === 0) {
      const shuffled = [...DISRUPTION_CARDS]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const disruptionItems: DisruptionItem[] = shuffled.map((text) => ({
        id: getId(),
        text,
        decision: "",
      }));
      updateMany({
        activeDisruptions: shuffled,
        disruptions: disruptionItems,
      });
    }
    setStep(1);
  }

  function setDecision(
    id: string,
    decision: DisruptionItem["decision"]
  ) {
    update(
      "disruptions",
      data.disruptions.map((d) =>
        d.id === id ? { ...d, decision: d.decision === decision ? "" : decision } : d
      )
    );
  }

  const canProceedStep0 = data.tasks.length >= 3;
  const canProceedStep1 = data.disruptions.every((d) => d.decision !== "");

  // Mini matrix preview
  const urgent = data.tasks.filter((t) => t.urgent && t.important).length;
  const important = data.tasks.filter((t) => !t.urgent && t.important).length;
  const urgentOnly = data.tasks.filter((t) => t.urgent && !t.important).length;
  const neither = data.tasks.filter((t) => !t.urgent && !t.important).length;

  const decisionLabels: Record<string, string> = {
    move: "להזיז",
    delegate: "להאציל",
    cancel: "לבטל",
    keep: "לשמור בכל מחיר",
  };

  function renderStep0() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-orange-50 rounded-xl px-3 py-2">
          עכשיו נבדוק אם השבוע שלך שורד את המציאות.
        </p>

        {/* Add task form */}
        <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-4 space-y-3">
          <h3 className="text-sm font-bold text-orange-800">הוסף משימה</h3>
          <input
            type="text"
            value={data.formText}
            onChange={(e) => update("formText", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="שם המשימה..."
            dir="rtl"
            className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.formUrgent}
                onChange={(e) => update("formUrgent", e.target.checked)}
                className="w-4 h-4 accent-orange-500"
              />
              דחוף?
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.formImportant}
                onChange={(e) => update("formImportant", e.target.checked)}
                className="w-4 h-4 accent-orange-500"
              />
              חשוב?
            </label>
          </div>
          <button
            onClick={addTask}
            disabled={!data.formText.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-semibold py-2 rounded-xl text-sm transition-colors"
          >
            הוסף משימה ←
          </button>
        </div>

        {/* Task list */}
        {data.tasks.length > 0 && (
          <div className="space-y-2">
            {data.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 p-3 rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <span className="flex-1 text-sm text-gray-800 text-right">
                  {task.text}
                </span>
                <div className="flex gap-1 shrink-0">
                  {task.urgent && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                      דחוף
                    </span>
                  )}
                  {task.important && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                      חשוב
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors text-sm shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Mini matrix preview */}
        {data.tasks.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              תמונת שבוע
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-red-50 border border-red-200 rounded-xl p-2 text-center">
                <p className="font-bold text-red-700">{urgent}</p>
                <p className="text-gray-500">חשוב+דחוף</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center">
                <p className="font-bold text-emerald-700">{important}</p>
                <p className="text-gray-500">חשוב+לא דחוף</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 text-center">
                <p className="font-bold text-amber-700">{urgentOnly}</p>
                <p className="text-gray-500">דחוף+לא חשוב</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 text-center">
                <p className="font-bold text-gray-500">{neither}</p>
                <p className="text-gray-500">לא חשוב+לא דחוף</p>
              </div>
            </div>
          </div>
        )}

        {!canProceedStep0 && (
          <p className="text-xs text-gray-400 text-center">
            הוסף/י לפחות 3 משימות כדי להמשיך
          </p>
        )}

        <button
          onClick={goToStep1}
          disabled={!canProceedStep0}
          className="w-full py-3 rounded-xl bg-orange-500 disabled:opacity-40 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
        >
          המשך ←
        </button>
      </div>
    );
  }

  function renderStep1() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-orange-50 rounded-xl px-3 py-2">
          נכנסו 3 בלת&quot;מים לשבוע שלך. מה תעשה/י עם כל אחד?
        </p>

        <div className="space-y-4">
          {data.disruptions.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 shadow-sm"
            >
              <p className="font-semibold text-sm text-amber-900 mb-3">
                ⚡ {d.text}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["move", "delegate", "cancel", "keep"] as const).map(
                  (decision) => (
                    <button
                      key={decision}
                      type="button"
                      onClick={() => setDecision(d.id, decision)}
                      className={`py-2 rounded-xl text-xs font-semibold border-2 transition-colors ${
                        d.decision === decision
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-amber-300 text-amber-800 hover:border-orange-400"
                      }`}
                    >
                      {decisionLabels[decision]}
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {!canProceedStep1 && (
          <p className="text-xs text-gray-400 text-center">
            יש להחליט על כל 3 הבלת&quot;מים כדי להמשיך
          </p>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep(0)}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            → חזרה
          </button>
          <button
            onClick={() => setStep(2)}
            disabled={!canProceedStep1}
            className="py-2.5 px-6 rounded-xl bg-orange-500 disabled:opacity-40 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
          >
            המשך ←
          </button>
        </div>
      </div>
    );
  }

  function renderStep2() {
    const movedCount = data.disruptions.filter(
      (d) => d.decision !== "keep"
    ).length;
    const keptCount = data.disruptions.filter(
      (d) => d.decision === "keep"
    ).length;

    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 shadow-sm">
          <p className="text-xs font-semibold text-orange-700 mb-2">סיכום השבוע</p>
          <p className="text-sm text-gray-700">
            {keptCount} מ-3 הבלת&quot;מים שמרת — {movedCount} שינית.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            זמן למשימות חשובות ולא דחופות
          </p>
          <p className="text-xs text-gray-500 mb-2">
            כמה זמן נשאר למשימות חשובות ולא דחופות?
          </p>
          <textarea
            value={data.reflectionImportant}
            onChange={(e) => update("reflectionImportant", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            משימות שנדחקו
          </p>
          <p className="text-xs text-gray-500 mb-2">
            אילו משימות נדחקו בגלל דחוף ולא חשוב?
          </p>
          <textarea
            value={data.reflectionDisplaced}
            onChange={(e) => update("reflectionDisplaced", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            הזדמנות האצלה
          </p>
          <p className="text-xs text-gray-500 mb-2">
            איפה הייתה הזדמנות להאצלה?
          </p>
          <textarea
            value={data.reflectionDelegation}
            onChange={(e) => update("reflectionDelegation", e.target.value)}
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
            onClick={onComplete}
            className="py-2.5 px-6 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
          >
            שמור/י כ&apos;תוכנית שבועית&apos; בתיק ←
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">שבוע תחת עומס</h2>
        {saved && (
          <span className="text-xs text-emerald-600">נשמר אוטומטית ✓</span>
        )}
      </div>

      <ToolStepper steps={STEPS_LABELS} current={step} accent="orange" />

      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
    </Card>
  );
}
