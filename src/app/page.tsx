import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <div className="inline-flex items-center bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              פלטפורמה לפיתוח מנהלים
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-4">
              OfekOS
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              מרחב עבודה דיגיטלי לתוכנית אופק — מטלות, תובנות וכלים למנהל המתפתח.
            </p>
          </div>
        </section>

        {/* Role cards */}
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Participant */}
              <Link href="/participant" className="group block">
                <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-base mb-1">משתתף</h2>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">
                    המסע האישי שלך — מטלות גיימיפיות, תובנות, הכנה למפגשים וחומרי למידה.
                  </p>
                  <div className="mt-4 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                    כנס לממשק ←
                  </div>
                </div>
              </Link>

              {/* Admin */}
              <Link href="/admin" className="group block">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-slate-600 flex items-center justify-center mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-base mb-1">Admin</h2>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">
                    Configure programs, manage users, and access full operational analytics.
                  </p>
                  <div className="mt-4 text-xs font-semibold text-slate-600 flex items-center gap-1">
                    Open dashboard ←
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
