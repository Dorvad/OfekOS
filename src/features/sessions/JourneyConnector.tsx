import { cn } from "@/lib/utils";

interface JourneyConnectorProps {
  isCompleted: boolean;
}

export default function JourneyConnector({ isCompleted }: JourneyConnectorProps) {
  return (
    <div className="flex justify-start pl-8 my-1">
      <div
        className={cn(
          "w-0.5 h-6",
          isCompleted ? "bg-emerald-300" : "bg-gray-200"
        )}
      />
    </div>
  );
}
