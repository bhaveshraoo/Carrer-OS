export default function RoadmapsLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Header Banner Skeleton */}
      <div className="h-44 rounded-3xl bg-muted/40 border border-border/50 animate-pulse p-8 space-y-3">
        <div className="h-5 w-40 bg-border/60 rounded-full" />
        <div className="h-8 w-80 bg-border/70 rounded-xl" />
        <div className="h-4 w-2/3 bg-border/40 rounded-lg" />
      </div>

      {/* Roadmaps Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 rounded-3xl bg-muted/30 border border-border/40 animate-pulse p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 bg-border/60 rounded-full" />
                <div className="h-4 w-14 bg-border/40 rounded-full" />
              </div>
              <div className="h-5 w-3/4 bg-border/70 rounded-md" />
              <div className="h-2 w-full bg-border/40 rounded-full mt-2" />
            </div>

            <div className="pt-3 border-t border-border/40 flex justify-between items-center">
              <div className="h-3 w-28 bg-border/40 rounded" />
              <div className="h-4 w-20 bg-border/60 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
