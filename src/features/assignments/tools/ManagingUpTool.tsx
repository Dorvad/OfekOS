"use client";

import Card from "@/components/ui/Card";
import ToolStepper from "@/features/assignments/ToolStepper";
import { useToolData } from "@/features/assignments/useToolData";

interface ManagingUpData {
  step: number;
  topic: string;
  whyImportant: string;
  consequences: string;
  stepsTaken: string;
  managerPerspective: string;
  triggers: string[];
  gainForManager: string;
  proposedSolution: string;
  concreteRequest: string;
  requestInOneSentence: string;
  conversationDone: boolean;
  response: string;
  whatWorked: string;
  whatDifferently: string;
}

const DEFAULT: ManagingUpData = {
  step: 0,
  topic: "",
  whyImportant: "",
  consequences: "",
  stepsTaken: "",
  managerPerspective: "",
  triggers: [],
  gainForManager: "",
  proposedSolution: "",
  concreteRequest: "",
  requestInOneSentence: "",
  conversationDone: false,
  response: "",
  whatWorked: "",
  whatDifferently: "",
};

const STEPS = ["הנושא", "נקודת המבט", "הצגת הפתרון", "ביצוע ורפלקציה"];

const TRIGGER_CHIPS = [
  "תקציב",
  "עומס ולחץ",
  "חשש מתקדים",
  "ממשקים עם גורמים אחרים",
  "ביקורת מרומזת על הנהלה",
  "בקשה למשאבים",
  "תזמון גרוע",
  "אחריותיות",
];

function CheckboxToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded-xl border-2 transition-colors ${
        checked
          ? "border-emerald-400 bg-emerald-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div
        className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-colors ${
          checked
            ? "border-emerald-500 bg-emerald-500"
            : "border-gray-300 bg-white"
        }`}
      >
        {checked && (
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
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </button>
  );
}

interface ToolProps {
  assignmentId: string;
  onComplete: () => void;
}

export default function ManagingUpTool({ assignmentId, onComplete }: ToolProps) {
  const { data, update, saved } = useToolData<ManagingUpData>(
    assignmentId,
    DEFAULT
  );

  const step = data.step;

  function goTo(s: number) {
    update("step", s);
  }

  function toggleTrigger(chip: string) {
    const next = data.triggers.includes(chip)
      ? data.triggers.filter((t) => t !== chip)
      : [...data.triggers, chip];
    update("triggers", next);
  }

  const textareaClass =
    "w-full p-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400";

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">
          הנעה והשפעה — ניהול כלפי מעלה
        </h2>
        {saved && <span className="text-xs text-emerald-600">נשמר ✓</span>}
      </div>

      <ToolStepper steps={STEPS} current={step} accent="emerald" />

      {/* ── STEP 0: הנושא ── */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 bg-emerald-50 rounded-xl px-3 py-2">
            בחר/י נושא שחשוב לך להציף מול הממונה שלך
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה הנושא שאני רוצה להעלות?
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              תאר/י בקצרה — נושא אחד, ממוקד
            </p>
            <textarea
              value={data.topic}
              onChange={(e) => update("topic", e.target.value)}
              rows={3}
              dir="rtl"
              placeholder="כתוב/י כאן..."
              className={textareaClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              למה הנושא חשוב לי?
            </label>
            <textarea
              value={data.whyImportant}
              onChange={(e) => update("whyImportant", e.target.value)}
              rows={3}
              dir="rtl"
              placeholder="כתוב/י כאן..."
              className={textareaClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה יקרה אם לא נטפל בו?
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              מה ההשלכות על הצוות / היחידה / האפקטיביות שלי?
            </p>
            <textarea
              value={data.consequences}
              onChange={(e) => update("consequences", e.target.value)}
              rows={3}
              dir="rtl"
              placeholder="כתוב/י כאן..."
              className={textareaClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              צעדים שכבר נקטתי
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              מה כבר ניסיתי לעשות בנושא זה?
            </p>
            <textarea
              value={data.stepsTaken}
              onChange={(e) => update("stepsTaken", e.target.value)}
              rows={3}
              dir="rtl"
              placeholder="כתוב/י כאן..."
              className={textareaClass}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => goTo(1)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              המשך ←
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 1: נקודת המבט של הממונה ── */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 bg-emerald-50 rounded-xl px-3 py-2">
            לפני שיחה, כדאי להבין מה חשוב לממונה שלך
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה חשוב לממונה שלי בנושא הזה?
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              מה הוא/היא ירצה/תרצה לשמוע? מה האינטרסים שלו/ה?
            </p>
            <textarea
              value={data.managerPerspective}
              onChange={(e) => update("managerPerspective", e.target.value)}
              rows={3}
              dir="rtl"
              placeholder="כתוב/י כאן..."
              className={textareaClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              טריגרים אפשריים שעלולים לסגור את השיחה
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TRIGGER_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleTrigger(chip)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    data.triggers.includes(chip)
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה הרווח עבור הממונה אם יאמץ את ההצעה שלי?
            </label>
            <textarea
              value={data.gainForManager}
              onChange={(e) => update("gainForManager", e.target.value)}
              rows={3}
              dir="rtl"
              placeholder="כתוב/י כאן..."
              className={textareaClass}
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
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              המשך ←
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: הצגת הפתרון ── */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 bg-emerald-50 rounded-xl px-3 py-2">
            הגע/י לשיחה עם פתרון — לא רק עם בעיה
          </p>

          {/* Tip card */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <span className="font-semibold">💡 טיפ:</span> ניסוח טוב מקשר את הפתרון שלך לאינטרסים של הממונה ומסתיים בבקשה קונקרטית
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              הפתרון שאני מציע/ה
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              מה הצעת הפעולה שלך? (לא רק הבעיה)
            </p>
            <textarea
              value={data.proposedSolution}
              onChange={(e) => update("proposedSolution", e.target.value)}
              rows={3}
              dir="rtl"
              placeholder="כתוב/י כאן..."
              className={textareaClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              הבקשה הקונקרטית שלי
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              מה אני מבקש/ת שיקרה? (מה בדיוק, עד מתי)
            </p>
            <textarea
              value={data.concreteRequest}
              onChange={(e) => update("concreteRequest", e.target.value)}
              rows={3}
              dir="rtl"
              placeholder="כתוב/י כאן..."
              className={textareaClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ניסוח בקשתי במשפט אחד
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              כתוב/י את הבקשה בצורה ברורה ותמציתית
            </p>
            <input
              type="text"
              value={data.requestInOneSentence}
              onChange={(e) => update("requestInOneSentence", e.target.value)}
              dir="rtl"
              placeholder="כתוב/י כאן..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
              onClick={() => goTo(3)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              המשך ←
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: ביצוע ורפלקציה ── */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 bg-emerald-50 rounded-xl px-3 py-2">
            לאחר שקיימת את השיחה
          </p>

          <CheckboxToggle
            checked={data.conversationDone}
            onChange={(v) => update("conversationDone", v)}
            label="קיימתי את השיחה עם הממונה"
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה היה התגובה?
            </label>
            <textarea
              value={data.response}
              onChange={(e) => update("response", e.target.value)}
              rows={3}
              dir="rtl"
              placeholder="כתוב/י כאן..."
              className={textareaClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה עבד טוב בשיחה?
            </label>
            <textarea
              value={data.whatWorked}
              onChange={(e) => update("whatWorked", e.target.value)}
              rows={3}
              dir="rtl"
              placeholder="כתוב/י כאן..."
              className={textareaClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה הייתי עושה אחרת?
            </label>
            <textarea
              value={data.whatDifferently}
              onChange={(e) => update("whatDifferently", e.target.value)}
              rows={3}
              dir="rtl"
              placeholder="כתוב/י כאן..."
              className={textareaClass}
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
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              סיימתי ←
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
