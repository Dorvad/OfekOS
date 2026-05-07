"use client";

import { useToolData } from "@/features/assignments/useToolData";
import ToolStepper from "@/features/assignments/ToolStepper";
import Card from "@/components/ui/Card";

/* ── Types ── */
interface ChangeData {
  step: number;
  audienceType: "employee" | "team" | "interface" | "other" | "";
  audienceDescription: string;
  changeDescription: string;
  changeImpact: string;
  changeStage: "denial" | "resistance" | "learning" | "acceptance" | "";
  resistanceTypes: string[];
  fearsToLose: string;
  missingInfo: string;
  hardAction: string;
  containmentQuestion: string;
  whatToValidate: string;
  whatCantChange: string;
  whatCanChange: string;
  nextStep: string;
  supportIllGive: string;
  checkProgress: string;
  conversationDone: boolean;
  response: string;
  reflection: string;
  selfCheck: string;
}

/* ── Constants ── */
const DEFAULT: ChangeData = {
  step: 0,
  audienceType: "",
  audienceDescription: "",
  changeDescription: "",
  changeImpact: "",
  changeStage: "",
  resistanceTypes: [],
  fearsToLose: "",
  missingInfo: "",
  hardAction: "",
  containmentQuestion: "",
  whatToValidate: "",
  whatCantChange: "",
  whatCanChange: "",
  nextStep: "",
  supportIllGive: "",
  checkProgress: "",
  conversationDone: false,
  response: "",
  reflection: "",
  selfCheck: "",
};

const STEPS_LABELS = ["מצב השינוי", "אבחון", "תכנון השיחה", "ביצוע ורפלקציה"];

interface AudienceChip {
  key: "employee" | "team" | "interface" | "other";
  label: string;
}

const AUDIENCE_CHIPS: AudienceChip[] = [
  { key: "employee", label: "עובד/ת ספציפי/ת" },
  { key: "team",     label: "הצוות כולו" },
  { key: "interface", label: "קבוצת ממשק" },
  { key: "other",    label: "אחר" },
];

interface StageDef {
  key: "denial" | "resistance" | "learning" | "acceptance";
  label: string;
  icon: string;
  desc: string;
}

const STAGES: StageDef[] = [
  {
    key: "denial",
    label: "הכחשה",
    icon: "🙈",
    desc: "מתעלם/ת, ממשיך/ה כרגיל, 'זה לא יקרה'",
  },
  {
    key: "resistance",
    label: "התנגדות",
    icon: "😤",
    desc: "מתנגד/ת גלוי/ה, ציני/ת, טוען/ת שזה שגוי",
  },
  {
    key: "learning",
    label: "למידה",
    icon: "🤔",
    desc: "מתחיל/ה לשאול שאלות, מנסה להבין, לא בטוח/ה",
  },
  {
    key: "acceptance",
    label: "קבלה",
    icon: "✅",
    desc: "לוקח/ת אחריות, מסתגל/ת, מוביל/ת",
  },
];

const RESISTANCE_TYPE_CHIPS = ["רגשית", "רציונלית", "התנהגותית"];

/* ── Shared style strings ── */
const TA =
  "w-full p-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400";
const TA_TEAL =
  "w-full p-3 rounded-xl border border-teal-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400";
const TA_AMBER =
  "w-full p-3 rounded-xl border border-amber-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400";
const TA_INDIGO =
  "w-full p-3 rounded-xl border border-indigo-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400";
const INPUT_INDIGO =
  "w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

/* ── Props ── */
interface ToolProps {
  assignmentId: string;
  onComplete: () => void;
}

/* ── Checkbox component ── */
function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded-xl border-2 transition-colors ${
        checked ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-white"
      }`}
    >
      <div
        className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-colors ${
          checked ? "border-emerald-500 bg-emerald-500" : "border-gray-300 bg-white"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3 h-3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </button>
  );
}

export default function ChangeLeadershipTool({ assignmentId, onComplete }: ToolProps) {
  const { data, update, saved } = useToolData<ChangeData>(assignmentId, DEFAULT);

  const step = data.step;

  function goTo(s: number) {
    update("step", s);
  }

  function toggleResistanceType(chip: string) {
    const arr = data.resistanceTypes;
    update(
      "resistanceTypes",
      arr.includes(chip) ? arr.filter((c) => c !== chip) : [...arr, chip]
    );
  }

  /* ────────────── STEP 0: מצב השינוי ────────────── */
  function renderStep0() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-indigo-50 rounded-xl px-3 py-2">
          בחר/י עובד/ת או קבוצה שמושפעת משינוי שאתה/ת מוביל/ה
        </p>

        {/* Audience type chips */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            מי מושפע מהשינוי?
          </label>
          <div className="flex flex-wrap gap-2">
            {AUDIENCE_CHIPS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  update("audienceType", data.audienceType === key ? "" : key)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-colors ${
                  data.audienceType === key
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Audience description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            תאר/י את האדם / הקבוצה
          </label>
          <p className="text-xs text-gray-400 mb-1.5">השתמש/י בראשי תיבות</p>
          <input
            type="text"
            value={data.audienceDescription}
            onChange={(e) => update("audienceDescription", e.target.value)}
            dir="rtl"
            placeholder="לדוגמה: א.כ., מוביל צוות פיתוח..."
            className={INPUT_INDIGO}
          />
        </div>

        {/* Change description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            מה השינוי?
          </label>
          <textarea
            value={data.changeDescription}
            onChange={(e) => update("changeDescription", e.target.value)}
            rows={3}
            dir="rtl"
            className={TA}
            placeholder="תאר/י בקצרה את השינוי שמתרחש"
          />
        </div>

        {/* Change impact */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            איך השינוי משפיע עליהם בפועל?
          </label>
          <textarea
            value={data.changeImpact}
            onChange={(e) => update("changeImpact", e.target.value)}
            rows={3}
            dir="rtl"
            className={TA}
            placeholder="מה משתנה עבורם ביום-יום?"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => goTo(1)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            המשך ←
          </button>
        </div>
      </div>
    );
  }

  /* ────────────── STEP 1: אבחון ────────────── */
  function renderStep1() {
    return (
      <div className="space-y-5">
        <p className="text-xs text-gray-500 bg-indigo-50 rounded-xl px-3 py-2">
          אבחן/י את שלב השינוי וסוג ההתנגדות
        </p>

        {/* Section A: שלב השינוי */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-2">שלב השינוי</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STAGES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() =>
                  update("changeStage", data.changeStage === s.key ? "" : s.key)
                }
                className={`text-right p-3 rounded-xl border-2 transition-all ${
                  data.changeStage === s.key
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 bg-white hover:border-indigo-200"
                }`}
              >
                <p className="font-bold text-sm text-gray-900">
                  {s.icon} {s.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Section B: סוג ההתנגדות */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-2">סוג ההתנגדות</h3>
          <div className="flex flex-wrap gap-2">
            {RESISTANCE_TYPE_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => toggleResistanceType(chip)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-colors ${
                  data.resistanceTypes.includes(chip)
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Section C: אבחון עמוק */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-800">אבחון מעמיק</h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה הוא/היא חושש/ת לאבד?
            </label>
            <textarea
              value={data.fearsToLose}
              onChange={(e) => update("fearsToLose", e.target.value)}
              rows={2}
              dir="rtl"
              className={TA}
              placeholder="ביטחון תעסוקתי, מעמד, שגרה, שליטה..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              איזה מידע חסר לו/ה?
            </label>
            <textarea
              value={data.missingInfo}
              onChange={(e) => update("missingInfo", e.target.value)}
              rows={2}
              dir="rtl"
              className={TA}
              placeholder="כתוב/י כאן..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה קשה לו/ה לעשות בפועל?
            </label>
            <textarea
              value={data.hardAction}
              onChange={(e) => update("hardAction", e.target.value)}
              rows={2}
              dir="rtl"
              className={TA}
              placeholder="כתוב/י כאן..."
            />
          </div>
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
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            המשך ←
          </button>
        </div>
      </div>
    );
  }

  /* ────────────── STEP 2: תכנון השיחה ────────────── */
  function renderStep2() {
    return (
      <div className="space-y-5">
        <p className="text-xs text-gray-500 bg-indigo-50 rounded-xl px-3 py-2">
          תכנן/י שיחה לפי שלושה שלבים — אל תדלג/י על הכלה
        </p>

        {/* Section 1: הכלה */}
        <div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
              1
            </span>
            <h3 className="text-sm font-bold text-teal-800">שלב 1: הכלה 🫂</h3>
          </div>
          <p className="text-xs text-teal-700 bg-teal-100 rounded-lg px-2 py-1.5">
            💡 פתח/י בהכרה ברגשות לפני שמציגים תכנית
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              השאלה הפתוחה שלי להכלה
            </label>
            <textarea
              value={data.containmentQuestion}
              onChange={(e) => update("containmentQuestion", e.target.value)}
              rows={3}
              dir="rtl"
              className={TA_TEAL}
              placeholder="שאלה שמזמינה לשתף בלי שיפוט (לא 'למה?')"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה אוכל להבין ולקבל?
            </label>
            <textarea
              value={data.whatToValidate}
              onChange={(e) => update("whatToValidate", e.target.value)}
              rows={3}
              dir="rtl"
              className={TA_TEAL}
              placeholder="מה בהתנגדות שלהם מובן לי, גם אם אני לא מסכים/ה?"
            />
          </div>
        </div>

        {/* Section 2: הבדלה */}
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
              2
            </span>
            <h3 className="text-sm font-bold text-amber-800">שלב 2: הבדלה 🔀</h3>
          </div>
          <p className="text-xs text-amber-700 bg-amber-100 rounded-lg px-2 py-1.5">
            💡 הבדל בין מה שניתן לשינוי לבין מה שלא. היה/י ברור/ה.
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה לא ניתן לשינוי בשינוי הזה?
            </label>
            <textarea
              value={data.whatCantChange}
              onChange={(e) => update("whatCantChange", e.target.value)}
              rows={3}
              dir="rtl"
              className={TA_AMBER}
              placeholder="מה קבוע ולא ניתן למשא ומתן?"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה כן ניתן להשפיע עליו?
            </label>
            <textarea
              value={data.whatCanChange}
              onChange={(e) => update("whatCanChange", e.target.value)}
              rows={3}
              dir="rtl"
              className={TA_AMBER}
              placeholder="איפה יש להם מרחב בחירה או השפעה?"
            />
          </div>
        </div>

        {/* Section 3: פתרון */}
        <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
              3
            </span>
            <h3 className="text-sm font-bold text-indigo-800">שלב 3: פתרון 🗺</h3>
          </div>
          <p className="text-xs text-indigo-700 bg-indigo-100 rounded-lg px-2 py-1.5">
            💡 הצג/י צעד קטן ואפשרי — לא את כל התמונה
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              הצעד הבא האפשרי
            </label>
            <textarea
              value={data.nextStep}
              onChange={(e) => update("nextStep", e.target.value)}
              rows={3}
              dir="rtl"
              className={TA_INDIGO}
              placeholder="פעולה קטנה וקונקרטית שהם יכולים לעשות"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              איזו תמיכה אתן?
            </label>
            <textarea
              value={data.supportIllGive}
              onChange={(e) => update("supportIllGive", e.target.value)}
              rows={2}
              dir="rtl"
              className={TA_INDIGO}
              placeholder="כתוב/י כאן..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              איך נבדוק התקדמות?
            </label>
            <input
              type="text"
              value={data.checkProgress}
              onChange={(e) => update("checkProgress", e.target.value)}
              dir="rtl"
              placeholder="תאריך / תדירות / מדד..."
              className={INPUT_INDIGO}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => goTo(1)}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            → חזרה
          </button>
          <button
            onClick={() => goTo(3)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            המשך ←
          </button>
        </div>
      </div>
    );
  }

  /* ────────────── STEP 3: ביצוע ורפלקציה ────────────── */
  function renderStep3() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-indigo-50 rounded-xl px-3 py-2">
          לאחר שקיימת את השיחה, ענה/י על השאלות הבאות
        </p>

        {/* Conversation done checkbox */}
        <Checkbox
          checked={data.conversationDone}
          onChange={() => update("conversationDone", !data.conversationDone)}
          label="קיימתי את השיחה"
        />

        {/* Response */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            איך הגיבו?
          </label>
          <textarea
            value={data.response}
            onChange={(e) => update("response", e.target.value)}
            rows={3}
            dir="rtl"
            className={TA}
            placeholder="כתוב/י כאן..."
          />
        </div>

        {/* Reflection */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            מה עבד? מה הייתי עושה אחרת?
          </label>
          <textarea
            value={data.reflection}
            onChange={(e) => update("reflection", e.target.value)}
            rows={3}
            dir="rtl"
            className={TA}
            placeholder="כתוב/י כאן..."
          />
        </div>

        {/* Self-check */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            האם דילגתי לפתרון לפני שהכלתי? מה קרה?
          </label>
          <textarea
            value={data.selfCheck}
            onChange={(e) => update("selfCheck", e.target.value)}
            rows={3}
            dir="rtl"
            className={TA}
            placeholder="רפלקציה עצמית כנה — כתוב/י כאן..."
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => goTo(2)}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            → חזרה
          </button>
          <button
            onClick={onComplete}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            סיימתי ←
          </button>
        </div>
      </div>
    );
  }

  /* ────────────── ROOT RENDER ────────────── */
  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">תפקיד המנהל בשינוי</h2>
        {saved && <span className="text-xs text-emerald-600">נשמר ✓</span>}
      </div>

      <ToolStepper steps={STEPS_LABELS} current={step} accent="indigo" />

      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </Card>
  );
}
