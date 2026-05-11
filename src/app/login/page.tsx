"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Tab = "login" | "register";
type LoginMode = "participant" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [mode, setMode] = useState<LoginMode>("participant");

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
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
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(hebrewError(authError.message));
      setLoading(false);
      return;
    }

    // If admin mode forced → go to /admin regardless of role
    if (mode === "admin") {
      router.push("/admin");
      router.refresh();
      return;
    }

    // Otherwise route by role from DB
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    router.push(userData?.role === "admin" ? "/admin" : "/participant");
    router.refresh();
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
      options: {
        data: { full_name: regName },
      },
    });

    if (signUpError) {
      setError(hebrewError(signUpError.message));
      setLoading(false);
      return;
    }

    if (data.session) {
      // Email confirmation disabled → logged in immediately
      router.push("/participant");
      router.refresh();
    } else {
      // Email confirmation required
      setSuccess("נשלח אליך אימייל לאימות החשבון. לאחר האימות תוכל להיכנס.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">OfekOS</h1>
          <p className="text-gray-500 text-sm mt-1">פלטפורמה לפיתוח מנהלים</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Top tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setTab("login"); setError(null); setSuccess(null); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                tab === "login"
                  ? "text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50/40"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              כניסה
            </button>
            <button
              onClick={() => { setTab("register"); setError(null); setSuccess(null); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                tab === "register"
                  ? "text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50/40"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              הרשמה
            </button>
          </div>

          <div className="p-7">

            {/* ── LOGIN TAB ── */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">

                {/* Role toggle */}
                <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-0.5 gap-0.5">
                  <button
                    type="button"
                    onClick={() => setMode("participant")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      mode === "participant"
                        ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    משתתף
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("admin")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      mode === "admin"
                        ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    מנהל מערכת
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="your@email.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
                >
                  {loading
                    ? "מתחבר..."
                    : mode === "admin"
                    ? "כניסה לניהול ←"
                    : "כניסה ←"}
                </button>
              </form>
            )}

            {/* ── REGISTER TAB ── */}
            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <p className="text-xs text-gray-500 text-center -mt-1">
                  הרשמה עבור משתתפי התוכנית
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
                  <input
                    type="text"
                    autoComplete="name"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="ישראל ישראלי"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="your@email.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="לפחות 6 תווים"
                    dir="ltr"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                    {success}
                  </div>
                )}

                {!success && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
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
  );
}

function hebrewError(message: string): string {
  if (message.includes("Invalid login credentials"))
    return "אימייל או סיסמה שגויים. נסה שנית.";
  if (message.includes("Email not confirmed"))
    return "האימייל טרם אומת. בדוק את תיבת הדואר שלך.";
  if (message.includes("Too many requests"))
    return "יותר מדי ניסיונות. נסה שוב בעוד מספר דקות.";
  if (message.includes("User already registered"))
    return "אימייל זה כבר רשום במערכת. נסה להיכנס.";
  if (message.includes("Password should be at least"))
    return "הסיסמה חייבת להכיל לפחות 6 תווים.";
  return "שגיאה. נסה שנית.";
}
