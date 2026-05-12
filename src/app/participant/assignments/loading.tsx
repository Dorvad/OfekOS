export default function AssignmentsLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="space-y-1.5 mb-6">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden animate-pulse">
            <div className="h-1 w-full bg-gray-200 dark:bg-gray-700" />
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="h-6 w-16 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700" />
              </div>
              <div className="space-y-1.5">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
              <div className="pt-2 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-7 w-20 bg-gray-100 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
