import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

const SEED_ASSIGNMENTS = [
  { id: "a1", is_unlocked: true },
  { id: "a2", is_unlocked: true },
  { id: "a3", is_unlocked: false },
  { id: "a4", is_unlocked: false },
  { id: "a5", is_unlocked: false },
  { id: "a6", is_unlocked: false },
];

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  const client = serviceClient();
  const { data, error } = await client
    .from("assignments")
    .select("id, is_unlocked")
    .order("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Auto-seed if table is empty — ensures UPDATE has rows to target
  if (!data || data.length === 0) {
    const { data: seeded, error: seedError } = await client
      .from("assignments")
      .upsert(SEED_ASSIGNMENTS, { onConflict: "id", ignoreDuplicates: true })
      .select("id, is_unlocked")
      .order("id");
    if (seedError) return NextResponse.json({ error: seedError.message }, { status: 400 });
    return NextResponse.json(seeded ?? SEED_ASSIGNMENTS);
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { assignmentId, unlocked } = await request.json();
  if (!assignmentId || typeof unlocked !== "boolean") {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const client = serviceClient();

  // Upsert so UPDATE works even if the row doesn't exist yet
  const { error } = await client
    .from("assignments")
    .upsert({ id: assignmentId, is_unlocked: unlocked }, { onConflict: "id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
