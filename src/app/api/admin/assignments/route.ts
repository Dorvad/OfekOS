import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { assignmentId, unlocked } = await request.json();
  if (!assignmentId || typeof unlocked !== "boolean") {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error } = await supabase
    .from("assignments")
    .update({ is_unlocked: unlocked, updated_at: new Date().toISOString() })
    .eq("id", assignmentId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
