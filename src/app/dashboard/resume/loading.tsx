export default function ResumeLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in py-4">
      <div className="h-44 rounded-3xl bg-muted/40 border border-border/50 animate-pulse p-8 space-y-3">
        <div className="h-5 w-36 bg-border/60 rounded-full" />
        <div className="h-8 w-80 bg-border/70 rounded-xl" />
        <div className="h-4 w-2/3 bg-border/40 rounded-lg" />
      </div>

      <div className="h-64 rounded-3xl bg-muted/30 border border-border/40 animate-pulse p-8 flex flex-col items-center justify-center space-y-4">
        <div className="size-16 rounded-full bg-border/60" />
        <div className="h-5 w-48 bg-border/70 rounded-md" />
        <div className="h-4 w-80 bg-border/40 rounded-md" />
      </div>
    </div>
  );
}
