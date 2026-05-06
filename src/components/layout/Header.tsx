import Link from "next/link";
import { ROLES } from "@/lib/mock-data";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            OfekOS
          </span>
          <span className="hidden sm:inline text-xs text-gray-400 border-r border-gray-200 pr-3">
            פיתוח מנהלים
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {ROLES.map((role) => (
            <Link
              key={role.id}
              href={role.href}
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {role.label}
            </Link>
          ))}
        </nav>

        <div className="md:hidden text-xs text-gray-400 font-medium">
          Prototype v0.1
        </div>
      </div>
    </header>
  );
}
