import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const results: Record<string, string> = {
    supabase_url: url ? `set (${url.slice(0, 30)}...)` : "MISSING",
    service_role_key: key ? `set (${key.slice(0, 10)}...)` : "MISSING",
  };

  if (!url || !key) {
    return NextResponse.json({ error: "Missing env vars", results });
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const tables = ["assignments", "users", "cohorts", "participant_assignments", "resources", "prepare_data"];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*").limit(1);
    if (error) {
      results[`table_${table}`] = `ERROR: ${error.message}`;
    } else {
      results[`table_${table}`] = `OK (${data?.length ?? 0} rows in sample)`;
    }
  }

  // Test upsert on assignments
  const { error: upsertErr } = await supabase
    .from("assignments")
    .upsert({ id: "a1", is_unlocked: true }, { onConflict: "id" });
  results["upsert_test"] = upsertErr ? `ERROR: ${upsertErr.message}` : "OK";

  return NextResponse.json(results);
}
