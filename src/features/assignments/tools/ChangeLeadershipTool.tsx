"use client";

import { useState } from "react";
import { useToolData } from "@/features/assignments/useToolData";
import ToolStepper from "@/features/assignments/ToolStepper";
import Card from "@/components/ui/Card";

interface ChangeSign {
  id: string;
  text: string;
  stage: "denial" | "resistance" | "learning" | "acceptance" | "";
  resistanceType: "emotional" | "rational" | "behavioral" | "mixed" | "";
}

interface ChangeData {
  audienceType: "employee" | "team" | "interface" | "other" | "";
  audienceName: string;
  changeDescription: string;
  signs: ChangeSign[];
  convContainment: string;
  convDifferentiation: string;
  convSolution: string;
  selfCheckSpace: boolean;
  selfCheckDifferentiation: boolean;
  selfCheckStep: boolean;
  customSignText: string;
}

const DEFAULT: ChangeData = {
  audienceType: "",
  audienceName: "",
  changeDescription: "",
  signs: [],
  convContainment: "",
  convDifferentiation: "",
  convSolution: "",
  selfCheckSpace: false,
  selfCheckDifferentiation: false,
  selfCheckStep: false,
  customSignText: "",
};

const PRESET_SIGNS = [
  "זה עוד שינוי שייעלם עוד חודש.",
  "אני לא מבין/ה מה בדיוק מצפים ממני.",
  "ניסיתי, אבל זה לא עובד בפועל.",
  "אוקיי, אני מוכן/ה לנסות אם יהיה ברור מה הצעד הבא.",
  "זה לא המצאת ה-שלנו, למה שנעשה את זה?",
  "אין לי זמן לזה עכשיו.",
];

const STAGES: { key: ChangeSign["stage"]; label: string; color: string; dot: string }[] = [
  { key: "denial", label: "הכחשה", color: "text-red-700 bg-red-100", dot: "bg-red-500" },
  { key: "resistance", label: "התנגדות", color: "text-orange-700 bg-orange-100", dot: "bg-orange-500" },
  { key: "learning", label: "למידה", color: "text-blue-700 bg-blue-100", dot: "bg-blue-500" },
  { key: "acceptance", label: "קבלה", color: "text-emerald-700 bg-emerald-100", dot: "bg-emerald-500" },
];

const RESISTANCE_TYPES: { key: ChangeSign["resistanceType"]; label: string }[] = [
  { key: "emotional", label: "רגשית" },
  { key: "rational", label: "רציונלית" },
  { key: "behavioral", label: "התנהגותית" },
  { key: "mixed", label: "שילוב" },
];

const STEPS_LABELS = ["הקהל והשינוי", "סימנים מהשטח", "בניית השיחה", "בדיקת עצמי"];

const textareaClass =
  "w-full rounded-xl border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400";

function getId(): string {
  return Math.random().toString(36).slice(2, 9);
}

interface ToolProps {
  assignmentId: string;
  onComplete: () => void;
}

export default function ChangeLeadershipTool({
  assignmentId,
  onComplete,
}: ToolProps) {
  const { data, update, saved } = useToolData<ChangeData>(
    assignmentId,
    DEFAULT
  );
  const [step, setStep] = useState(0);

  const audienceOptions: {
    key: ChangeData["audienceType"];
    label: string;
  }[] = [
    { key: "employee", label: "עובד/ת" },
    { key: "team", label: "צוות" },
    { key: "interface", label: "קבוצת ממשק" },
    { key: "other", label: "אחר" },
  ];

  function isSignSelected(text: string) {
    return data.signs.some((s) => s.text === text);
  }

  function togglePresetSign(text: string) {
    if (isSignSelected(text)) {
      update(
        "signs",
        data.signs.filter((s) => s.text !== text)
      );
    } else {
      update("signs", [
        ...data.signs,
        { id: getId(), text, stage: "", resistanceType: "" },
      ]);
    }
  }

  function addCustomSign() {
    if (!data.customSignText.trim()) return;
    update("signs", [
      ...data.signs,
      {
        id: getId(),
        text: data.customSignText.trim(),
        stage: "",
        resistanceType: "",
      },
    ]);
    update("customSignText", "");
  }

  function updateSign(
    id: string,
    field: "stage" | "resistanceType",
    value: string
  ) {
    update(
      "signs",
      data.signs.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function removeSign(id: string) {
    update(
      "signs",
      data.signs.filter((s) => s.id !== id)
    );
  }

  const diagnosedCount = data.signs.filter(
    (s) => s.stage !== "" && s.resistanceType !== ""
  ).length;
  const canProceedStep1 = diagnosedCount >= 1;

  const allSelfChecked =
    data.selfCheckSpace && data.selfCheckDifferentiation && data.selfCheckStep;

  function renderStep0() {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500 bg-indigo-50 rounded-xl px-3 py-2">
          לפני שמובילים שינוי, צריך להבין איפה האדם נמצא על המפה.
        </p>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            מי הקהל?
          </p>
          <div className="flex flex-wrap gap-2">
            {audienceOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => update("audienceType", opt.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                  data.audienceType === opt.key
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-gray-200 text-gray-600 hover:border-indigo-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            שם / תיאור הקהל
          </p>
          <input
            type="text"
            value={data.audienceName}
            onChange={(e) => update("audienceName", e.target.value)}
            dir="rtl"
            placeholder="השתמש/י בכינוי אם מעדיף/ה..."
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            תיאור השינוי
          </p>
          <p className="text-xs text-gray-500 mb-2">
            תאר/י את השינוי שאת/ה מוביל/ה.
          </p>
          <textarea
            value={data.changeDescription}
            onChange={(e) => update("changeDescription", e.target.value)}
            rows={3}
            dir="rtl"
            className={textareaClass}
            placeholder="כתוב/י כאן..."
          />
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
        <p className="text-xs text-gray-500 bg-indigo-50 rounded-xl px-3 py-2">
          בחר/י סימנים שאתה/ת מזהה/ה בשטח. אפשר לסמן כמה שרוצים.
        </p>

        {/* Preset sign chips */}
        <div className="flex flex-wrap gap-2">
          {PRESET_SIGNS.map((sign) => (
            <button
              key={sign}
              type="button"
              onClick={() => togglePresetSign(sign)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border-2 text-right transition-colors ${
                isSignSelected(sign)
                  ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                  : "border-gray-200 text-gray-600 hover:border-indigo-300"
              }`}
            >
              {sign}
            </button>
          ))}
        </div>

        {/* Custom sign input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={data.customSignText}
            onChange={(e) => update("customSignText", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomSign()}
            dir="rtl"
            placeholder="הוסף/י סימן מותאם אישית..."
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={addCustomSign}
            disabled={!data.customSignText.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 disabled:opacity-40 text-indigo-700 font-semibold text-sm transition-colors"
          >
            הוסף
          </button>
        </div>

        {/* Diagnosis for each selected sign */}
        {data.signs.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500">
              אבחן/י כל סימן ({diagnosedCount}/{data.signs.length} אובחנו)
            </p>
            {data.signs.map((sign) => (
              <div
                key={sign.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-sm text-gray-800 font-medium">{sign.text}</p>
                  <button
                    onClick={() => removeSign(sign.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-sm shrink-0"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">שלב בתהליך:</p>
                    <div className="flex flex-wrap gap-1">
                      {STAGES.map((st) => (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() =>
                            updateSign(
                              sign.id,
                              "stage",
                              sign.stage === st.key ? "" : st.key
                            )
                          }
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            sign.stage === st.key
                              ? st.color
                              : "border border-gray-200 text-gray-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              sign.stage === st.key ? st.dot : "bg-gray-300"
                            }`}
                          />
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">סוג התנגדות:</p>
                    <div className="flex flex-wrap gap-1">
                      {RESISTANCE_TYPES.map((rt) => (
                        <button
                          key={rt.key}
                          type="button"
                          onClick={() =>
                            updateSign(
                              sign.id,
                              "resistanceType",
                              sign.resistanceType === rt.key ? "" : rt.key
                            )
                          }
                          className={`px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
                            sign.resistanceType === rt.key
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 text-gray-500"
                          }`}
                        >
                          {rt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!canProceedStep1 && (
          <p className="text-xs text-gray-400 text-center">
            אבחן/י לפחות סימן אחד כדי להמשיך
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
            className="py-2.5 px-6 rounded-xl bg-indigo-600 disabled:opacity-40 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
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
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 shadow-sm">
          <p className="text-sm font-bold text-teal-800 mb-1">🫂 הכלה</p>
          <p className="text-xs text-teal-700 mb-3">
            תן/י מקום לחשש — &apos;אני מבין/ה שהשינוי הזה יוצר אי-ודאות...&apos;
          </p>
          <textarea
            value={data.convContainment}
            onChange={(e) => update("convContainment", e.target.value)}
            rows={3}
            dir="rtl"
            className="w-full rounded-xl border border-teal-200 bg-white p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="כתוב/י כאן..."
          />
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm font-bold text-amber-800 mb-1">↔️ הבדלה</p>
          <p className="text-xs text-amber-700 mb-3">
            הבדל/י בין מה שניתן להשפיע עליו לבין מה שלא...
          </p>
          <textarea
            value={data.convDifferentiation}
            onChange={(e) => update("convDifferentiation", e.target.value)}
            rows={3}
            dir="rtl"
            className="w-full rounded-xl border border-amber-200 bg-white p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="כתוב/י כאן..."
          />
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
          <p className="text-sm font-bold text-indigo-800 mb-1">🎯 פתרון</p>
          <p className="text-xs text-indigo-700 mb-3">
            הצג/י צעד קטן, ברור וממוקד...
          </p>
          <textarea
            value={data.convSolution}
            onChange={(e) => update("convSolution", e.target.value)}
            rows={3}
            dir="rtl"
            className="w-full rounded-xl border border-indigo-200 bg-white p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
    const selfCheckItems: {
      key: "selfCheckSpace" | "selfCheckDifferentiation" | "selfCheckStep";
      label: string;
    }[] = [
      { key: "selfCheckSpace", label: "נתתי מקום לחשש ולרגשות" },
      {
        key: "selfCheckDifferentiation",
        label: "הבדלתי בין מה שניתן להשפיע עליו לבין מה שלא",
      },
      { key: "selfCheckStep", label: "הצעד הבא מספיק קטן וברור" },
    ];

    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-800 mb-3">
            קפצתי לפתרון?
          </p>
          <div className="space-y-2">
            {selfCheckItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => update(item.key, !data[item.key])}
                className={`flex items-center gap-3 w-full text-right px-4 py-3 rounded-xl border-2 transition-colors ${
                  data[item.key]
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
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
                      className="w-3 h-3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            {allSelfChecked ? (
              <p className="text-sm text-emerald-700 font-semibold text-center">
                מוכן/ה! השיחה שלך מאוזנת. ✓
              </p>
            ) : (
              <p className="text-sm text-amber-700 font-semibold text-center">
                כדאי לחזור ולוודא שהשלמת את כל הנקודות.
              </p>
            )}
          </div>
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
            שמור/י כ&apos;מפת שינוי ושיחת שינוי&apos; בתיק ←
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 text-base">
          מסע התנגדות לשינוי
        </h2>
        {saved && (
          <span className="text-xs text-emerald-600">נשמר אוטומטית ✓</span>
        )}
      </div>

      <ToolStepper steps={STEPS_LABELS} current={step} accent="indigo" />

      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </Card>
  );
}
