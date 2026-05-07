import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview",     label: "סקירה",      icon: "📊" },
  { id: "participants", label: "משתתפים",    icon: "👥" },
  { id: "cohorts",      label: "קבוצות",     icon: "🏘️" },
  { id: "content",      label: "תוכן",       icon: "📁" },
  { id: "analytics",   label: "אנליטיקה",   icon: "📈" },
] as const;

export type AdminTab = (typeof TABS)[number]["id"];

interface AdminTabNavProps {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
}

export default function AdminTabNav({ active, onChange }: AdminTabNavProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 flex gap-0 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
              active === tab.id
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            )}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
