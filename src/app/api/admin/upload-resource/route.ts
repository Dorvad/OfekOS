import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { AdminResource } from "@/lib/types";

const DEFAULT_BUCKET = "program-resources";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const EXT_TO_TYPE: Record<string, AdminResource["type"]> = {
  pdf: "pdf",
  doc: "template",
  docx: "template",
  ppt: "template",
  pptx: "template",
  png: "other",
  jpg: "other",
  jpeg: "other",
  mp4: "video",
  mov: "video",
  webm: "video",
};

function sanitizeFileName(name: string): string {
  const normalized = name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  return normalized.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "resource";
}

function toAdminResource(row: {
  id: string;
  name: string;
  type: AdminResource["type"];
  url: string | null;
  file_size_kb: number | null;
  description: string;
  session_number: number;
  created_at: string;
}): AdminResource {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    url: row.url,
    fileSizeKb: row.file_size_kb,
    description: row.description,
    sessionNumber: row.session_number,
    uploadedAt: row.created_at.split("T")[0],
  };
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Missing Supabase server configuration for file uploads." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const sessionNumberRaw = formData.get("sessionNumber");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was provided." }, { status: 400 });
  }

  const sessionNumber = Number(sessionNumberRaw);
  if (!Number.isInteger(sessionNumber) || sessionNumber < 1 || sessionNumber > 6) {
    return NextResponse.json({ error: "Invalid session number." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File is larger than 10MB." }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const bucket = process.env.SUPABASE_RESOURCE_BUCKET || DEFAULT_BUCKET;

  const buckets = await supabase.storage.listBuckets();
  if (buckets.error) {
    return NextResponse.json({ error: buckets.error.message }, { status: 500 });
  }

  if (!buckets.data.some((b) => b.name === bucket)) {
    const created = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE_BYTES,
    });
    if (created.error) {
      return NextResponse.json({ error: created.error.message }, { status: 500 });
    }
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const safeName = sanitizeFileName(file.name);
  const storagePath = `${sessionNumber}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const bytes = await file.arrayBuffer();
  const upload = await supabase.storage.from(bucket).upload(storagePath, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (upload.error) {
    return NextResponse.json({ error: upload.error.message }, { status: 500 });
  }

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  const { data, error } = await supabase
    .from("resources")
    .insert({
      name: file.name,
      type: EXT_TO_TYPE[ext] ?? "other",
      url: publicUrl.publicUrl,
      file_size_kb: Math.max(1, Math.round(file.size / 1024)),
      description: "",
      session_number: sessionNumber,
    })
    .select("id, name, type, url, file_size_kb, description, session_number, created_at")
    .single();

  if (error) {
    await supabase.storage.from(bucket).remove([storagePath]);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(toAdminResource(data));
}
