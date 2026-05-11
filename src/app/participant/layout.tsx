import { createClient } from "@/lib/supabase/server";
import ParticipantShell from "@/features/participant/ParticipantShell";

export const dynamic = "force-dynamic";

export default async function ParticipantLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userName = "";
  let userInitials = "?";
  let isAdmin = false;

  if (user) {
    const { data } = await supabase
      .from("users")
      .select("name, avatar_initials, role")
      .eq("id", user.id)
      .single();

    if (data?.name) {
      userName = data.name.split(" ")[0];
      userInitials = data.avatar_initials ?? data.name.slice(0, 2).toUpperCase();
    }
    isAdmin = data?.role === "admin";
  }

  return (
    <ParticipantShell userName={userName} userInitials={userInitials} isAdmin={isAdmin}>
      {children}
    </ParticipantShell>
  );
}
