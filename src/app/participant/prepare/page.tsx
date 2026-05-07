"use client";

import { useState, useEffect } from "react";
import { MOCK_SESSIONS, MOCK_ASSIGNMENTS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import Card from "@/components/ui/Card";
import Link from "next/link";

const PREPARE_KEY = "ofekos:prepare:u1:data";

interface PrepareData {
  insight: string;
  dilemma: string;
  action: string;
  question: string;
}

const EMPTY: PrepareData = { insight: "", dilemma: "", action: "", question: "" };

const FIELDS: {
  key: keyof PrepareData;
  emoji: string;
  label: string;
  hint: string;
  placeholder: string;
}[] = [
  {
    key: "insight",
    emoji: "💡",
    label: "תובנה",
    hint: "מה למדת מהמפגש הקודם שכבר ישמת בפועל?",
    placeholder: "לדוגמה: הבנתי שאני נוטה לפתור בעיות במקום לשאול שאלות...",
  },
  {
    key: "dilemma",
    emoji: "🤔",
    label: "דילמה",
    hint: "מה מאתגר אותך כרגע בתפקיד המנהל?",
    placeholder: "לדוגמה: אחד מאנשי הצוות לא עומד ביעדים ואני לא בטוח כיצד לגשת אליו...",
  },
  {
    key: "action",
    emoji: "✅",
    label: "פעולה",
    hint: "מה התחייבת לעשות במפגש הקודם? האם עשית זאת?",
    placeholder: "לדוגמה: התחייבתי לקיים שיחת עדכון שבועית עם הצוות — קיימתי פעם אחת...",
  },
  {
    key: "question",
    emoji: "❓",
    label: "שאלה",
    hint: "שאלה אחת שתרצה להביא ולדון בה במפגש הבא",
    placeholder: "לדוגמה: כיצד מנהלים עובד שמצטיין טכנית אבל לא עובד טוב בצוות?",
  },
];

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

const SESSION_TITLES_HE: Record<string, string> = {
  s1: "יסודות הניהול",
  s2: "מתן משוב אפקטיבי",
  s3: "שיחות קשות",
  s4: "האצלה והסמכה",
  s5: "חשיבה אסטרטגית",
  s6: "מנהיגות שינוי",
};

export default function PreparePage() {
  const [data, setData] = useState<PrepareData>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const nextSession = MOCK_SESSIONS.find((s) => s.status === "upcoming" || s.status === "active");
  const nextSessionNumber = nextSession
    ? parseInt(nextSession.id.replace("s", ""), 10)
    : null;

  useEffect(() => {
    const raw = localStorage.getItem(PREPARE_KEY);
    if (raw) {
      try { setData(JSON.parse(raw)); } catch { /* ignore */ }
    }

    // Sync from Supabase
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && nextSessionNumber) {
        const { data: dbData } = await supabase
          .from("prepare_data")
          .select("insight, dilemma, action, question")
          .eq("user_id", user.id)
          .eq("session_number", nextSessionNumber)
          .single();
        if (dbData) {
          const merged = {
            insight: dbData.insight ?? "",
            dilemma: dbData.dilemma ?? "",
            action: dbData.action ?? "",
            question: dbData.question ?? "",
          };
          setData(merged);
          localStorage.setItem(PREPARE_KEY, JSON.stringify(merged));
        }
        setUserId(user.id);
      }
      setHydrated(true);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(key: keyof PrepareData, value: string) {
    const next = { ...data, [key]: value };
    setData(next);
    setSaved(false);
    localStorage.setItem(PREPARE_KEY, JSON.stringify(next));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    if (userId && nextSessionNumber) {
      const supabase = createClient();
      void supabase.from("prepare_data").upsert({
        user_id: userId,
        session_number: nextSessionNumber,
        ...next,
      }, { onConflict: "user_id,session_number" });
    }
  }

  const nextAssignment = nextSessionNumber
    ? MOCK_ASSIGNMENTS.find((a) => a.sessionNumber === nextSessionNumber)
    : MOCK_ASSIGNMENTS.find((a) => a.isUnlocked);

  const filledCount = Object.values(data).filter((v) => v.trim().length > 0).length;
  const isDone = filledCount >= 4;

  const sessionTitleHe = nextSession
    ? (SESSION_TITLES_HE[nextSession.id] ?? nextSession.title)
    : null;

  if (!hydrated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

      {/* ── Header: next session context ── */}
      {nextSession && (
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 text-white shadow-md">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">📅</span>
                <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wide">
                  מפגש {nextSessionNumber} · {formatDate(nextSession.date)}
                </span>
              </div>
              <h1 className="text-xl font-bold leading-snug">{sessionTitleHe}</h1>
              <p className="text-indigo-200 text-sm mt-0.5">{nextSession.durationMinutes} דקות</p>
            </div>
            <div className="shrink-0 text-left">
              <div className="text-2xl font-bold text-white">{filledCount}/4</div>
              <div className="text-xs text-indigo-200">שדות</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 right-0 bg-white rounded-full transition-all duration-500"
              style={{ width: `${(filledCount / 4) * 100}%` }}
            />
          </div>
          <p className="text-xs text-indigo-200 mt-2">
            {isDone
              ? "✓ ההכנה הושלמה — אתה מוכן למפגש!"
              : filledCount === 0
              ? "מלא את 4 השדות כדי להגיע מוכן/ת למפגש"
              : `עוד ${4 - filledCount} שדות להשלמה`}
          </p>
        </div>
      )}

      {/* ── Done banner ── */}
      {isDone && (
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-emerald-800 text-sm">ההכנה הושלמה!</p>
            <p className="text-xs text-emerald-600 mt-0.5">תגיע למפגש עם תובנה, דילמה, פעולה ושאלה מוכנים.</p>
          </div>
        </div>
      )}

      {/* ── Prep fields ── */}
      <div className="space-y-4">
        {FIELDS.map((field, i) => {
          const filled = data[field.key].trim().length > 0;
          return (
            <Card
              key={field.key}
              className={`transition-all ${filled ? "border-indigo-100 bg-indigo-50/30" : ""}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{field.emoji}</span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  שדה {i + 1} מתוך 4
                </span>
                {filled && <span className="text-xs text-emerald-600 font-semibold mr-auto">✓ מולא</span>}
              </div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                {field.label}
              </label>
              <p className="text-xs text-gray-500 mb-3">{field.hint}</p>
              <textarea
                value={data[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                dir="rtl"
              />
            </Card>
          );
        })}
      </div>

      {/* ── Save indicator ── */}
      {saved && (
        <p className="text-xs text-emerald-600 font-medium text-center">נשמר ✓</p>
      )}

      {/* ── Link to current assignment ── */}
      {nextAssignment && !nextAssignment.isUnlocked && (
        <Card className="border-dashed">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            המטלה שלך למפגש הזה
          </p>
          <h3 className="font-bold text-gray-900 mb-0.5">{nextAssignment.title}</h3>
          <p className="text-sm text-gray-500 mb-3">{nextAssignment.subtitle}</p>
          <p className="text-xs text-gray-400">המטלה תיפתח לאחר השלמת המטלה הנוכחית</p>
        </Card>
      )}
      {nextAssignment?.isUnlocked && (
        <Card className="border-indigo-100 bg-indigo-50/40">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-2">
            המטלה שלך למפגש הזה
          </p>
          <h3 className="font-bold text-gray-900 mb-0.5">{nextAssignment.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{nextAssignment.subtitle}</p>
          <Link
            href={`/participant/assignments/${nextAssignment.id}`}
            className="inline-block text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-xl transition-colors"
          >
            פתח מטלה ←
          </Link>
        </Card>
      )}
    </div>
  );
}
