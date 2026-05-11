import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// POST { action: "add", name, type, url, fileSizeKb, description, sessionNumber }
// POST { action: "delete", id }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = serviceClient();

  if (body.action === "add") {
    const { data, error } = await supabase
      .from("resources")
      .insert({
        name: body.name,
        type: body.type,
        url: body.url ?? null,
        file_size_kb: body.fileSizeKb ?? null,
        description: body.description ?? "",
        session_number: body.sessionNumber,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({
      id: data.id,
      name: data.name,
      type: data.type,
      url: data.url,
      fileSizeKb: data.file_size_kb,
      description: data.description,
      sessionNumber: data.session_number,
      uploadedAt: (data.created_at as string).split("T")[0],
    });
  }

  if (body.action === "delete") {
    const { error } = await supabase.from("resources").delete().eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
