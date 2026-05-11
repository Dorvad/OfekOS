import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const service = createServiceClient();
  const { data } = await service
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(data?.role === "admin" ? "/admin" : "/participant");
}
