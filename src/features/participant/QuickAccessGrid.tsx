import Link from "next/link";

interface QuickAccessItem {
  href: string;
  title: string;
  subtitle: string;
  color: string;
}

const ITEMS: QuickAccessItem[] = [
  {
    href: "/participant/journey",
    title: "Journey",
    subtitle: "Your session path",
    color: "group-hover:text-indigo-600",
  },
  {
    href: "/participant/workbook",
    title: "Workbook",
    subtitle: "Your management portfolio",
    color: "group-hover:text-emerald-600",
  },
  {
    href: "/participant/practice",
    title: "Practice",
    subtitle: "AI conversation simulations",
    color: "group-hover:text-violet-600",
  },
  {
    href: "/participant/resources",
    title: "Resources",
    subtitle: "Readings and templates",
    color: "group-hover:text-amber-600",
  },
];

export default function QuickAccessGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all"
        >
          <p className="text-sm font-semibold text-gray-900">{item.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
          <span className={`text-xs mt-2 inline-block text-gray-400 ${item.color} transition-colors`}>
            Open →
          </span>
        </Link>
      ))}
    </div>
  );
}
