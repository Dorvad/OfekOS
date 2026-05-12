"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Tab = "login" | "register";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(hebrewError(authError.message)); setLoading(false); return; }
    window.location.href = "/";
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (regPassword.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים.");
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: { data: { full_name: regName } },
    });
    if (signUpError) { setError(hebrewError(signUpError.message)); setLoading(false); return; }
    if (data.session) {
      window.location.href = "/participant";
    } else {
      setSuccess("נשלח אליך אימייל לאימות החשבון. לאחר האימות תוכל להיכנס.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">

      {/* ── Branded hero ── */}
      <div className="bg-gray-900 flex flex-col items-center justify-center py-10 px-4 gap-3">
        <Image
          src="/logo.png"
          alt="OfekOS"
          width={96}
          height={96}
          className="rounded-2xl"
          priority
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-gray-200">ofek</span>
            <span className="text-brand-500">OS</span>
          </h1>
          <p className="text-gray-500 text-xs mt-1 tracking-wide">פלטפורמה לפיתוח מנהלים</p>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="flex-1 flex items-start justify-center px-4 pt-8 pb-12">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {(["login", "register"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(null); setSuccess(null); }}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                    tab === t
                      ? "text-brand-700 border-b-2 border-brand-600 bg-brand-50"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {t === "login" ? "כניסה" : "הרשמה"}
                </button>
              ))}
            </div>

            <div className="p-7">

              {/* ── Login ── */}
              {tab === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                    <input
                      type="email" autoComplete="email" required
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="your@email.com" dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
                    <input
                      type="password" autoComplete="current-password" required
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="••••••••" dir="ltr"
                    />
                  </div>
                  {error && <ErrorBox>{error}</ErrorBox>}
                  <button
                    type="submit" disabled={loading}
                    className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
                  >
                    {loading ? "מתחבר..." : "כניסה ←"}
                  </button>
                </form>
              )}

              {/* ── Register ── */}
              {tab === "register" && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <p className="text-xs text-gray-500 text-center -mt-1">הרשמה עבור משתתפי התוכנית</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
                    <input
                      type="text" autoComplete="name" required
                      value={regName} onChange={(e) => setRegName(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="ישראל ישראלי"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                    <input
                      type="email" autoComplete="email" required
                      value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="your@email.com" dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
                    <input
                      type="password" autoComplete="new-password" required
                      value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="לפחות 6 תווים" dir="ltr"
                    />
                  </div>
                  {error && <ErrorBox>{error}</ErrorBox>}
                  {success && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                      {success}
                    </div>
                  )}
                  {!success && (
                    <button
                      type="submit" disabled={loading}
                      className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
                    >
                      {loading ? "יוצר חשבון..." : "הרשמה ←"}
                    </button>
                  )}
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
      {children}
    </div>
  );
}

function hebrewError(message: string): string {
  if (message.includes("Invalid login credentials")) return "אימייל או סיסמה שגויים. נסה שנית.";
  if (message.includes("Email not confirmed")) return "האימייל טרם אומת. בדוק את תיבת הדואר שלך.";
  if (message.includes("Too many requests")) return "יותר מדי ניסיונות. נסה שוב בעוד מספר דקות.";
  if (message.includes("User already registered")) return "אימייל זה כבר רשום במערכת. נסה להיכנס.";
  if (message.includes("Password should be at least")) return "הסיסמה חייבת להכיל לפחות 6 תווים.";
  return "שגיאה. נסה שנית.";
}
