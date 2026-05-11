import { createClient as createServiceRoleClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json();
  const { assignmentId, status, currentPhase, data, insight, closingAction, closingQuestion, achievedAt } = body;
  if (!assignmentId) return NextResponse.json({ error: "missing assignmentId" }, { status: 400 });

  const service = createServiceRoleClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const row: Record<string, unknown> = { user_id: user.id, assignment_id: assignmentId };
  if (status      !== undefined) row.status          = status;
  if (currentPhase !== undefined) row.current_phase  = currentPhase;
  if (data        !== undefined) row.data            = data;
  if (insight     !== undefined) row.insight         = insight;
  if (closingAction   !== undefined) row.closing_action   = closingAction;
  if (closingQuestion !== undefined) row.closing_question = closingQuestion;
  if (achievedAt  !== undefined) row.achieved_at     = achievedAt;

  const { error } = await service
    .from("participant_assignments")
    .upsert(row, { onConflict: "user_id,assignment_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
