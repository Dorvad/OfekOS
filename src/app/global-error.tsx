"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-lg font-bold text-gray-900 mb-2">שגיאה בטעינת האפליקציה</h1>
          <p className="text-sm text-gray-500 mb-4">אירעה שגיאה בשרת. אנא נסה שנית.</p>
          {error.digest && (
            <p className="text-xs text-gray-400 font-mono mb-4">
              Digest: {error.digest}
            </p>
          )}
          {process.env.NODE_ENV !== "production" && error.message && (
            <p className="text-xs text-red-600 font-mono bg-red-50 rounded-lg p-3 mb-4 text-right break-words">
              {error.message}
            </p>
          )}
          <button
            onClick={reset}
            className="bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors"
          >
            נסה שנית ←
          </button>
        </div>
      </body>
    </html>
  );
}
