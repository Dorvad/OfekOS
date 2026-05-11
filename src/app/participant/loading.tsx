export default function ParticipantLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 animate-pulse">
      {/* Welcome skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-40 bg-gray-200 rounded-lg" />
        <div className="h-4 w-56 bg-gray-100 rounded-lg" />
      </div>
      {/* Hero card skeleton */}
      <div className="h-36 bg-gray-200 rounded-2xl" />
      {/* Journey card skeleton */}
      <div className="h-28 bg-white border border-gray-100 rounded-2xl shadow-sm" />
      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 bg-white border border-gray-100 rounded-2xl shadow-sm" />
        <div className="h-20 bg-white border border-gray-100 rounded-2xl shadow-sm" />
      </div>
    </div>
  );
}
