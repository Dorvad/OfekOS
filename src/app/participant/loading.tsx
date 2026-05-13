export default function ParticipantLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Welcome */}
      <div className="space-y-1.5">
        <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-4 w-52 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>

      {/* Hero card */}
      <div className="h-36 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />

      {/* Journey card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Prepare reminder */}
      <div className="h-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl animate-pulse" />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-pulse" />
        <div className="h-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-pulse" />
      </div>
    </div>
  );
}
