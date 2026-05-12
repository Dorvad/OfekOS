import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let role = "participant";
  try {
    const service = createServiceClient();
    const { data } = await service
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    role = data?.role ?? "participant";
  } catch {
    // If service client fails (e.g. missing env var), fall back to participant
  }
  redirect(role === "admin" ? "/admin" : "/participant");
}
