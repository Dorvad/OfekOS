"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_PROGRAM } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

// ── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function TargetIcon({ active }: { active: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.678z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function BriefcaseIcon({ active }: { active: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
    </svg>
  );
}

function ClipboardIcon({ active }: { active: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function FolderIcon({ active }: { active: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 00-3-3h-3.879a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H6a3 3 0 00-3 3v3.162A3.756 3.756 0 014.094 9h15.812zM4.094 10.5a2.25 2.25 0 00-2.227 2.568l.857 6A2.25 2.25 0 004.951 21H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-2.227-2.568H4.094z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// ── Nav config ───────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  key: string;
}

const NAV: NavItem[] = [
  { href: "/participant",              label: "בית",     key: "home"        },
  { href: "/participant/assignments",  label: "מטלות",   key: "assignments" },
  { href: "/participant/portfolio",    label: "תיק",     key: "portfolio"   },
  { href: "/participant/prepare",      label: "הכנה",    key: "prepare"     },
  { href: "/participant/resources",    label: "משאבים",  key: "resources"   },
];

function getActiveKey(pathname: string): string {
  if (pathname === "/participant") return "home";
  if (pathname.startsWith("/participant/assignments")) return "assignments";
  if (pathname.startsWith("/participant/portfolio")) return "portfolio";
  if (pathname.startsWith("/participant/insights")) return "portfolio";
  if (pathname.startsWith("/participant/prepare")) return "prepare";
  if (pathname.startsWith("/participant/resources")) return "resources";
  return "home";
}

function NavIcon({ navKey, active }: { navKey: string; active: boolean }) {
  if (navKey === "home")        return <HomeIcon active={active} />;
  if (navKey === "assignments") return <TargetIcon active={active} />;
  if (navKey === "portfolio")   return <BriefcaseIcon active={active} />;
  if (navKey === "prepare")     return <ClipboardIcon active={active} />;
  return <FolderIcon active={active} />;
}

// ── Shell ────────────────────────────────────────────────────────────────────

interface Props {
  children: React.ReactNode;
  userName: string;
  userInitials: string;
  isAdmin: boolean;
}

export default function ParticipantShell({ children, userName, userInitials, isAdmin }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const activeKey = getActiveKey(pathname);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Admin banner — shown when admin browses as participant */}
      {isAdmin && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-medium text-amber-800">
            צופה כמשתתף — אתה רואה את הממשק כפי שנראה למשתתפים
          </span>
          <Link
            href="/admin"
            className="text-xs font-semibold text-amber-900 hover:text-amber-700 underline underline-offset-2"
          >
            חזור לניהול ←
          </Link>
        </div>
      )}

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="text-base font-bold text-gray-900 tracking-tight leading-none">OfekOS</span>
            <span className="hidden sm:block text-xs text-gray-400 border-r border-gray-200 pr-2.5 leading-none">
              {MOCK_PROGRAM.name.split("—")[0].trim()}
            </span>
          </div>

          {/* Desktop tab nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map((item) => {
              const isActive = activeKey === item.key;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <NavIcon navKey={item.key} active={isActive} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User + logout */}
          <div className="flex items-center gap-2 shrink-0">
            {userName && (
              <span className="hidden sm:block text-xs text-gray-500">{userName}</span>
            )}
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {userInitials}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 font-medium"
              title="יציאה מהמערכת"
            >
              יציאה
            </button>
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 pb-20 md:pb-6">
        {children}
      </main>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 shadow-[0_-1px_0_0_#f3f4f6]">
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
          {NAV.map((item) => {
            const isActive = activeKey === item.key;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 transition-colors",
                  isActive ? "text-indigo-600" : "text-gray-400"
                )}
              >
                <NavIcon navKey={item.key} active={isActive} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
