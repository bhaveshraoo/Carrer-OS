export default function ProjectsLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-4">
      <div className="h-44 rounded-3xl bg-muted/40 border border-border/50 animate-pulse p-8 space-y-3">
        <div className="h-5 w-44 bg-border/60 rounded-full" />
        <div className="h-8 w-96 bg-border/70 rounded-xl" />
        <div className="h-4 w-2/3 bg-border/40 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-56 rounded-3xl bg-muted/30 border border-border/40 animate-pulse p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-border/60 rounded-full" />
                <div className="h-4 w-16 bg-border/40 rounded-full" />
              </div>
              <div className="h-6 w-5/6 bg-border/70 rounded-md" />
              <div className="h-3 w-full bg-border/40 rounded-md" />
            </div>

            <div className="pt-3 border-t border-border/40 flex justify-between items-center">
              <div className="h-4 w-24 bg-border/50 rounded" />
              <div className="h-8 w-28 bg-border/60 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
