"use client";

import { useState } from "react";
import { useToolData } from "@/features/assignments/useToolData";
import ToolStepper from "@/features/assignments/ToolStepper";
import Card from "@/components/ui/Card";

interface ConvData {
  step: number;
  conversationType: "feedback" | "difficult" | "";
  goal: string;
  preserve: string;
  improve: string;
  example: string;
  expectedResistance: string[];
  emotions: string[];
  redLines: string;
  conversationDone: boolean;
  howIFelt: string;
  whatWorked: string;
  whatDifferently: string;
  dilemmaForNext: string;
}

const DEFAULT: ConvData = {
  step: 0,
  conversationType: "",
  goal: "",
  preserve: "",
  improve: "",
  example: "",
  expectedResistance: [],
  emotions: [],
  redLines: "",
  conversationDone: false,
  howIFelt: "",
  whatWorked: "",
  whatDifferently: "",
  dilemmaForNext: "",
};

const STEPS_LABELS = ["בחירת סוג שיחה", "הכנה לשיחה", "לאחר השיחה"];

const RESISTANCE_CHIPS = [
  "הכחשה",
  "תירוץ",
  "האשמת אחרים",
  "שתיקה",
  "כעס",
  "עלבון",
  "הסחת דעת",
  "זה לא הוגן",
];

const EMOTION_CHIPS = [
  "חרדה",
  "אכזבה",
  "תסכול",
  "כעס",
  "דאגה",
  "לחץ",
  "שחיקה",
  "תקווה",
];

// Router question state type
type RouterStep = "q1" | "q2" | "both";

interface ChipGroupProps {
  chips: string[];
  selected: string[];
  onToggle: (chip: string) => void;
}

function ChipGroup({ chips, selected, onToggle }: ChipGroupProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => {
        const isSelected = selected.includes(chip);
        return (
          <button
            key={chip}
            type="button"
            onClick={() => onToggle(chip)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              isSelected
                ? "bg-violet-500 text-white border-violet-500"
                : "bg-gray-100 text-gray-700 border-gray-100 hover:border-gray-300"
            }`}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}

interface ToolProps {
  assignmentId: string;
  onComplete: () => void;
}

export default function ConversationBuilderTool({ assignmentId, onComplete }: ToolProps) {
  const { data, update, updateMany, saved } = useToolData<ConvData>(assignmentId, DEFAULT);

  // Local router state (not persisted — only used while on step 0 "unsure" branch)
  const [routerStep, setRouterStep] = useState<RouterStep | null>(null);

  const step = data.step;

  function goTo(s: number) {
    update("step", s);
  }

  function toggleResistance(chip: string) {
    const arr = data.expectedResistance;
    update(
      "expectedResistance",
      arr.includes(chip) ? arr.filter((c) => c !== chip) : [...arr, chip]
    );
  }

  function toggleEmotion(chip: string) {
    const arr = data.emotions;
    update(
      "emotions",
      arr.includes(chip) ? arr.filter((c) => c !== chip) : [...arr, chip]
    );
  }

  function selectType(type: "feedback" | "difficult") {
    updateMany({ conversationType: type });
    setRouterStep(null);
  }

  const textareaClass =
    "w-full p-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400";

  // ── Step 0: בחירת סוג שיחה ────────────────────────────────────────────────

  function renderStep0() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-violet-50 rounded-xl px-3 py-2">
          בחר/י את סוג השיחה שתקיים
        </p>

        {/* Two main type cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => selectType("feedback")}
            className={`text-right p-4 rounded-xl border-2 transition-all ${
              data.conversationType === "feedback"
                ? "border-violet-500 bg-violet-50"
                : "border-gray-200 bg-white hover:border-violet-200"
            }`}
          >
            <p className="font-bold text-gray-900 text-sm mb-1">שיחת משוב</p>
            <p className="text-xs text-gray-500">
              להעביר משוב בונה לעובד/ת על התנהגות ספציפית
            </p>
          </button>

          <button
            type="button"
            onClick={() => selectType("difficult")}
            className={`text-right p-4 rounded-xl border-2 transition-all ${
              data.conversationType === "difficult"
                ? "border-violet-500 bg-violet-50"
                : "border-gray-200 bg-white hover:border-violet-200"
            }`}
          >
            <p className="font-bold text-gray-900 text-sm mb-1">שיחה קשה</p>
            <p className="text-xs text-gray-500">
              לטפל בנושא מורכב שנמנעת ממנו — ביצועים, קונפליקט, שינוי
            </p>
          </button>
        </div>

        {/* "Not sure" option */}
        {!data.conversationType && routerStep === null && (
          <button
            type="button"
            onClick={() => setRouterStep("q1")}
            className="w-full text-center text-sm text-gray-400 hover:text-violet-600 py-2 transition-colors"
          >
            עדיין לא בטוח/ה
          </button>
        )}

        {/* Router Q1 */}
        {routerStep === "q1" && (
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 space-y-3">
            <p className="text-sm font-medium text-violet-900">
              האם אתה/ת יודע/ת מה ההתנהגות הספציפית שאתה/ת רוצה לדבר עליה?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectType("feedback")}
                className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 rounded-xl text-sm transition-colors"
              >
                כן
              </button>
              <button
                type="button"
                onClick={() => setRouterStep("q2")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-xl text-sm transition-colors"
              >
                לא
              </button>
            </div>
          </div>
        )}

        {/* Router Q2 */}
        {routerStep === "q2" && (
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 space-y-3">
            <p className="text-sm font-medium text-violet-900">
              האם יש נושא שאתה/ת נמנע/ת ממנו כבר זמן מה?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectType("difficult")}
                className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 rounded-xl text-sm transition-colors"
              >
                כן
              </button>
              <button
                type="button"
                onClick={() => setRouterStep("both")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-xl text-sm transition-colors"
              >
                לא
              </button>
            </div>
          </div>
        )}

        {/* Both suitable */}
        {routerStep === "both" && (
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
            <p className="text-sm text-violet-800 font-medium mb-3">שתיהן מתאימות — בחר/י את זו שנראית לך יותר דחופה:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectType("feedback")}
                className="flex-1 bg-white border-2 border-violet-300 hover:border-violet-500 text-violet-700 font-semibold py-2 rounded-xl text-sm transition-colors"
              >
                שיחת משוב
              </button>
              <button
                type="button"
                onClick={() => selectType("difficult")}
                className="flex-1 bg-white border-2 border-violet-300 hover:border-violet-500 text-violet-700 font-semibold py-2 rounded-xl text-sm transition-colors"
              >
                שיחה קשה
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={() => goTo(1)}
            className="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            המשך ←
          </button>
        </div>
      </div>
    );
  }

  // ── Step 1: הכנה לשיחה ───────────────────────────────────────────────────

  function renderStep1() {
    const isFeedback = data.conversationType === "feedback";

    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-violet-50 rounded-xl px-3 py-2">
          {isFeedback
            ? "הכן/י את שיחת המשוב לפי מבנה ברור"
            : "הכן/י את עצמך לשיחה הקשה"}
        </p>

        {/* Goal */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            מה מטרת השיחה?
          </label>
          <p className="text-xs text-gray-400 mb-1.5">
            מה אני רוצה שיצא מהשיחה הזאת?
          </p>
          <textarea
            value={data.goal}
            onChange={(e) => update("goal", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        {/* Preserve — label differs by type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {isFeedback ? "מה חשוב לשמר?" : "מה חשוב לא לאבד מהיחסים?"}
          </label>
          <p className="text-xs text-gray-400 mb-1.5">
            {isFeedback
              ? "מה העובד/ת עושה טוב ואני רוצה לחזק?"
              : "מה אתה/ת רוצה לשמר בקשר הזה?"}
          </p>
          <textarea
            value={data.preserve}
            onChange={(e) => update("preserve", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        {/* Improve — only for feedback */}
        {isFeedback && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה דורש שיפור?
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              מה ההתנהגות הספציפית שאני רוצה לשנות?
            </p>
            <textarea
              value={data.improve}
              onChange={(e) => update("improve", e.target.value)}
              rows={3}
              dir="rtl"
              className={textareaClass}
              placeholder="כתוב/י כאן..."
            />
          </div>
        )}

        {/* Example */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            {isFeedback ? "דוגמה קונקרטית" : "דוגמה/עובדה קונקרטית"}
          </label>
          {isFeedback && (
            <p className="text-xs text-gray-400 mb-1.5">
              תאר/י מצב ספציפי (מתי, איפה, מה בדיוק קרה)
            </p>
          )}
          <textarea
            value={data.example}
            onChange={(e) => update("example", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        {/* Emotions — only for difficult */}
        {!isFeedback && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              רגשות שאני מביא/ה לשיחה
            </label>
            <ChipGroup
              chips={EMOTION_CHIPS}
              selected={data.emotions}
              onToggle={toggleEmotion}
            />
          </div>
        )}

        {/* Red lines — only for difficult */}
        {!isFeedback && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              קווים אדומים — מה חשוב לא לעשות
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              מה אני לא רוצה לעשות בשיחה הזאת?
            </p>
            <textarea
              value={data.redLines}
              onChange={(e) => update("redLines", e.target.value)}
              rows={3}
              dir="rtl"
              className={textareaClass}
              placeholder="כתוב/י כאן..."
            />
          </div>
        )}

        {/* Expected resistance */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            התנגדויות צפויות
          </label>
          <ChipGroup
            chips={RESISTANCE_CHIPS}
            selected={data.expectedResistance}
            onToggle={toggleResistance}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => goTo(0)}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            → חזרה
          </button>
          <button
            onClick={() => goTo(2)}
            className="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            המשך ←
          </button>
        </div>
      </div>
    );
  }

  // ── Step 2: לאחר השיחה ───────────────────────────────────────────────────

  function renderStep2() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-violet-50 rounded-xl px-3 py-2">
          לאחר שקיימת את השיחה, ענה/י על השאלות הבאות
        </p>

        {/* Conversation done toggle */}
        <button
          type="button"
          onClick={() => update("conversationDone", !data.conversationDone)}
          className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded-xl border-2 transition-colors ${
            data.conversationDone
              ? "border-emerald-400 bg-emerald-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-colors ${
              data.conversationDone
                ? "border-emerald-500 bg-emerald-500"
                : "border-gray-300 bg-white"
            }`}
          >
            {data.conversationDone && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={3}
                className="w-3 h-3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="text-sm font-medium text-gray-800">
            קיימתי את השיחה
          </span>
        </button>

        {/* How I felt */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            איך הרגשתי בשיחה?
          </label>
          <textarea
            value={data.howIFelt}
            onChange={(e) => update("howIFelt", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        {/* What worked */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            מה עבד טוב?
          </label>
          <textarea
            value={data.whatWorked}
            onChange={(e) => update("whatWorked", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        {/* What differently */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            מה הייתי עושה אחרת?
          </label>
          <textarea
            value={data.whatDifferently}
            onChange={(e) => update("whatDifferently", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        {/* Dilemma for next session */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            שאלה או דילמה למפגש הבא
          </label>
          <textarea
            value={data.dilemmaForNext}
            onChange={(e) => update("dilemmaForNext", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => goTo(1)}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            → חזרה
          </button>
          <button
            onClick={onComplete}
            className="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            סיימתי ←
          </button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">שיחת משוב או שיחה קשה</h2>
        {saved && <span className="text-xs text-emerald-600">נשמר ✓</span>}
      </div>

      <ToolStepper steps={STEPS_LABELS} current={step} accent="violet" />

      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
    </Card>
  );
}
