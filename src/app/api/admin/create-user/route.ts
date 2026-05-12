import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  const { name, email, cohortId } = await request.json();
  if (!name || !email) return NextResponse.json({ error: "missing fields" }, { status: 400 });

  const supabase = serviceClient();

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name: name, role: "participant" },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const userId = data.user.id;
  const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  // Upsert into public.users — safe whether or not an auth trigger already created the row
  const { error: upsertError } = await supabase
    .from("users")
    .upsert(
      {
        id: userId,
        name,
        email,
        role: "participant",
        avatar_initials: initials,
        cohort_id: cohortId || null,
      },
      { onConflict: "id" }
    );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 400 });
  }

  return NextResponse.json({ id: userId, name, email, cohortId: cohortId || null });
}
