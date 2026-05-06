"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  match: (pathname: string) => boolean;
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function getActiveTab(pathname: string): string {
  if (pathname === "/participant") return "home";
  if (pathname.startsWith("/participant/assignments")) return "assignments";
  if (pathname.startsWith("/participant/insights")) return "insights";
  if (pathname.startsWith("/participant/prepare")) return "prepare";
  if (pathname.startsWith("/participant/resources")) return "resources";
  return "home";
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/participant",
    label: "בית",
    icon: <HomeIcon />,
    match: (p) => getActiveTab(p) === "home",
  },
  {
    href: "/participant/assignments",
    label: "מטלות",
    icon: <TargetIcon />,
    match: (p) => getActiveTab(p) === "assignments",
  },
  {
    href: "/participant/insights",
    label: "תובנות",
    icon: <LightbulbIcon />,
    match: (p) => getActiveTab(p) === "insights",
  },
  {
    href: "/participant/prepare",
    label: "הכנה",
    icon: <ClipboardIcon />,
    match: (p) => getActiveTab(p) === "prepare",
  },
  {
    href: "/participant/resources",
    label: "משאבים",
    icon: <FolderIcon />,
    match: (p) => getActiveTab(p) === "resources",
  },
];

export default function ParticipantNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: horizontal pill tabs below global header */}
      <nav className="hidden md:block bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    isActive
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile: fixed bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 h-16">
          {NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 transition-colors",
                  isActive ? "text-indigo-600" : "text-gray-400"
                )}
              >
                {item.icon}
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
