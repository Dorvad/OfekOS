"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(hebrewError(authError.message));
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setError("הכניסה הצליחה אך הסשן לא נשמר בדפדפן. נסה לרענן ולהתחבר שוב.");
      setLoading(false);
      return;
    }

    router.replace("/participant");
    router.refresh();

    window.setTimeout(() => {
      window.location.assign("/participant");
    }, 700);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">OfekOS</h1>
          <p className="text-gray-500 text-sm mt-1">פלטפורמה לפיתוח מנהלים</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">כניסה למערכת</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                אימייל
              </label>
              <input
                id="email"
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
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                סיסמה
              </label>
              <input
                id="password"
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
              {loading ? "מתחבר..." : "כניסה ←"}
            </button>
          </form>
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
    return "יותר מדי ניסיונות כניסה. נסה שוב בעוד מספר דקות.";
  return "שגיאת כניסה. נסה שנית.";
}
