import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";

// Build full seed rows from mock data so every NOT NULL column is satisfied
const SEED_ASSIGNMENTS = MOCK_ASSIGNMENTS.map((a) => ({
  id: a.id,
  session_number: a.sessionNumber,
  title: a.title,
  subtitle: a.subtitle,
  mission_brief: a.missionBrief,
  accent_color: a.accentColor,
  achievement_label: a.achievementLabel,
  is_unlocked: a.isUnlocked,
}));

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

  // Auto-seed if table is empty — ensures upsert has rows to target
  if (!data || data.length === 0) {
    const { data: seeded, error: seedError } = await client
      .from("assignments")
      .upsert(SEED_ASSIGNMENTS, { onConflict: "id", ignoreDuplicates: true })
      .select("id, is_unlocked")
      .order("id");
    if (seedError) return NextResponse.json({ error: seedError.message }, { status: 400 });
    return NextResponse.json(seeded ?? SEED_ASSIGNMENTS.map((a) => ({ id: a.id, is_unlocked: a.is_unlocked })));
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { assignmentId, unlocked } = await request.json();
  if (!assignmentId || typeof unlocked !== "boolean") {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const client = serviceClient();

  // Find the full mock row so we can satisfy every NOT NULL column on upsert
  const mock = MOCK_ASSIGNMENTS.find((a) => a.id === assignmentId);
  if (!mock) {
    return NextResponse.json({ error: `Unknown assignment id: ${assignmentId}` }, { status: 400 });
  }

  const { error } = await client.from("assignments").upsert(
    {
      id: mock.id,
      session_number: mock.sessionNumber,
      title: mock.title,
      subtitle: mock.subtitle,
      mission_brief: mock.missionBrief,
      accent_color: mock.accentColor,
      achievement_label: mock.achievementLabel,
      is_unlocked: unlocked,
    },
    { onConflict: "id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
