export default function AssignmentDetailLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-5 animate-pulse">
      {/* Phase tracker */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-200" />
            {i < 4 && <div className="w-8 h-0.5 bg-gray-100" />}
          </div>
        ))}
      </div>
      {/* Header card */}
      <div className="h-28 bg-gray-100 rounded-2xl mb-4" />
      {/* Tool area */}
      <div className="h-64 bg-gray-100 rounded-2xl mb-4" />
      <div className="h-12 bg-gray-100 rounded-2xl" />
    </div>
  );
}
