import ParticipantNav from "@/features/participant/ParticipantNav";

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-full">
      <ParticipantNav />
      <div className="pb-20 md:pb-0">{children}</div>
    </div>
  );
}
