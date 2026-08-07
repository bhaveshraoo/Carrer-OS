export default function InterviewLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-4">
      <div className="h-44 rounded-3xl bg-muted/40 border border-border/50 animate-pulse p-8 space-y-3">
        <div className="h-5 w-40 bg-border/60 rounded-full" />
        <div className="h-8 w-80 bg-border/70 rounded-xl" />
        <div className="h-4 w-2/3 bg-border/40 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-3xl bg-muted/30 border border-border/40 animate-pulse p-5 space-y-3">
            <div className="size-8 rounded-xl bg-border/60" />
            <div className="h-4 w-3/4 bg-border/70 rounded-md" />
            <div className="h-3 w-full bg-border/40 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
