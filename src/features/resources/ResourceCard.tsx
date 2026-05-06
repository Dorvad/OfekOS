import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { Resource } from "@/lib/types";
import type { BadgeVariant } from "@/components/ui/Badge";

const typeVariant: Record<string, BadgeVariant> = {
  file: "default",
  template: "warning",
  link: "info",
  video: "success",
};

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function TemplateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

const TypeIcon = ({ type }: { type: string }) => {
  if (type === "file") return <FileIcon />;
  if (type === "template") return <TemplateIcon />;
  if (type === "video") return <VideoIcon />;
  return <LinkIcon />;
};

interface ResourceCardProps {
  resource: Resource;
  sessionTitle?: string;
}

export default function ResourceCard({ resource, sessionTitle }: ResourceCardProps) {
  return (
    <Card className="flex flex-col gap-3 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
          <TypeIcon type={resource.type} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge label={resource.type} variant={typeVariant[resource.type] ?? "default"} />
            {sessionTitle ? (
              <span className="text-[10px] text-gray-400">Session: {sessionTitle}</span>
            ) : (
              <span className="text-[10px] text-gray-400">Program resource</span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900">{resource.title}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{resource.description}</p>
        </div>
      </div>
      <div className="pt-2 border-t border-gray-100">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View resource →
        </a>
      </div>
    </Card>
  );
}
