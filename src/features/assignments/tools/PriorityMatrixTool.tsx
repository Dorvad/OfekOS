"use client";

import { useToolData } from "@/features/assignments/useToolData";
import ToolStepper from "@/features/assignments/ToolStepper";
import Card from "@/components/ui/Card";

/* ── Types ── */
interface PTask {
  id: string;
  name: string;
  category: string;
  quadrant: "ui" | "ni" | "un" | "nn" | "";
}

interface PDelegation {
  taskName: string;
  whom: string;
  desiredOutcome: string;
  checkIn: string;
}

interface PriorityData {
  step: number;
  tasks: PTask[];
  formName: string;
  formCategory: string;
  matrixConclusion: string;
  delegations: PDelegation[];
  timeManagementLesson: string;
  changeNextWeek: string;
}

/* ── Constants ── */
const DEFAULT: PriorityData = {
  step: 0,
  tasks: [],
  formName: "",
  formCategory: "",
  matrixConclusion: "",
  delegations: [],
  timeManagementLesson: "",
  changeNextWeek: "",
};

const STEPS_LABELS = ["משימות השבוע", "מטריצת דחוף-חשוב", "האצלה ורפלקציה"];

const CATEGORIES = [
  "ניהול שוטף",
  "פיתוח",
  "ממשקים",
  "צוות",
  "אדמיניסטרציה",
  "אחר",
];

interface QuadrantDef {
  key: "ui" | "ni" | "un" | "nn";
  label: string;
  short: string;
  bg: string;
  border: string;
  text: string;
  icon: string;
  action: string;
}

const QUADRANTS: QuadrantDef[] = [
  {
    key: "ui",
    label: "חשוב ודחוף",
    short: "ח+ד",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    icon: "🔥",
    action: "טפל עכשיו",
  },
  {
    key: "ni",
    label: "חשוב, לא דחוף",
    short: "ח+לא-ד",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    icon: "🌱",
    action: "תכנן",
  },
  {
    key: "un",
    label: "לא חשוב, דחוף",
    short: "לא-ח+ד",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    icon: "⚡",
    action: "האצל",
  },
  {
    key: "nn",
    label: "לא חשוב, לא דחוף",
    short: "לא-ח+לא-ד",
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-600",
    icon: "🗑",
    action: "שקול להסיר",
  },
];

function getId(): string {
  return Math.random().toString(36).slice(2, 9);
}

/* ── Shared style strings ── */
const TA =
  "w-full p-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400";
const INPUT =
  "w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

/* ── Props ── */
interface ToolProps {
  assignmentId: string;
  onComplete: () => void;
}

export default function PriorityMatrixTool({ assignmentId, onComplete }: ToolProps) {
  const { data, update, updateMany, saved } = useToolData<PriorityData>(assignmentId, DEFAULT);

  const step = data.step;

  function goTo(s: number) {
    update("step", s);
  }

  /* ── Task helpers ── */
  function addTask() {
    if (!data.formName.trim()) return;
    const newTask: PTask = {
      id: getId(),
      name: data.formName.trim(),
      category: data.formCategory || "אחר",
      quadrant: "",
    };
    updateMany({
      tasks: [...data.tasks, newTask],
      formName: "",
      formCategory: "",
    });
  }

  function removeTask(id: string) {
    const removed = data.tasks.find((t) => t.id === id);
    const tasks = data.tasks.filter((t) => t.id !== id);
    const delegations = removed
      ? data.delegations.filter((d) => d.taskName !== removed.name)
      : data.delegations;
    updateMany({ tasks, delegations });
  }

  function setTaskQuadrant(id: string, q: PTask["quadrant"]) {
    const tasks = data.tasks.map((t) => (t.id === id ? { ...t, quadrant: q } : t));
    update("tasks", tasks);
  }

  /* ── Delegation helpers ── */
  function ensureDelegation(taskName: string): PDelegation {
    return (
      data.delegations.find((d) => d.taskName === taskName) ?? {
        taskName,
        whom: "",
        desiredOutcome: "",
        checkIn: "",
      }
    );
  }

  function updateDelegation(taskName: string, patch: Partial<PDelegation>) {
    const existing = data.delegations.find((d) => d.taskName === taskName);
    if (existing) {
      update(
        "delegations",
        data.delegations.map((d) => (d.taskName === taskName ? { ...d, ...patch } : d))
      );
    } else {
      update("delegations", [
        ...data.delegations,
        { taskName, whom: "", desiredOutcome: "", checkIn: "", ...patch },
      ]);
    }
  }

  /* ── Derived ── */
  const delegationCandidates = data.tasks.filter(
    (t) => t.quadrant === "un" || t.quadrant === "nn"
  );
  const hasAnyClassified = data.tasks.some((t) => t.quadrant !== "");

  /* ────────────── RENDER ────────────── */
  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">ניהול עצמי ועדיפויות</h2>
        {saved && <span className="text-xs text-emerald-600">נשמר ✓</span>}
      </div>

      <ToolStepper steps={STEPS_LABELS} current={step} accent="orange" />

      {/* ══ STEP 0: משימות השבוע ══ */}
      {step === 0 && (
        <div className="space-y-5">
          <p className="text-xs text-gray-500 bg-orange-50 rounded-xl px-3 py-2">
            הזן/י את המשימות שלך השבוע — לא חייב/ת הכל, רק את המשמעותיות
          </p>

          {/* Add task form */}
          <div className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-orange-800">הוספת משימה</h3>

            {/* Task name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                שם המשימה
              </label>
              <input
                type="text"
                value={data.formName}
                onChange={(e) => update("formName", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="שם המשימה..."
                dir="rtl"
                className="w-full px-3 py-2 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Category chips */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">קטגוריה</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      update("formCategory", data.formCategory === cat ? "" : cat)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      data.formCategory === cat
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addTask}
              disabled={!data.formName.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-semibold py-2 rounded-xl text-sm transition-colors"
            >
              הוסף ←
            </button>
          </div>

          {/* Task list */}
          {data.tasks.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                משימות ({data.tasks.length})
              </p>
              {data.tasks.map((task) => {
                const qInfo = QUADRANTS.find((q) => q.key === task.quadrant);
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white"
                  >
                    {/* Task name */}
                    <span className="flex-1 text-sm font-medium text-gray-800 text-right">
                      {task.name}
                    </span>

                    {/* Category chip */}
                    <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700 font-medium shrink-0">
                      {task.category}
                    </span>

                    {/* Quadrant selector — 4 mini chips */}
                    <div className="flex gap-1 shrink-0 flex-wrap">
                      {QUADRANTS.map((q) => (
                        <button
                          key={q.key}
                          type="button"
                          onClick={() =>
                            setTaskQuadrant(task.id, task.quadrant === q.key ? "" : q.key)
                          }
                          title={`${q.label} — ${q.action}`}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border transition-colors ${
                            task.quadrant === q.key
                              ? `${q.bg} ${q.text} border-current`
                              : "bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {q.short}
                        </button>
                      ))}
                    </div>

                    {/* Current quadrant icon */}
                    {qInfo && (
                      <span className={`text-xs ${qInfo.text} font-medium shrink-0`}>
                        {qInfo.icon}
                      </span>
                    )}

                    {/* Remove */}
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-sm shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tip */}
          <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
            💡 חשוב = תורם ליעדים. דחוף = יש דדליין קרוב.
          </p>

          <div className="flex justify-end">
            <button
              onClick={() => goTo(1)}
              disabled={data.tasks.length === 0}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              המשך ←
            </button>
          </div>
        </div>
      )}

      {/* ══ STEP 1: מטריצת דחוף-חשוב ══ */}
      {step === 1 && (
        <div className="space-y-5">
          <p className="text-xs text-gray-500 bg-orange-50 rounded-xl px-3 py-2">
            כך נראה חלוקת המשימות שלך — מה זה אומר עליך?
          </p>

          {!hasAnyClassified ? (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-center text-sm text-orange-700">
              חזור/י לשלב הקודם ובחר/י רבע לכל משימה
            </div>
          ) : (
            /* 2×2 grid
               RTL layout — grid-cols-2 renders right-to-left in RTL context.
               We want:
                 top-right = ui (חשוב ודחוף)    top-left = ni (חשוב, לא דחוף)
                 bottom-right = un (לא חשוב, דחוף) bottom-left = nn (לא חשוב, לא דחוף)
               In RTL the first column is on the right, so order: ui, ni, un, nn */
            <div>
              {/* Axis labels */}
              <div className="flex justify-between text-[10px] text-gray-400 font-medium mb-1 px-1">
                <span>← לא דחוף</span>
                <span>דחוף →</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {QUADRANTS.map((q) => {
                  const tasksInQ = data.tasks.filter((t) => t.quadrant === q.key);
                  return (
                    <div
                      key={q.key}
                      className={`rounded-xl border-2 p-3 min-h-[110px] ${q.bg} ${q.border}`}
                    >
                      <p className={`text-xs font-bold mb-0.5 ${q.text}`}>
                        {q.icon} {q.label}
                      </p>
                      <p className="text-[10px] text-gray-500 mb-2">{q.action}</p>
                      <div className="flex flex-wrap gap-1">
                        {tasksInQ.length === 0 && (
                          <span className="text-[10px] text-gray-400 italic">אין משימות</span>
                        )}
                        {tasksInQ.map((t) => (
                          <span
                            key={t.id}
                            className="inline-block text-xs bg-white/80 rounded-full px-2 py-0.5 font-medium text-gray-700"
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matrix conclusion */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              מה המסקנה?
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              מה הדפוס שאתה/ת רואה? על מה אתה/ת מוציא/ה את הזמן שלך?
            </p>
            <textarea
              value={data.matrixConclusion}
              onChange={(e) => update("matrixConclusion", e.target.value)}
              rows={3}
              dir="rtl"
              className={TA}
              placeholder="כתוב/י כאן..."
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
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              המשך ←
            </button>
          </div>
        </div>
      )}

      {/* ══ STEP 2: האצלה ורפלקציה ══ */}
      {step === 2 && (
        <div className="space-y-5">
          <p className="text-xs text-gray-500 bg-orange-50 rounded-xl px-3 py-2">
            זהה/י מה ניתן להאציל ולמי
          </p>

          {delegationCandidates.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-600">
                מועמדות להאצלה ({delegationCandidates.length})
              </p>
              {delegationCandidates.map((task) => {
                const del = ensureDelegation(task.name);
                const qInfo = QUADRANTS.find((q) => q.key === task.quadrant);
                return (
                  <div
                    key={task.id}
                    className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-800">{task.name}</span>
                      {qInfo && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${qInfo.bg} ${qInfo.text} border ${qInfo.border}`}
                        >
                          {qInfo.label}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        למי להאציל?
                      </label>
                      <input
                        type="text"
                        value={del.whom}
                        onChange={(e) => updateDelegation(task.name, { whom: e.target.value })}
                        dir="rtl"
                        placeholder="שם או תפקיד..."
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        מה התוצאה הרצויה?
                      </label>
                      <textarea
                        value={del.desiredOutcome}
                        onChange={(e) =>
                          updateDelegation(task.name, { desiredOutcome: e.target.value })
                        }
                        rows={2}
                        dir="rtl"
                        placeholder="מה בדיוק אני מבקש/ת שיעשה/תעשה?"
                        className={TA}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        מתי לבדוק התקדמות?
                      </label>
                      <input
                        type="text"
                        value={del.checkIn}
                        onChange={(e) =>
                          updateDelegation(task.name, { checkIn: e.target.value })
                        }
                        dir="rtl"
                        placeholder="תאריך / תדירות..."
                        className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* No delegation candidates — encouraging message + free-form */
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
              <p className="text-sm text-gray-600">
                אין משימות ברובריקת &quot;לא חשוב / דחוף&quot; — מצוין! 🎉
              </p>
              <p className="text-xs text-gray-500">
                אם יש משהו שעדיין תרצה/י להאציל, תוכל/י לתכנן אותו כאן:
              </p>

              {(() => {
                const del = ensureDelegation("__free__");
                return (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        למי להאציל?
                      </label>
                      <input
                        type="text"
                        value={del.whom}
                        onChange={(e) =>
                          updateDelegation("__free__", { whom: e.target.value })
                        }
                        dir="rtl"
                        placeholder="שם או תפקיד..."
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        מה התוצאה הרצויה?
                      </label>
                      <textarea
                        value={del.desiredOutcome}
                        onChange={(e) =>
                          updateDelegation("__free__", { desiredOutcome: e.target.value })
                        }
                        rows={2}
                        dir="rtl"
                        placeholder="מה בדיוק אני מבקש/ת שיעשה/תעשה?"
                        className={TA}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        מתי לבדוק התקדמות?
                      </label>
                      <input
                        type="text"
                        value={del.checkIn}
                        onChange={(e) =>
                          updateDelegation("__free__", { checkIn: e.target.value })
                        }
                        dir="rtl"
                        placeholder="תאריך / תדירות..."
                        className={INPUT}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Reflection */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">רפלקציה</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                מה למדתי על ניהול הזמן שלי?
              </label>
              <textarea
                value={data.timeManagementLesson}
                onChange={(e) => update("timeManagementLesson", e.target.value)}
                rows={3}
                dir="rtl"
                className={TA}
                placeholder="כתוב/י כאן..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                מה אשנה בשבוע הבא?
              </label>
              <textarea
                value={data.changeNextWeek}
                onChange={(e) => update("changeNextWeek", e.target.value)}
                rows={3}
                dir="rtl"
                className={TA}
                placeholder="כתוב/י כאן..."
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
              onClick={onComplete}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              סיימתי ←
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
