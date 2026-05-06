import Link from "next/link";
import { ROLES } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            Management Development Platform
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-5">
            OfekOS
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 font-medium mb-5 leading-snug">
            A guided digital operating system
            <br className="hidden sm:inline" /> for management development
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            OfekOS supports the full ecosystem of a management development
            program — from participants building leadership skills to
            facilitators guiding cohorts and admins overseeing program health.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Built for every role
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Each role has a tailored workspace designed around their specific
              responsibilities in the program.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ROLES.map((role) => (
              <Link key={role.id} href={role.href} className="group block">
                <div
                  className={`bg-white rounded-xl border ${role.borderColor} p-6 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col`}
                >
                  <div
                    className={`self-start px-3 py-1 rounded-full text-xs font-semibold ${role.bgColor} ${role.color} mb-4`}
                  >
                    {role.label}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">
                    {role.description}
                  </p>
                  <div
                    className={`mt-5 text-xs font-semibold ${role.color} flex items-center gap-1`}
                  >
                    Open dashboard
                    <span className="group-hover:translate-x-0.5 transition-transform inline-block">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Explore the prototype
          </h2>
          <p className="text-gray-500 mb-8">
            Navigate to any role dashboard to see the foundational structure of
            OfekOS.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {ROLES.map((role) => (
              <Link
                key={role.id}
                href={role.href}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium border ${role.borderColor} ${role.bgColor} ${role.color} hover:opacity-80 transition-opacity`}
              >
                {role.label} Dashboard
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
