import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

const BUCKET = process.env.SUPABASE_AVATAR_BUCKET ?? "avatars";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await (file as File).arrayBuffer();
  if (bytes.byteLength > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const ext = (file as File).name.split(".").pop()?.toLowerCase() ?? "jpg";
  const storagePath = `${user.id}/avatar.${ext}`;
  const contentType = (file as File).type || "image/jpeg";

  const service = createServiceClient();

  const { error: uploadError } = await service.storage
    .from(BUCKET)
    .upload(storagePath, bytes, { contentType, upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data: urlData } = service.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  const avatarUrl = urlData.publicUrl;

  // Persist URL to user record
  await service
    .from("users")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  return NextResponse.json({ avatarUrl });
}
