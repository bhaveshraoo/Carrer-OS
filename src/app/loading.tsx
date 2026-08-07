import { Loader2, Sparkles } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-6 max-w-2xl mx-auto animate-fade-in text-center">
      {/* Animated Glowing Logo / Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="absolute size-24 rounded-full bg-orange-500/20 animate-ping" />
        <div className="relative size-16 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/30">
          <Loader2 className="size-8 text-white animate-spin" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-xl font-extrabold text-foreground flex items-center justify-center gap-2">
          <Sparkles className="size-5 text-orange-500 animate-pulse" /> Loading CareerOS...
        </h2>
        <p className="text-xs text-muted-foreground font-medium max-w-md">
          Fetching live engineering data, AI models, and real-time placement statistics.
        </p>
      </div>

      {/* Skeleton Cards Grid Preview */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted/40 border border-border/40 animate-pulse p-4 space-y-3">
            <div className="h-4 w-2/3 bg-border/60 rounded-md" />
            <div className="h-3 w-full bg-border/40 rounded-md" />
            <div className="h-3 w-1/2 bg-border/40 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
