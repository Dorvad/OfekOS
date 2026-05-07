"use client";

import { useState } from "react";
import { useToolData } from "@/features/assignments/useToolData";
import ToolStepper from "@/features/assignments/ToolStepper";
import Card from "@/components/ui/Card";

interface NorthStarData {
  step: number;
  desiredPosition: string;
  currentPosition: string;
  mainGap: string;
  mainImpact: string;
  skillsStrengthen: string[];
  skillsPreserve: string[];
  skillsRelease: string[];
  conversationDone: boolean;
  operationalAction: string;
  closingSentence: string;
}

const DEFAULT: NorthStarData = {
  step: 0,
  desiredPosition: "",
  currentPosition: "",
  mainGap: "",
  mainImpact: "",
  skillsStrengthen: [],
  skillsPreserve: [],
  skillsRelease: [],
  conversationDone: false,
  operationalAction: "",
  closingSentence: "",
};

const STEPS_LABELS = ["הכנה לשיחה", "מיפוי מיומנויות", "לאחר השיחה"];

const STRENGTHEN_CHIPS = [
  "ניהול ישיר",
  "מתן משוב",
  "הקשבה",
  "תכנון",
  "קבלת החלטות",
  "ניהול זמן",
  "ניהול פגישות",
  "העצמת עובדים",
  "תקשורת",
  "תעדוף",
];

const RELEASE_CHIPS = [
  "ביצוע ידני",
  "בקרת מיקרו",
  "תשובה לכל שאלה",
  "עבודה לבד",
  "עשיית הכל בעצמי",
];

interface ChipGroupProps {
  chips: string[];
  selected: string[];
  onToggle: (chip: string) => void;
  customInput: string;
  onCustomChange: (val: string) => void;
  onCustomAdd: () => void;
  accent: "amber" | "violet";
}

function ChipGroup({
  chips,
  selected,
  onToggle,
  customInput,
  onCustomChange,
  onCustomAdd,
  accent,
}: ChipGroupProps) {
  const activeClass =
    accent === "amber"
      ? "bg-amber-500 text-white border-amber-500"
      : "bg-violet-500 text-white border-violet-500";
  const inactiveClass = "bg-gray-100 text-gray-700 border-gray-100";

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
              isSelected ? activeClass : inactiveClass
            }`}
          >
            {chip}
          </button>
        );
      })}
      {/* Custom selected chips */}
      {selected
        .filter((s) => !chips.includes(s))
        .map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onToggle(chip)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeClass}`}
          >
            {chip} ✕
          </button>
        ))}
      <div className="flex gap-1 w-full mt-1">
        <input
          type="text"
          value={customInput}
          onChange={(e) => onCustomChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onCustomAdd()}
          placeholder="הוסף בחופשי..."
          dir="rtl"
          className="flex-1 text-xs rounded-lg border border-gray-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          type="button"
          onClick={onCustomAdd}
          disabled={!customInput.trim()}
          className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors font-medium"
        >
          +
        </button>
      </div>
    </div>
  );
}

interface ToolProps {
  assignmentId: string;
  onComplete: () => void;
}

export default function NorthStarTool({ assignmentId, onComplete }: ToolProps) {
  const { data, update, saved } = useToolData<NorthStarData>(assignmentId, DEFAULT);

  const [customStrengthen, setCustomStrengthen] = useState("");
  const [customPreserve, setCustomPreserve] = useState("");
  const [customRelease, setCustomRelease] = useState("");

  const step = data.step;

  function goTo(s: number) {
    update("step", s);
  }

  function toggleChip(
    key: "skillsStrengthen" | "skillsPreserve" | "skillsRelease",
    chip: string
  ) {
    const arr = data[key];
    const next = arr.includes(chip) ? arr.filter((c) => c !== chip) : [...arr, chip];
    update(key, next);
  }

  function addCustomChip(
    key: "skillsStrengthen" | "skillsPreserve" | "skillsRelease",
    value: string,
    clear: () => void
  ) {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!data[key].includes(trimmed)) {
      update(key, [...data[key], trimmed]);
    }
    clear();
  }

  const textareaClass =
    "w-full p-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400";

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">כוכב הצפון שלי</h2>
        {saved && <span className="text-xs text-emerald-600">נשמר ✓</span>}
      </div>

      <ToolStepper steps={STEPS_LABELS} current={step} accent="amber" />

      {/* ── Step 0: הכנה לשיחה ── */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 bg-amber-50 rounded-xl px-3 py-2">
            הכן/י את עצמך לפני שיחה עם הממונה שלך
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              המיקום הרצוי
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              לאן אני שואף/ת להגיע בתפקיד שלי בשנה הקרובה?
            </p>
            <textarea
              value={data.desiredPosition}
              onChange={(e) => update("desiredPosition", e.target.value)}
              rows={3}
              dir="rtl"
              className={textareaClass}
              placeholder="כתוב/י כאן..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              המצב הנוכחי
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              איפה אני נמצא/ת היום מבחינת מיומנויות, זמן ומיקוד?
            </p>
            <textarea
              value={data.currentPosition}
              onChange={(e) => update("currentPosition", e.target.value)}
              rows={3}
              dir="rtl"
              className={textareaClass}
              placeholder="כתוב/י כאן..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              הפער המרכזי
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              מה הפער הגדול ביותר בין המצוי לרצוי?
            </p>
            <textarea
              value={data.mainGap}
              onChange={(e) => update("mainGap", e.target.value)}
              rows={3}
              dir="rtl"
              className={textareaClass}
              placeholder="כתוב/י כאן..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Impact שאני רוצה לייצר
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              מה השינוי הכי משמעותי שאני רוצה להוביל ביחידה שלי?
            </p>
            <textarea
              value={data.mainImpact}
              onChange={(e) => update("mainImpact", e.target.value)}
              rows={3}
              dir="rtl"
              className={textareaClass}
              placeholder="כתוב/י כאן..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => goTo(1)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              המשך ←
            </button>
          </div>
        </div>
      )}

      {/* ── Step 1: מיפוי מיומנויות ── */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 bg-amber-50 rounded-xl px-3 py-2">
            סמן/י מיומנויות בכל קטגוריה. אפשר להוסיף גם בחופשי.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* לחזק */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <h3 className="text-sm font-semibold text-amber-800 mb-2">לחזק 💪</h3>
              <ChipGroup
                chips={STRENGTHEN_CHIPS}
                selected={data.skillsStrengthen}
                onToggle={(chip) => toggleChip("skillsStrengthen", chip)}
                customInput={customStrengthen}
                onCustomChange={setCustomStrengthen}
                onCustomAdd={() =>
                  addCustomChip("skillsStrengthen", customStrengthen, () =>
                    setCustomStrengthen("")
                  )
                }
                accent="amber"
              />
            </div>

            {/* לשמר */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">לשמר ✓</h3>
              <ChipGroup
                chips={STRENGTHEN_CHIPS}
                selected={data.skillsPreserve}
                onToggle={(chip) => toggleChip("skillsPreserve", chip)}
                customInput={customPreserve}
                onCustomChange={setCustomPreserve}
                onCustomAdd={() =>
                  addCustomChip("skillsPreserve", customPreserve, () =>
                    setCustomPreserve("")
                  )
                }
                accent="amber"
              />
            </div>

            {/* לשחרר */}
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
              <h3 className="text-sm font-semibold text-orange-800 mb-2">לשחרר 🔓</h3>
              <ChipGroup
                chips={RELEASE_CHIPS}
                selected={data.skillsRelease}
                onToggle={(chip) => toggleChip("skillsRelease", chip)}
                customInput={customRelease}
                onCustomChange={setCustomRelease}
                onCustomAdd={() =>
                  addCustomChip("skillsRelease", customRelease, () =>
                    setCustomRelease("")
                  )
                }
                accent="amber"
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
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              המשך ←
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: לאחר השיחה ── */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 bg-amber-50 rounded-xl px-3 py-2">
            לאחר שקיימת את השיחה עם הממונה, ענה/י על השאלות הבאות
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
              קיימתי את השיחה עם הממונה
            </span>
          </button>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              הפעולה האופרטיבית שלי
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              פעולה אחת קונקרטית שאיישם בטווח הקרוב (מה בדיוק, עד מתי)
            </p>
            <textarea
              value={data.operationalAction}
              onChange={(e) => update("operationalAction", e.target.value)}
              rows={3}
              dir="rtl"
              className={textareaClass}
              placeholder="כתוב/י כאן..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              משפט לסיכום
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              התובנה המרכזית שלי מהשיחה היא...
            </p>
            <textarea
              value={data.closingSentence}
              onChange={(e) => update("closingSentence", e.target.value)}
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
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              סיימתי ←
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
