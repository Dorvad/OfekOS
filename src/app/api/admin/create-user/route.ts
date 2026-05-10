import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { name, email, cohortId } = await request.json();
  if (!name || !email) return NextResponse.json({ error: "missing fields" }, { status: 400 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name: name, role: "participant" },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (cohortId) {
    await supabase.from("users").update({ cohort_id: cohortId, name }).eq("id", data.user.id);
  }

  return NextResponse.json({ id: data.user.id, name, email, cohortId: cohortId || null });
}
