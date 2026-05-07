"use client";

import Card from "@/components/ui/Card";
import ToolStepper from "@/features/assignments/ToolStepper";
import { useToolData } from "@/features/assignments/useToolData";

interface Member {
  id: string;
  initials: string;
  strength: string;
  challenge: string;
  informalRole: string;
  needs: string;
}

interface TeamMapData {
  step: number;
  members: Member[];
  formInitials: string;
  formStrength: string;
  formChallenge: string;
  formRole: string;
  formNeeds: string;
  quickWinAction: string;
  quickWinWhy: string;
  quickWinWho: string;
  quickWinSuccess: string;
  quickWinWhen: string;
  quickWinDone: boolean;
  surprisingDiscovery: string;
  whatIsNeededFromMe: string;
}

const DEFAULT: TeamMapData = {
  step: 0,
  members: [],
  formInitials: "",
  formStrength: "",
  formChallenge: "",
  formRole: "",
  formNeeds: "",
  quickWinAction: "",
  quickWinWhy: "",
  quickWinWho: "",
  quickWinSuccess: "",
  quickWinWhen: "",
  quickWinDone: false,
  surprisingDiscovery: "",
  whatIsNeededFromMe: "",
};

const STEPS = ["חברי הצוות", "Quick Win", "רפלקציה"];

const INFORMAL_ROLES = [
  "מניע",
  "מבקר",
  "מחבר חברתי",
  "מוציא לפועל",
  "בעל ידע",
  "מרגיע",
  "יזם",
  "מזהה סיכונים",
  "שומר מסורת",
];

const QUICK_WIN_INSPIRATIONS = [
  "פגישה אישית עם כל חבר צוות",
  "שיתוף הצוות בהחלטה",
  "הענקת אחריות חדשה לעובד",
  "שיחת פרגון גלויה",
  "פגישת צוות בגובה העיניים",
  "פתרון חסם שמפריע לצוות",
];

function getId() {
  return Math.random().toString(36).slice(2, 9);
}

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

export default function TeamMapTool({ assignmentId, onComplete }: ToolProps) {
  const { data, update, updateMany, saved } = useToolData<TeamMapData>(
    assignmentId,
    DEFAULT
  );

  const step = data.step;

  function goTo(s: number) {
    update("step", s);
  }

  function addMember() {
    if (!data.formInitials.trim()) return;
    const member: Member = {
      id: getId(),
      initials: data.formInitials.trim(),
      strength: data.formStrength.trim(),
      challenge: data.formChallenge.trim(),
      informalRole: data.formRole,
      needs: data.formNeeds.trim(),
    };
    updateMany({
      members: [...data.members, member],
      formInitials: "",
      formStrength: "",
      formChallenge: "",
      formRole: "",
      formNeeds: "",
    });
  }

  function removeMember(id: string) {
    update("members", data.members.filter((m) => m.id !== id));
  }

  const canProceedStep0 = data.members.length >= 2;
  const canProceedStep1 =
    data.quickWinAction.trim().length > 0 && data.quickWinWhen.trim().length > 0;

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400";
  const tealInputClass =
    "w-full rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400";
  const textareaClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400";

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">הובלת צוות אפקטיבי</h2>
        {saved && <span className="text-xs text-emerald-600">נשמר ✓</span>}
      </div>

      <ToolStepper steps={STEPS} current={step} accent="teal" />

      {/* ── STEP 0: חברי הצוות ── */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 bg-teal-50 rounded-xl px-3 py-2">
            הוסף/י את חברי הצוות שלך. השתמש/י בראשי תיבות אם מעדיף/ה.
          </p>

          {/* Add member form */}
          <div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-teal-800">הוסף חבר/ת צוות</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  ראשי תיבות / כינוי
                </label>
                <input
                  value={data.formInitials}
                  onChange={(e) => update("formInitials", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMember()}
                  placeholder="א.כ."
                  dir="rtl"
                  className={tealInputClass}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  חוזקה מרכזית
                </label>
                <input
                  value={data.formStrength}
                  onChange={(e) => update("formStrength", e.target.value)}
                  placeholder="יוזמה, אמינות, מקצועיות..."
                  dir="rtl"
                  className={tealInputClass}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 block mb-1">
                אתגר / צורך בפיתוח
              </label>
              <input
                value={data.formChallenge}
                onChange={(e) => update("formChallenge", e.target.value)}
                placeholder="ניהול עצמי, תקשורת..."
                dir="rtl"
                className={tealInputClass}
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 block mb-1">
                תפקיד לא פורמלי
              </label>
              <div className="flex flex-wrap gap-2">
                {INFORMAL_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() =>
                      update("formRole", data.formRole === role ? "" : role)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      data.formRole === role
                        ? "bg-teal-500 text-white border-teal-500"
                        : "border-teal-300 text-teal-700 bg-white hover:bg-teal-50"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 block mb-1">
                מה הוא/היא צריך/ה ממני?
              </label>
              <textarea
                value={data.formNeeds}
                onChange={(e) => update("formNeeds", e.target.value)}
                placeholder="כתוב/י כאן..."
                rows={2}
                dir="rtl"
                className="w-full rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <button
              onClick={addMember}
              disabled={!data.formInitials.trim()}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
            >
              הוסף ←
            </button>
          </div>

          {/* Member list */}
          {data.members.length > 0 && (
            <div className="space-y-2">
              {data.members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3"
                >
                  {/* Initials badge */}
                  <div className="shrink-0 w-9 h-9 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center">
                    {m.initials.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {m.informalRole && (
                        <span className="inline-block text-[10px] bg-teal-100 text-teal-700 rounded-full px-2 py-0.5 font-medium">
                          {m.informalRole}
                        </span>
                      )}
                      {m.strength && (
                        <span className="text-xs text-gray-500">
                          חוזקה: {m.strength}
                        </span>
                      )}
                    </div>
                    {m.challenge && (
                      <p className="text-xs text-gray-400">אתגר: {m.challenge}</p>
                    )}
                    {m.needs && (
                      <p className="text-xs text-gray-400 truncate">
                        צורך: {m.needs}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeMember(m.id)}
                    className="text-gray-300 hover:text-red-400 text-sm shrink-0 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {data.members.length < 2 && (
            <p className="text-xs text-gray-400 text-center">
              הוסף לפחות 2 חברי צוות להמשך
            </p>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => goTo(1)}
              disabled={!canProceedStep0}
              className="bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              המשך ←
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 1: Quick Win ── */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 bg-teal-50 rounded-xl px-3 py-2">
            בחר/י פעולה אחת שתחזק את הצוות בשבועיים הקרובים
          </p>

          {/* Inspiration chips */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              השראה — לחץ/י לבחירה:
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_WIN_INSPIRATIONS.map((ins) => (
                <button
                  key={ins}
                  type="button"
                  onClick={() => update("quickWinAction", ins)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    data.quickWinAction === ins
                      ? "bg-teal-500 text-white border-teal-500"
                      : "border-teal-300 text-teal-700 bg-white hover:bg-teal-50"
                  }`}
                >
                  {ins}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              מה הפעולה?
            </label>
            <textarea
              value={data.quickWinAction}
              onChange={(e) => update("quickWinAction", e.target.value)}
              placeholder="תאר/י את הפעולה..."
              rows={2}
              dir="rtl"
              className={textareaClass}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              למה דווקא היא?
            </label>
            <textarea
              value={data.quickWinWhy}
              onChange={(e) => update("quickWinWhy", e.target.value)}
              placeholder="כתוב/י כאן..."
              rows={2}
              dir="rtl"
              className={textareaClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                מי מעורב?
              </label>
              <input
                value={data.quickWinWho}
                onChange={(e) => update("quickWinWho", e.target.value)}
                placeholder="שמות / תפקידים"
                dir="rtl"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                איך אדע שהצליחה?
              </label>
              <input
                value={data.quickWinSuccess}
                onChange={(e) => update("quickWinSuccess", e.target.value)}
                placeholder="מדד הצלחה..."
                dir="rtl"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              מתי אבצע?
            </label>
            <input
              value={data.quickWinWhen}
              onChange={(e) => update("quickWinWhen", e.target.value)}
              placeholder="עד תאריך / ביום..."
              dir="rtl"
              className={inputClass}
            />
          </div>

          <CheckboxToggle
            checked={data.quickWinDone}
            onChange={(v) => update("quickWinDone", v)}
            label="ביצעתי את ה-Quick Win"
          />

          <div className="flex justify-between">
            <button
              onClick={() => goTo(0)}
              className="text-gray-500 hover:text-gray-700 font-medium text-sm px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              → חזרה
            </button>
            <button
              onClick={() => goTo(2)}
              disabled={!canProceedStep1}
              className="bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              המשך ←
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: רפלקציה ── */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 bg-teal-50 rounded-xl px-3 py-2">
            סכם/י את מה שלמדת על הצוות שלך
          </p>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              מה הגילוי הכי מפתיע מהמיפוי?
            </label>
            <textarea
              value={data.surprisingDiscovery}
              onChange={(e) => update("surprisingDiscovery", e.target.value)}
              placeholder="כתוב/י כאן..."
              rows={3}
              dir="rtl"
              className={textareaClass}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              מה נדרש ממני כמנהל/ת בשלב הזה?
            </label>
            <textarea
              value={data.whatIsNeededFromMe}
              onChange={(e) => update("whatIsNeededFromMe", e.target.value)}
              placeholder="כתוב/י כאן..."
              rows={3}
              dir="rtl"
              className={textareaClass}
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
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              סיימתי ←
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
