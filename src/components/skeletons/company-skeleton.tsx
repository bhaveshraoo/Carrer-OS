export function CompanySkeleton() {
  const cards = Array.from({ length: 6 });
  return (
    <div className="space-y-6">
      <div>
        <div className="skeleton h-8 w-56 rounded mb-2" />
        <div className="skeleton h-4 w-80 rounded" />
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap">
        {[80, 100, 70, 90, 60].map((w, i) => (
          <div key={i} className="skeleton h-8 rounded-full" style={{ width: `${w}px` }} />
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              animationDelay: `${i * 0.08}s`,
            }}
          >
            {/* Company logo + name */}
            <div className="flex items-center gap-3">
              <div className="skeleton size-12 rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="skeleton h-4 w-28 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
              <div className="skeleton h-5 w-14 rounded-full" />
            </div>

            {/* Rating + size */}
            <div className="flex gap-3">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>

            {/* Skill chips */}
            <div className="flex flex-wrap gap-1.5">
              {[48, 60, 40, 52].map((w, j) => (
                <div key={j} className="skeleton h-5 rounded-full" style={{ width: `${w}px` }} />
              ))}
            </div>

            {/* Bottom action */}
            <div className="skeleton h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="skeleton h-8 w-64 rounded mb-2" />
        <div className="skeleton h-4 w-80 rounded" />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-6 space-y-4"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <div className="skeleton size-10 rounded-full" />
            <div className="space-y-1.5">
              <div className="skeleton h-5 w-28 rounded" />
              <div className="skeleton h-3 w-40 rounded" />
            </div>
            <div className="skeleton h-9 w-32 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
