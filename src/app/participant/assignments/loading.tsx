export default function AssignmentsLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-pulse">
      <div className="space-y-2 mb-6">
        <div className="h-6 w-32 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-44 bg-white border border-gray-100 rounded-2xl shadow-sm" />
        ))}
      </div>
    </div>
  );
}
