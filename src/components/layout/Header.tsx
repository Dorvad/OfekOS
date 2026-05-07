import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-base font-bold text-gray-900 tracking-tight">OfekOS</span>
          <span className="hidden sm:inline text-xs text-gray-400 border-r border-gray-200 pr-2.5">
            פיתוח מנהלים
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/participant" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            משתתף
          </Link>
          <Link href="/admin" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
