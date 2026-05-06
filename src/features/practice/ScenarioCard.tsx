import Link from "next/link";
import Card from "@/components/ui/Card";
import ScenarioDifficultyBadge from "./ScenarioDifficultyBadge";
import type { PracticeScenario } from "@/lib/types";

interface ScenarioCardProps {
  scenario: PracticeScenario;
  sessionTitle?: string;
}

export default function ScenarioCard({ scenario, sessionTitle }: ScenarioCardProps) {
  return (
    <Link href={`/participant/practice/${scenario.id}`} className="group block">
      <Card className="h-full flex flex-col hover:shadow-md hover:border-indigo-200 transition-all">
        <div className="flex items-start justify-between gap-2 mb-3">
          <ScenarioDifficultyBadge difficulty={scenario.difficulty} />
          <span className="text-xs text-gray-400 shrink-0">~{scenario.estimatedMinutes} min</span>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors">
          {scenario.title}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            Skill:
          </span>
          <span className="text-xs text-gray-600">{scenario.skillPracticed}</span>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {scenario.description}
        </p>

        {sessionTitle && (
          <p className="text-[10px] text-gray-400 mt-3">Session: {sessionTitle}</p>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
            Start Practice →
          </span>
        </div>
      </Card>
    </Link>
  );
}
