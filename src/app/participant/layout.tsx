import ParticipantShell from "@/features/participant/ParticipantShell";

export default function ParticipantLayout({ children }: { children: React.ReactNode }) {
  return <ParticipantShell>{children}</ParticipantShell>;
}
