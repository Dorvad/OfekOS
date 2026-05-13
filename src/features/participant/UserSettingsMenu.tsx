"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Props {
  initialName: string;
  initialInitials: string;
  initialAvatarUrl: string | null;
}

export default function UserSettingsMenu({
  initialName,
  initialInitials,
  initialAvatarUrl,
}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [initials, setInitials] = useState(initialInitials);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(initialName);
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState("");

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync dark mode state from DOM (set by layout init script)
  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  // Close on outside click
  const handleOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);
  useEffect(() => {
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open, handleOutside]);

  // Close on Escape
  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open]);

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ofekos:theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ofekos:theme", "light");
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function saveName() {
    const trimmed = nameInput.trim();
    if (!trimmed) { setNameError("שם לא יכול להיות ריק"); return; }
    if (trimmed === name) { setEditingName(false); return; }
    setSavingName(true);
    setNameError("");
    try {
      const res = await fetch("/api/participant/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) throw new Error("שגיאה בשמירה");
      const data = await res.json();
      setName(trimmed.split(/\s+/)[0]);
      setInitials(data.avatar_initials ?? initials);
      setEditingName(false);
    } catch {
      setNameError("שגיאה — נסה שנית");
    } finally {
      setSavingName(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("תמונה גדולה מדי — עד 5MB");
      return;
    }
    setUploadingAvatar(true);
    setAvatarError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/participant/upload-avatar", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "שגיאה בהעלאה");
      }
      const { avatarUrl: url } = await res.json();
      setAvatarUrl(url);
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "שגיאה");
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  }

  async function removeAvatar() {
    try {
      await fetch("/api/participant/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: null }),
      });
      setAvatarUrl(null);
    } catch { /* silent */ }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* ── Avatar trigger ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-2 ring-transparent hover:ring-brand-300 focus:outline-none focus:ring-brand-500 transition-all"
        aria-label="הגדרות משתמש"
        aria-expanded={open}
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} fill sizes="32px" className="object-cover" />
        ) : (
          <div className="w-full h-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="absolute left-0 top-11 z-50 w-64 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden animate-slide-down"
          dir="rtl"
        >
          {/* User header */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={name} fill sizes="40px" className="object-cover" />
              ) : (
                <div className="w-full h-full bg-brand-600 flex items-center justify-center text-sm font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">משתתף</p>
            </div>
          </div>

          {/* ── Name ── */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">שם תצוגה</p>
            {editingName ? (
              <div className="space-y-1.5">
                <div className="flex gap-2 items-center">
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => { setNameInput(e.target.value); setNameError(""); }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveName();
                      if (e.key === "Escape") setEditingName(false);
                    }}
                    className="flex-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    dir="rtl"
                    placeholder="השם שלך"
                  />
                  <button
                    onClick={saveName}
                    disabled={savingName}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 disabled:opacity-40 whitespace-nowrap"
                  >
                    {savingName ? "שומר..." : "שמור"}
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                {nameError && <p className="text-xs text-red-500">{nameError}</p>}
              </div>
            ) : (
              <button
                onClick={() => { setNameInput(name); setEditingName(true); }}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors w-full text-right"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                שינוי שם
              </button>
            )}
          </div>

          {/* ── Avatar ── */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">תמונת פרופיל</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {uploadingAvatar ? "מעלה תמונה..." : avatarUrl ? "החלף תמונה" : "הוסף תמונה"}
            </button>
            {avatarUrl && !uploadingAvatar && (
              <button
                onClick={removeAvatar}
                className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                </svg>
                הסר תמונה
              </button>
            )}
            {avatarError && <p className="mt-1 text-xs text-red-500">{avatarError}</p>}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          {/* ── Dark mode ── */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <button
              onClick={toggleDark}
              className="flex items-center justify-between w-full group"
            >
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {darkMode ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )}
                {darkMode ? "מצב כהה" : "מצב בהיר"}
              </div>
              {/* Toggle pill */}
              <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${darkMode ? "bg-brand-600" : "bg-gray-200 dark:bg-gray-600"}`}>
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${darkMode ? "translate-x-[-1.25rem]" : "translate-x-[-0.125rem]"}`}
                  style={{ right: darkMode ? "0.125rem" : "auto", left: darkMode ? "auto" : "0.125rem" }}
                />
              </div>
            </button>
          </div>

          {/* ── Logout ── */}
          <div className="px-4 py-2.5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors w-full py-0.5"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              יציאה מהמערכת
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
