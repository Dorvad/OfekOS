import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single();
  return <AdminDashboard adminName={data?.name?.split(" ")[0] ?? "Admin"} />;
}
