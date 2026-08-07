import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Hero Banner Skeleton */}
      <div className="h-44 rounded-3xl bg-muted/40 border border-border/50 animate-pulse p-8 space-y-4">
        <div className="h-6 w-48 bg-border/60 rounded-lg" />
        <div className="h-8 w-96 bg-border/60 rounded-xl" />
        <div className="h-4 w-2/3 bg-border/40 rounded-lg" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted/30 border border-border/40 animate-pulse p-4 space-y-2 text-center flex flex-col justify-center items-center">
            <div className="h-3 w-20 bg-border/60 rounded" />
            <div className="h-7 w-12 bg-border/80 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-3xl bg-muted/30 border border-border/40 animate-pulse p-6 space-y-3">
              <div className="flex justify-between">
                <div className="h-5 w-40 bg-border/60 rounded-md" />
                <div className="h-4 w-16 bg-border/40 rounded-full" />
              </div>
              <div className="h-4 w-full bg-border/40 rounded" />
              <div className="h-4 w-3/4 bg-border/40 rounded" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-64 rounded-3xl bg-muted/30 border border-border/40 animate-pulse p-6 space-y-4">
            <div className="h-5 w-32 bg-border/60 rounded-md" />
            <div className="h-10 w-full bg-border/40 rounded-xl" />
            <div className="h-10 w-full bg-border/40 rounded-xl" />
            <div className="h-10 w-full bg-border/40 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
