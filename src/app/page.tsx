import { createClient as createAnonClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Use anon client only to read the auth session (no DB query)
  const supabase = await createAnonClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Use service role to read role — bypasses RLS so the query always succeeds
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data } = await service
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(data?.role === "admin" ? "/admin" : "/participant");
}
