interface MarquesSkeletonProps {
  count?: number;
}

// Même gabarit que MarqueCard : nom, bénéficiaires, étiquettes
function MarqueSkeleton() {
  return (
    <div className="bg-white border border-primary-medium rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-sm animate-pulse">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-48" />
          <div className="flex flex-wrap md:gap-2 gap-1">
            <div className="h-4 bg-gray-100 rounded w-32 self-center" />
            <div className="h-5 bg-gray-200 w-20" />
          </div>
          <div className="flex flex-wrap md:gap-2 gap-1">
            <div className="h-4 bg-gray-100 rounded w-36 self-center" />
            <div className="h-5 bg-gray-100 w-28" />
            <div className="h-5 bg-gray-100 w-24" />
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded flex-shrink-0 ml-2" />
      </div>
    </div>
  );
}

export default function MarquesSkeleton({ count = 8 }: MarquesSkeletonProps) {
  return (
    <div className="grid gap-4 md:gap-6">
      {Array(count).fill(0).map((_, i) => (
        <MarqueSkeleton key={i} />
      ))}
    </div>
  );
}
