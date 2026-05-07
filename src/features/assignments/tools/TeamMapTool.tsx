"use client";

import { useState } from "react";
import { useToolData } from "@/features/assignments/useToolData";
import ToolStepper from "@/features/assignments/ToolStepper";
import Card from "@/components/ui/Card";

interface TeamMember {
  id: string;
  name: string;
  strength: string;
  contribution: string;
  challenge: string;
  informalRole: string;
  zone: "driving" | "need-clarity" | "quiet-significant" | "overwhelmed" | "can-grow" | "";
}

interface EnergyMapData {
  members: TeamMember[];
  unrealizedPotential: string;
  quickWin: string;
  formName: string;
  formStrength: string;
  formContribution: string;
  formChallenge: string;
  formInformalRole: string;
}

const DEFAULT: EnergyMapData = {
  members: [],
  unrealizedPotential: "",
  quickWin: "",
  formName: "",
  formStrength: "",
  formContribution: "",
  formChallenge: "",
  formInformalRole: "",
};

const STEPS_LABELS = ["חברי הצוות", "מיפוי אנרגיה", "שיקוף וצעד"];

const ZONES: {
  key: TeamMember["zone"];
  label: string;
  icon: string;
  color: string;
  bg: string;
}[] = [
  {
    key: "driving",
    label: "מניעים קדימה",
    icon: "🚀",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
  },
  {
    key: "need-clarity",
    label: "צריכים בהירות",
    icon: "💬",
    color: "text-blue-700",
    bg: "bg-blue-100",
  },
  {
    key: "quiet-significant",
    label: "שקטים אבל משמעותיים",
    icon: "🤫",
    color: "text-violet-700",
    bg: "bg-violet-100",
  },
  {
    key: "overwhelmed",
    label: "עמוסים מדי",
    icon: "😓",
    color: "text-red-700",
    bg: "bg-red-100",
  },
  {
    key: "can-grow",
    label: "יכולים לצמוח",
    icon: "🌱",
    color: "text-teal-700",
    bg: "bg-teal-100",
  },
];

function getId(): string {
  return Math.random().toString(36).slice(2, 9);
}

const textareaClass =
  "w-full rounded-xl border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400";

const inputClass =
  "w-full rounded-xl border border-teal-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400";

interface ToolProps {
  assignmentId: string;
  onComplete: () => void;
}

export default function TeamMapTool({ assignmentId, onComplete }: ToolProps) {
  const { data, update, updateMany, saved } = useToolData<EnergyMapData>(
    assignmentId,
    DEFAULT
  );
  const [step, setStep] = useState(0);

  function addMember() {
    if (!data.formName.trim()) return;
    const member: TeamMember = {
      id: getId(),
      name: data.formName.trim(),
      strength: data.formStrength.trim(),
      contribution: data.formContribution.trim(),
      challenge: data.formChallenge.trim(),
      informalRole: data.formInformalRole.trim(),
      zone: "",
    };
    updateMany({
      members: [...data.members, member],
      formName: "",
      formStrength: "",
      formContribution: "",
      formChallenge: "",
      formInformalRole: "",
    });
  }

  function removeMember(id: string) {
    update(
      "members",
      data.members.filter((m) => m.id !== id)
    );
  }

  function setZone(id: string, zone: TeamMember["zone"]) {
    update(
      "members",
      data.members.map((m) => (m.id === id ? { ...m, zone } : m))
    );
  }

  const canProceedStep0 = data.members.length >= 1;
  const canProceedStep1 = data.members.every((m) => m.zone !== "");

  function renderStep0() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-teal-50 rounded-xl px-3 py-2">
          לפעמים צוות לא צריך עוד משימה. הוא צריך שמישהו יראה את המערכת.
        </p>

        <div className="rounded-2xl border-2 border-teal-200 bg-teal-50 p-4 space-y-3">
          <h3 className="text-sm font-bold text-teal-800">הוסף/י חבר/ת צוות</h3>

          <div>
            <label className="text-xs text-gray-600 block mb-1">שם / כינוי</label>
            <input
              value={data.formName}
              onChange={(e) => update("formName", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMember()}
              placeholder="שם חבר/ת הצוות..."
              dir="rtl"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600 block mb-1">חוזקה מרכזית</label>
              <input
                value={data.formStrength}
                onChange={(e) => update("formStrength", e.target.value)}
                placeholder="מה הוא/היא עושה הכי טוב?"
                dir="rtl"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">תרומה לצוות</label>
              <input
                value={data.formContribution}
                onChange={(e) => update("formContribution", e.target.value)}
                placeholder="מה הערך הייחודי שלו/ה?"
                dir="rtl"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600 block mb-1">אתגר / צורך</label>
              <input
                value={data.formChallenge}
                onChange={(e) => update("formChallenge", e.target.value)}
                placeholder="מה מאתגר אותו/ה?"
                dir="rtl"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">תפקיד לא פורמלי</label>
              <input
                value={data.formInformalRole}
                onChange={(e) => update("formInformalRole", e.target.value)}
                placeholder="מחבר, מוביל, מבקר..."
                dir="rtl"
                className={inputClass}
              />
            </div>
          </div>

          <button
            onClick={addMember}
            disabled={!data.formName.trim()}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white font-semibold py-2 rounded-xl text-sm transition-colors"
          >
            הוסף/י לצוות ←
          </button>
        </div>

        {data.members.length > 0 && (
          <div className="space-y-2">
            {data.members.map((m) => (
              <div
                key={m.id}
                className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {m.name.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800">{m.name}</p>
                  {m.strength && (
                    <p className="text-xs text-gray-500">חוזקה: {m.strength}</p>
                  )}
                  {m.challenge && (
                    <p className="text-xs text-gray-400">אתגר: {m.challenge}</p>
                  )}
                </div>
                <button
                  onClick={() => removeMember(m.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors text-sm shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {!canProceedStep0 && (
          <p className="text-xs text-gray-400 text-center">
            הוסף/י לפחות חבר/ת צוות אחד/ת כדי להמשיך
          </p>
        )}

        <button
          onClick={() => setStep(1)}
          disabled={!canProceedStep0}
          className="w-full py-3 rounded-xl bg-teal-500 disabled:opacity-40 text-white font-semibold text-sm hover:bg-teal-600 transition-colors"
        >
          המשך ←
        </button>
      </div>
    );
  }

  function renderStep1() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-teal-50 rounded-xl px-3 py-2">
          לאיזה אזור אנרגיה כל אחד/ת משתייך/ת כרגע?
        </p>

        <div className="space-y-3">
          {data.members.map((m) => {
            const activeZone = ZONES.find((z) => z.key === m.zone);
            return (
              <div
                key={m.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {m.name.slice(0, 2)}
                  </div>
                  <p className="font-semibold text-sm text-gray-800">{m.name}</p>
                  {activeZone && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium mr-auto ${activeZone.bg} ${activeZone.color}`}
                    >
                      {activeZone.icon} {activeZone.label}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {ZONES.map((zone) => (
                    <button
                      key={zone.key}
                      type="button"
                      onClick={() =>
                        setZone(m.id, m.zone === zone.key ? "" : zone.key)
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-colors ${
                        m.zone === zone.key
                          ? `${zone.bg} ${zone.color} border-current`
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {zone.icon} {zone.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {!canProceedStep1 && (
          <p className="text-xs text-gray-400 text-center">
            יש לסווג את כל חברי הצוות כדי להמשיך
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
            className="py-2.5 px-6 rounded-xl bg-teal-500 disabled:opacity-40 text-white font-semibold text-sm hover:bg-teal-600 transition-colors"
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
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            פוטנציאל לא ממומש
          </p>
          <p className="text-xs text-gray-500 mb-2">
            איפה יש פוטנציאל לא ממומש בצוות?
          </p>
          <textarea
            value={data.unrealizedPotential}
            onChange={(e) => update("unrealizedPotential", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Quick Win — צעד שבועי
          </p>
          <p className="text-xs text-gray-500 mb-2">
            פעולה אחת קטנה שאפשר לעשות השבוע שתגדיל את האנרגיה הנכונה בצוות.
          </p>
          <textarea
            value={data.quickWin}
            onChange={(e) => update("quickWin", e.target.value)}
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
            className="py-2.5 px-6 rounded-xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition-colors"
          >
            שמור/י כ&apos;מפת צוות&apos; בתיק ←
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">מפת האנרגיה של הצוות</h2>
        {saved && <span className="text-xs text-emerald-600">נשמר אוטומטית ✓</span>}
      </div>

      <ToolStepper steps={STEPS_LABELS} current={step} accent="teal" />

      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
    </Card>
  );
}
