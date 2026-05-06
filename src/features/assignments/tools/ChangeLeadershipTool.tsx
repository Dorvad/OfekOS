"use client";

import { useState, useEffect, useRef } from "react";
import { getAssignmentData, setAssignmentData } from "@/lib/assignment-storage";

type ChangeStage = "denial" | "resistance" | "learning" | "acceptance" | null;
type ResistanceType = "emotional" | "rational" | "behavioral";

interface ChangeLeadershipData {
  whatChange: string;
  affected: string;
  practicalImpact: string;
  stage: ChangeStage;
  resistanceTypes: ResistanceType[];
  inclusion: string;
  differentiation: string;
  resolution: string;
  inclusionDone: boolean;
  differentiationDone: boolean;
}

const EMPTY: ChangeLeadershipData = {
  whatChange: "", affected: "", practicalImpact: "",
  stage: null, resistanceTypes: [],
  inclusion: "", differentiation: "", resolution: "",
  inclusionDone: false, differentiationDone: false,
};

const STAGES: { key: ChangeStage; label: string; desc: string }[] = [
  { key: "denial",     label: "הכחשה",    desc: "לא מאמינים שהשינוי אמיתי או נחוץ" },
  { key: "resistance", label: "התנגדות",  desc: "מאמינים בשינוי אך מתנגדים לו" },
  { key: "learning",   label: "למידה",    desc: "מתחילים להתנסות עם השינוי" },
  { key: "acceptance", label: "קבלה",     desc: "מאמצים את השינוי לחלוטין" },
];

export default function ChangeLeadershipTool({ assignmentId }: { assignmentId: string }) {
  const [data, setData] = useState<ChangeLeadershipData>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [incError, setIncError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = getAssignmentData<ChangeLeadershipData>(assignmentId);
    if (stored) setData(stored as ChangeLeadershipData);
  }, [assignmentId]);

  function persist(next: ChangeLeadershipData) {
    setData(next);
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setAssignmentData(assignmentId, next);
      setSaved(true);
    }, 800);
  }

  function toggleResistance(type: ResistanceType) {
    const has = data.resistanceTypes.includes(type);
    persist({
      ...data,
      resistanceTypes: has
        ? data.resistanceTypes.filter((r) => r !== type)
        : [...data.resistanceTypes, type],
    });
  }

  function handleResolutionFocus() {
    if (!data.inclusionDone) {
      setIncError(true);
      setTimeout(() => setIncError(false), 3000);
    }
  }

  const isReady =
    data.whatChange.trim().length > 0 &&
    data.inclusion.trim().length > 0 &&
    data.inclusionDone;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">מנהיגות שינוי</h2>
        <span className={`text-xs ${saved ? "text-emerald-600" : "text-gray-400"}`}>
          {saved ? "נשמר ✓" : ""}
        </span>
      </div>

      {/* Change description */}
      <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-indigo-800">תאר את השינוי</h3>
        <div>
          <label className="text-xs text-gray-600 block mb-1">מה השינוי?</label>
          <textarea
            value={data.whatChange}
            onChange={(e) => persist({ ...data, whatChange: e.target.value })}
            placeholder="תאר את השינוי בקצרה..."
            className="w-full min-h-[72px] rounded-lg border border-indigo-200 bg-white p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            dir="rtl"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 block mb-1">מי מושפע ואיך?</label>
          <textarea
            value={data.affected}
            onChange={(e) => persist({ ...data, affected: e.target.value })}
            placeholder="רשום את מי שיושפע ומה ההשפעה..."
            className="w-full min-h-[72px] rounded-lg border border-indigo-200 bg-white p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            dir="rtl"
          />
        </div>
      </div>

      {/* Stage diagnosis */}
      {data.whatChange.trim().length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">אבחן את שלב השינוי</h3>
          <div className="grid grid-cols-2 gap-2">
            {STAGES.map((s) => (
              <button
                key={s.key}
                onClick={() => persist({ ...data, stage: s.key })}
                className={`rounded-xl border-2 p-3 text-right transition-all ${
                  data.stage === s.key
                    ? "border-indigo-500 bg-indigo-100"
                    : "border-gray-200 bg-white hover:border-indigo-200"
                }`}
              >
                <p className="font-semibold text-sm text-gray-900">{s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resistance type */}
      {data.stage && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">סוג ההתנגדות</h3>
          <div className="flex gap-2 flex-wrap">
            {(["emotional", "rational", "behavioral"] as ResistanceType[]).map((t) => {
              const labels = { emotional: "רגשי", rational: "רציונלי", behavioral: "התנהגותי" };
              const active = data.resistanceTypes.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleResistance(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                    active ? "border-indigo-500 bg-indigo-100 text-indigo-700" : "border-gray-200 text-gray-500"
                  }`}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3-phase conversation builder */}
      {data.stage && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">שיחת השינוי — 3 שלבים</h3>

          {/* Inclusion */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${data.inclusionDone ? "bg-emerald-500 text-white" : "bg-indigo-500 text-white"}`}>1</div>
                <span className="font-semibold text-sm">הכלה</span>
              </div>
              {!data.inclusionDone && data.inclusion.trim().length > 0 && (
                <button
                  onClick={() => persist({ ...data, inclusionDone: true })}
                  className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full"
                >
                  סיימתי
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-2">הראה שאתה שמע ומבין את הצד האחר לפני שמציע פתרון</p>
            <textarea
              value={data.inclusion}
              onChange={(e) => persist({ ...data, inclusion: e.target.value, inclusionDone: false })}
              placeholder="מה תאמר כדי להכיל את הצד האחר?"
              className="w-full min-h-[80px] rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              dir="rtl"
            />
          </div>

          {/* Differentiation */}
          <div className={`rounded-xl border p-4 ${!data.inclusionDone ? "opacity-50 pointer-events-none" : "border-gray-200 bg-white"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${data.differentiationDone ? "bg-emerald-500 text-white" : "bg-indigo-400 text-white"}`}>2</div>
                <span className="font-semibold text-sm">בידול</span>
              </div>
              {data.inclusionDone && !data.differentiationDone && data.differentiation.trim().length > 0 && (
                <button
                  onClick={() => persist({ ...data, differentiationDone: true })}
                  className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full"
                >
                  סיימתי
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-2">הבדל בין מה שהצד האחר חושב ובין מה שאתה רואה</p>
            <textarea
              value={data.differentiation}
              onChange={(e) => persist({ ...data, differentiation: e.target.value, differentiationDone: false })}
              placeholder="מה תאמר כדי לחדד את ההבדל?"
              className="w-full min-h-[80px] rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              dir="rtl"
            />
          </div>

          {/* Resolution */}
          <div className={`rounded-xl border p-4 ${!data.differentiationDone ? "opacity-50 pointer-events-none" : "border-gray-200 bg-white"}`} onFocus={handleResolutionFocus}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-indigo-300 text-white flex items-center justify-center text-xs font-bold">3</div>
              <span className="font-semibold text-sm">פתרון</span>
            </div>
            {incError && (
              <p className="text-xs text-red-500 mb-2">⚠️ לא ניתן לדלג על שלב ההכלה</p>
            )}
            <p className="text-xs text-gray-400 mb-2">הצע את הדרך קדימה</p>
            <textarea
              value={data.resolution}
              onChange={(e) => persist({ ...data, resolution: e.target.value })}
              placeholder="מה הפתרון שתציע?"
              className="w-full min-h-[80px] rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              dir="rtl"
              disabled={!data.differentiationDone}
            />
          </div>
        </div>
      )}

      {isReady && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium text-center">
          ✓ תכנית השינוי בנויה — עבור לשלב הבא
        </div>
      )}
    </div>
  );
}
