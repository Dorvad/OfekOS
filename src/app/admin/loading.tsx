export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-14 bg-white border-b border-gray-200" />
      <div className="h-12 bg-white border-b border-gray-100" />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white border border-gray-100 rounded-2xl shadow-sm" />
          ))}
        </div>
        <div className="h-64 bg-white border border-gray-100 rounded-2xl shadow-sm" />
        <div className="h-48 bg-white border border-gray-100 rounded-2xl shadow-sm" />
      </div>
    </div>
  );
}
