import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

const ACCENT_RING: Record<string, string> = {
  amber:   "border-amber-300 bg-amber-50",
  violet:  "border-violet-300 bg-violet-50",
  teal:    "border-teal-300 bg-teal-50",
  emerald: "border-emerald-300 bg-emerald-50",
  orange:  "border-orange-300 bg-orange-50",
  indigo:  "border-indigo-300 bg-indigo-50",
};

const ACCENT_BADGE: Record<string, string> = {
  amber:   "bg-amber-500",
  violet:  "bg-violet-600",
  teal:    "bg-teal-600",
  emerald: "bg-emerald-600",
  orange:  "bg-orange-500",
  indigo:  "bg-indigo-600",
};

const ACCENT_TEXT: Record<string, string> = {
  amber:   "text-amber-700",
  violet:  "text-violet-700",
  teal:    "text-teal-700",
  emerald: "text-emerald-700",
  orange:  "text-orange-700",
  indigo:  "text-indigo-700",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("he-IL", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rows } = await supabase
    .from("participant_assignments")
    .select("assignment_id, insight, achieved_at, status")
    .eq("user_id", user.id);

  const rowMap = Object.fromEntries(
    (rows ?? []).map((r) => [r.assignment_id, r])
  );

  const submittedCount = MOCK_ASSIGNMENTS.filter((a) => {
    const row = rowMap[a.id];
    return row?.insight && (row.status === "submitted" || row.status === "achieved");
  }).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6" dir="rtl">

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">התובנות שלי</h1>
        <p className="text-sm text-gray-500 mt-1">
          {submittedCount} מתוך 6 תובנות נכתבו
        </p>
      </div>

      {/* Progress strip */}
      <div className="flex gap-1.5 mb-6">
        {MOCK_ASSIGNMENTS.map((a) => {
          const row = rowMap[a.id];
          const done = row?.insight && (row.status === "submitted" || row.status === "achieved");
          return (
            <div
              key={a.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                done ? ACCENT_BADGE[a.accentColor] ?? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
          );
        })}
      </div>

      {/* Insight cards */}
      <div className="space-y-3">
        {MOCK_ASSIGNMENTS.map((assignment) => {
          const row = rowMap[assignment.id];
          const insight = row?.insight as string | undefined;
          const achievedAt = row?.achieved_at as string | undefined;
          const isDone = !!insight && (row?.status === "submitted" || row?.status === "achieved");
          const accent = assignment.accentColor;

          return (
            <div
              key={assignment.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition-colors ${
                isDone
                  ? `border-r-4 ${ACCENT_RING[accent] ?? ACCENT_RING.indigo}`
                  : "border-gray-100"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Number badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                    ACCENT_BADGE[accent] ?? ACCENT_BADGE.indigo
                  }`}
                >
                  {assignment.sessionNumber}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium">{assignment.subtitle}</p>
                  <p className="font-bold text-gray-900 text-sm">{assignment.title}</p>

                  {isDone ? (
                    <>
                      <p className={`mt-2 text-sm leading-relaxed ${ACCENT_TEXT[accent] ?? ACCENT_TEXT.indigo}`}>
                        &ldquo;{insight}&rdquo;
                      </p>
                      {achievedAt && (
                        <p className="mt-2 text-xs text-gray-400">
                          הושלם ב{formatDate(achievedAt)}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="mt-2 text-xs text-gray-300 italic">
                      {assignment.isUnlocked ? "טרם נכתבה תובנה" : "נעול — יפתח בהמשך"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
