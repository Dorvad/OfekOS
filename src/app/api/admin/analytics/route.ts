import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  const supabase = serviceClient();

  const [
    { data: pas },
    { data: users },
    { data: assignments },
    { data: paInsights },
    { data: usersForNames },
    { data: prepares },
  ] = await Promise.all([
    supabase.from("participant_assignments").select("assignment_id, status"),
    supabase.from("users").select("id").eq("role", "participant"),
    supabase.from("assignments").select("id, is_unlocked"),
    supabase.from("participant_assignments")
      .select("id, user_id, assignment_id, insight, closing_action, closing_question, achieved_at, status")
      .not("insight", "is", null)
      .order("achieved_at", { ascending: false }),
    supabase.from("users").select("id, name").eq("role", "participant"),
    supabase.from("prepare_data").select("user_id, insight, dilemma, action, question"),
  ]);

  const total = (users ?? []).length;

  // Build lock map from DB, fall back to mock
  const lockMap = Object.fromEntries(
    (assignments ?? []).map((a) => [a.id, a.is_unlocked])
  );
  const assignmentList = MOCK_ASSIGNMENTS.map((a) => ({
    id: a.id,
    title: a.title,
    accentColor: a.accentColor,
    isUnlocked: lockMap[a.id] !== undefined ? lockMap[a.id] : a.isUnlocked,
  }));

  const completionStats = assignmentList.map((a) => {
    if (!a.isUnlocked) {
      return { assignmentId: a.id, title: a.title, accentColor: a.accentColor, notStarted: 0, inProgress: 0, submitted: 0, total };
    }
    const rows = (pas ?? []).filter((p) => p.assignment_id === a.id);
    const submitted = rows.filter((p) => p.status === "submitted" || p.status === "achieved").length;
    const inProgress = rows.filter((p) => !["locked", "available", "submitted", "achieved"].includes(p.status)).length;
    return {
      assignmentId: a.id,
      title: a.title,
      accentColor: a.accentColor,
      notStarted: Math.max(0, total - submitted - inProgress),
      inProgress,
      submitted,
      total,
    };
  });

  // Build name map for submissions
  const nameMap = Object.fromEntries((usersForNames ?? []).map((u) => [u.id, u.name]));
  const assignmentTitleMap = Object.fromEntries(MOCK_ASSIGNMENTS.map((a) => [a.id, a.title]));

  const submissions = (paInsights ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    userName: nameMap[row.user_id] ?? "",
    assignmentId: row.assignment_id,
    assignmentTitle: assignmentTitleMap[row.assignment_id] ?? row.assignment_id,
    insight: row.insight ?? "",
    action: row.closing_action ?? "",
    question: row.closing_question ?? "",
    submittedAt: row.achieved_at?.split("T")[0] ?? "",
  }));

  const completed = (prepares ?? []).filter(
    (p) => p.insight && p.dilemma && p.action && p.question
  ).length;

  return NextResponse.json({
    completionStats,
    submissions,
    prepareStats: { completed, total },
  });
}
