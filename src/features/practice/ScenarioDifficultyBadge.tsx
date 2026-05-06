import type { PracticeDifficulty } from "@/lib/types";
import type { BadgeVariant } from "@/components/ui/Badge";
import Badge from "@/components/ui/Badge";

const difficultyVariant: Record<PracticeDifficulty, BadgeVariant> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "default",
};

const difficultyLabel: Record<PracticeDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

interface ScenarioDifficultyBadgeProps {
  difficulty: PracticeDifficulty;
}

export default function ScenarioDifficultyBadge({
  difficulty,
}: ScenarioDifficultyBadgeProps) {
  return (
    <Badge
      label={difficultyLabel[difficulty]}
      variant={difficultyVariant[difficulty]}
    />
  );
}
