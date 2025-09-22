interface MarquesSkeletonProps {
  count?: number;
}

function MarqueSkeleton() {
  return (
    <div className="bg-white border border-primary-medium rounded-3xl p-4 md:p-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Nom de la marque skeleton */}
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-48 mb-2 md:mb-0" />

          {/* Stats mobile skeleton */}
          <div className="flex flex-wrap gap-3 hidden mt-1">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-4 bg-gray-100 rounded w-28" />
          </div>
        </div>

        {/* Stats desktop skeleton */}
        <div className="hidden md:flex md:flex-row justify-end space-x-4">
          <div className="flex items-center">
            <div className="h-5 bg-gray-200 rounded w-8 mr-2" />
            <div className="h-4 bg-gray-100 rounded w-20" />
          </div>
          <div className="flex items-center">
            <div className="h-5 bg-gray-200 rounded w-8 mr-2" />
            <div className="h-4 bg-gray-100 rounded w-24" />
          </div>
        </div>
      </div>

      {/* Badges skeleton */}
      <div className="mb-4 space-y-2">
        {/* Bénéficiaires skeleton */}
        <div className="flex flex-wrap md:gap-2 gap-1">
          <div className="h-4 bg-gray-100 rounded w-32 self-center" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-24" />
        </div>

        {/* Catégories skeleton */}
        <div className="flex flex-wrap md:gap-2 gap-1">
          <div className="h-4 bg-gray-100 rounded w-36 self-center" />
          <div className="h-6 bg-gray-200 rounded-full w-28" />
          <div className="h-6 bg-gray-200 rounded-full w-32" />
          <div className="h-6 bg-gray-200 rounded-full w-24" />
        </div>
      </div>

      {/* Observer button skeleton */}
      <div className="pt-4 border-t border-neutral">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-gray-200 rounded mr-2" />
          <div className="h-5 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function MarquesSkeleton({ count = 8 }: MarquesSkeletonProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Liste skeleton */}
      <section className="section-padding bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-4 md:gap-6">
            {Array(count).fill(0).map((_, i) => (
              <MarqueSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}