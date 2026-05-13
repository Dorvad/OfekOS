import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import ParticipantShell from "@/features/participant/ParticipantShell";

export const dynamic = "force-dynamic";

export default async function ParticipantLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userName = "";
  let userInitials = "?";
  let isAdmin = false;

  let avatarUrl: string | null = null;

  if (user) {
    const service = createServiceClient();
    const { data } = await service
      .from("users")
      .select("name, avatar_initials, role, avatar_url")
      .eq("id", user.id)
      .single();

    if (data?.name) {
      userName = data.name.split(" ")[0];
      userInitials = data.avatar_initials ?? data.name.slice(0, 2).toUpperCase();
    }
    isAdmin = data?.role === "admin";
    avatarUrl = data?.avatar_url ?? null;
  }

  return (
    <ParticipantShell
      userName={userName}
      userInitials={userInitials}
      avatarUrl={avatarUrl}
      isAdmin={isAdmin}
    >
      {children}
    </ParticipantShell>
  );
}
