/**
 * DSA page skeleton — faux code lines that "type in" with blinking cursor.
 */
export function DsaSkeleton() {
  const lines = [
    { width: "60%", indent: 0 },
    { width: "40%", indent: 1 },
    { width: "75%", indent: 2 },
    { width: "50%", indent: 2 },
    { width: "45%", indent: 2 },
    { width: "35%", indent: 1 },
    { width: "55%", indent: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Sidebar + main grid */}
      <div className="flex gap-5">
        {/* Sidebar */}
        <div
          className="hidden sm:flex flex-col gap-2 w-44 shrink-0 rounded-xl p-4"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <div className="skeleton h-3 w-20 rounded mb-2" />
          {[100, 80, 90, 70, 85, 60, 75].map((w, i) => (
            <div key={i} className="skeleton h-6 rounded-lg" style={{ width: `${w}%` }} />
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-4">
          {/* Question header */}
          <div
            className="rounded-xl p-5"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="skeleton h-5 w-48 rounded" />
              <div className="flex gap-2">
                <div className="skeleton h-6 w-16 rounded-full" />
                <div className="skeleton h-6 w-20 rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-5/6 rounded" />
              <div className="skeleton h-3 w-4/6 rounded" />
            </div>
          </div>

          {/* Code block with typing animation */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            {/* Code header bar */}
            <div
              className="flex items-center gap-1.5 px-4 py-3 border-b"
              style={{ background: "var(--bg-surface-2)", borderColor: "var(--border)" }}
            >
              <div className="size-3 rounded-full bg-red-400 opacity-60" />
              <div className="size-3 rounded-full bg-amber-400 opacity-60" />
              <div className="size-3 rounded-full bg-teal-400 opacity-60" />
              <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>concept.pseudo</span>
            </div>

            {/* Code lines */}
            <div className="p-5 font-mono text-sm space-y-2">
              {lines.map((line, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2"
                  style={{ paddingLeft: `${line.indent * 20}px` }}
                >
                  <span className="text-xs w-5 shrink-0 text-right" style={{ color: "var(--text-muted)" }}>
                    {i + 1}
                  </span>
                  <div
                    className="skeleton h-4 rounded"
                    style={{
                      width: line.width,
                      animationDelay: `${i * 0.12}s`,
                    }}
                  />
                  {/* Show cursor on last line */}
                  {i === lines.length - 1 && (
                    <div
                      className="h-4 w-0.5 rounded"
                      style={{
                        background: "var(--orange)",
                        animation: "type-cursor 1s ease-in-out infinite",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* State panel */}
          <div
            className="rounded-xl p-4 grid grid-cols-3 gap-4"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <div className="skeleton h-3 w-12 rounded" />
            <div className="skeleton h-3 w-8 rounded" />
            <div className="skeleton h-3 w-6 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
