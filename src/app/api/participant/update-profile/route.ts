import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, avatarUrl } = body as { name?: string; avatarUrl?: string | null };

  const updates: Record<string, string | null> = {};
  if (typeof name === "string" && name.trim()) {
    updates.name = name.trim();
    // Derive new initials
    const parts = name.trim().split(/\s+/);
    updates.avatar_initials = (
      (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")
    ).toUpperCase() || parts[0].slice(0, 2).toUpperCase();
  }
  if ("avatarUrl" in body) {
    updates.avatar_url = avatarUrl ?? null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const service = createServiceClient();
  const { error } = await service
    .from("users")
    .update(updates)
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, ...updates });
}
