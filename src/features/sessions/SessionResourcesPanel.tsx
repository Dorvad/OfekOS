import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { MOCK_RESOURCES } from "@/lib/mock-data";
import type { BadgeVariant } from "@/components/ui/Badge";

const typeVariant: Record<string, BadgeVariant> = {
  file: "default",
  template: "warning",
  link: "info",
  video: "success",
};

interface SessionResourcesPanelProps {
  resourceIds: string[];
}

export default function SessionResourcesPanel({ resourceIds }: SessionResourcesPanelProps) {
  const resources = MOCK_RESOURCES.filter((r) => resourceIds.includes(r.id));
  if (resources.length === 0) return null;

  return (
    <Card className="mb-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Session Resources</h3>
      <div className="space-y-3">
        {resources.map((resource) => (
          <div key={resource.id} className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <Badge label={resource.type} variant={typeVariant[resource.type] ?? "default"} />
            </div>
            <div className="min-w-0">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {resource.title}
              </a>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                {resource.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
