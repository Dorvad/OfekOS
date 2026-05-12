import Link from "next/link";
import { MOCK_PROGRAM, MOCK_ASSIGNMENTS, MOCK_SESSIONS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import Card from "@/components/ui/Card";
import ProgramAxisClient from "@/features/assignments/ProgramAxisClient";
import PrepareReminderClient from "@/features/assignments/PrepareReminderClient";
import ParticipantRefresher from "@/features/assignments/ParticipantRefresher";
import type { Assignment } from "@/lib/types";

export const dynamic = "force-dynamic";

const SESSION_TITLES_HE: Record<string, string> = {
  s1: "יסודות הניהול",
  s2: "מתן משוב אפקטיבי",
  s3: "שיחות קשות",
  s4: "האצלה והסמכה",
  s5: "חשיבה אסטרטגית",
  s6: "מנהיגות שינוי",
};

function formatDateHe(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("he-IL", { day: "numeric", month: "long" });
  } catch {
    return dateStr;
  }
}

const accentHero: Record<string, string> = {
  amber:   "from-amber-400 to-amber-500",
  violet:  "from-violet-500 to-violet-600",
  teal:    "from-teal-400 to-teal-500",
  emerald: "from-emerald-400 to-emerald-500",
  orange:  "from-orange-400 to-orange-500",
  indigo:  "from-indigo-500 to-indigo-600",
};

export default async function ParticipantDashboard() {
  const supabase = await createClient();

  // Fetch real user name
  let firstName = "משתתף";
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("name")
      .eq("id", user.id)
      .single();
    if (userData?.name) {
      firstName = userData.name.split(" ")[0];
    }
  }

  // Fetch lock states via service client (bypasses RLS on assignments table)
  const service = createServiceClient();
  const { data: dbAssignments } = await service
    .from("assignments")
    .select("id, is_unlocked");

  const lockMap = Object.fromEntries(
    (dbAssignments ?? []).map((a) => [a.id, a.is_unlocked])
  );

  const assignments: Assignment[] = MOCK_ASSIGNMENTS.map((a) => ({
    ...a,
    isUnlocked: lockMap[a.id] !== undefined ? lockMap[a.id] : a.isUnlocked,
  }));

  // Fetch the current user's assignment progress — use service client to bypass RLS
  const DONE_STATUSES = ["submitted", "achieved"];
  const statusMap: Record<string, string> = {};
  if (user) {
    const { data: paRows } = await service
      .from("participant_assignments")
      .select("assignment_id, status")
      .eq("user_id", user.id);
    for (const row of paRows ?? []) {
      statusMap[row.assignment_id] = row.status;
    }
  }

  const unlockedAssignments = assignments.filter((a) => a.isUnlocked);
  const unlockedCount = unlockedAssignments.length;

  // Current = first unlocked assignment not yet done (in-progress or not started)
  const currentAssignment = unlockedAssignments.find(
    (a) => !DONE_STATUSES.includes(statusMap[a.id] ?? "")
  ) ?? null;

  // Are all unlocked assignments completed?
  const allDone =
    unlockedCount > 0 &&
    unlockedAssignments.every((a) => DONE_STATUSES.includes(statusMap[a.id] ?? ""));

  const nextSession = MOCK_SESSIONS.find((s) => s.status === "upcoming" || s.status === "active");
  const nextSessionNumber = nextSession ? parseInt(nextSession.id.replace("s", ""), 10) : null;
  const nextSessionTitleHe = nextSession ? (SESSION_TITLES_HE[nextSession.id] ?? nextSession.title) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <ParticipantRefresher />

      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">שלום, {firstName}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{MOCK_PROGRAM.name.split("—")[0].trim()}</p>
      </div>

      {/* Current assignment — hero card / empty states */}
      {currentAssignment ? (
        <Link href={`/participant/assignments/${currentAssignment.id}`} className="block group">
          <div className={`rounded-2xl bg-gradient-to-br ${accentHero[currentAssignment.accentColor]} p-5 shadow-md group-hover:shadow-lg transition-shadow`}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 bg-white/20 text-white">
                  מפגש {currentAssignment.sessionNumber} · מטלה פעילה
                </span>
                <h2 className="text-white font-bold text-xl leading-snug">
                  {currentAssignment.title}
                </h2>
                <p className="text-white/80 text-sm mt-1">{currentAssignment.subtitle}</p>
              </div>
              <div className="shrink-0 mt-1 px-3 py-2 rounded-xl text-sm font-semibold bg-white/20 group-hover:bg-white/30 text-white transition-colors">
                {DONE_STATUSES.includes(statusMap[currentAssignment.id] ?? "") ? "צפה ←" : statusMap[currentAssignment.id] ? "המשך ←" : "התחל ←"}
              </div>
            </div>
            <p className="text-white/70 text-xs leading-relaxed line-clamp-2">
              {currentAssignment.missionBrief}
            </p>
          </div>
        </Link>
      ) : allDone ? (
        <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 p-5 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🎉</span>
            <h2 className="text-white font-bold text-lg">כל המטלות הושלמו!</h2>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            השלמת את כל המטלות הפתוחות לעת עתה. כאשר יפתחו מטלות חדשות תקבל/י עדכון.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-5 text-center">
          <div className="text-3xl mb-2">🔒</div>
          <h2 className="font-bold text-gray-600 mb-1">אין מטלות פתוחות כרגע</h2>
          <p className="text-sm text-gray-400">המטלות ייפתחו בהמשך התוכנית.</p>
        </div>
      )}

      {/* Program journey */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">המסע שלך</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {unlockedCount}/{assignments.length} פתוחות
          </span>
        </div>
        <ProgramAxisClient assignments={assignments} />
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-400">6 מטלות · 3 שלבים כל אחת</span>
          <Link
            href="/participant/assignments"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            כל המטלות ←
          </Link>
        </div>
      </Card>

      {/* Prepare reminder */}
      {nextSession && nextSessionNumber && nextSessionTitleHe && (
        <PrepareReminderClient
          sessionNumber={nextSessionNumber}
          sessionTitle={nextSessionTitleHe}
          sessionDate={formatDateHe(nextSession.date)}
        />
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/participant/portfolio">
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="text-2xl font-bold text-brand-600 mb-1">{unlockedCount}</div>
            <div className="text-xs text-gray-500">מטלות פתוחות</div>
          </Card>
        </Link>
        <Link href="/participant/assignments">
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="text-2xl font-bold text-gray-700 mb-1">
              {assignments.length - unlockedCount}
            </div>
            <div className="text-xs text-gray-500">מטלות נעולות</div>
          </Card>
        </Link>
      </div>

    </div>
  );
}
