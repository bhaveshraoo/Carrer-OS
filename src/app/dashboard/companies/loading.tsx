export default function CompaniesLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-4">
      <div className="h-44 rounded-3xl bg-muted/40 border border-border/50 animate-pulse p-8 space-y-3">
        <div className="h-5 w-36 bg-border/60 rounded-full" />
        <div className="h-8 w-80 bg-border/70 rounded-xl" />
        <div className="h-4 w-2/3 bg-border/40 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 rounded-3xl bg-muted/30 border border-border/40 animate-pulse p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="size-12 rounded-2xl bg-border/60" />
              <div className="h-4 w-20 bg-border/40 rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-border/70 rounded-md" />
            <div className="h-3 w-full bg-border/40 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
