import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  const supabase = serviceClient();
  const [{ data: cohorts, error: ce }, { data: users, error: ue }] = await Promise.all([
    supabase.from("cohorts").select("id, name").order("created_at"),
    supabase.from("users").select("id, cohort_id").eq("role", "participant"),
  ]);
  if (ce) return NextResponse.json({ error: ce.message }, { status: 400 });
  if (ue) return NextResponse.json({ error: ue.message }, { status: 400 });
  const result = (cohorts ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    participantIds: (users ?? []).filter((u) => u.cohort_id === c.id).map((u) => u.id),
  }));
  return NextResponse.json(result);
}

// POST { action: "create", name } | { action: "rename", id, name } | { action: "delete", id }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = serviceClient();

  if (body.action === "create") {
    const { data, error } = await supabase
      .from("cohorts")
      .insert({ name: body.name })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data.id, name: data.name, participantIds: [] });
  }

  if (body.action === "rename") {
    const { error } = await supabase
      .from("cohorts")
      .update({ name: body.name })
      .eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "delete") {
    await supabase.from("users").update({ cohort_id: null }).eq("cohort_id", body.id);
    const { error } = await supabase.from("cohorts").delete().eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
