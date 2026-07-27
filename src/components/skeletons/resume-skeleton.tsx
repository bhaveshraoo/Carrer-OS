/**
 * Resume skeleton — shows a faux resume document with an orange
 * laser-scan line sweeping top-to-bottom while AI analyses.
 */
export function ResumeSkeleton() {
  return (
    <div className="space-y-6">
      {/* Score card skeleton */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Pulsing score ring */}
          <div className="shrink-0">
            <div
              className="size-36 rounded-full relative flex items-center justify-center"
              style={{
                background: "var(--bg-surface-2)",
                animation: "pulse-glow 2s ease-in-out infinite",
              }}
            >
              <div className="text-center">
                <div className="skeleton w-10 h-8 mx-auto rounded mb-1" />
                <div className="skeleton w-14 h-2 mx-auto rounded" />
              </div>
              {/* Ring outline */}
              <svg className="absolute inset-0 size-full" viewBox="0 0 144 144">
                <circle
                  cx="72" cy="72" r="62"
                  fill="none"
                  strokeWidth="10"
                  stroke="var(--border)"
                  strokeLinecap="round"
                />
                <circle
                  cx="72" cy="72" r="62"
                  fill="none"
                  strokeWidth="10"
                  strokeDasharray="390"
                  strokeDashoffset="100"
                  stroke="var(--orange)"
                  strokeLinecap="round"
                  opacity="0.3"
                  transform="rotate(-90 72 72)"
                />
              </svg>
            </div>
          </div>

          {/* Score bars */}
          <div className="flex-1 w-full space-y-4">
            {["ATS Score", "Recruiter", "HR Readability", "Industry Match"].map((label) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs w-28 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-surface-2)" }}>
                  <div className="skeleton h-full rounded-full" />
                </div>
                <span className="skeleton w-6 h-4 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Faux resume document with scanner */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        {/* Scanner line */}
        <div
          className="absolute left-0 right-0 h-0.5 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, var(--orange), transparent)",
            animation: "scan-line 2.2s ease-in-out infinite",
            boxShadow: "0 0 12px var(--orange)",
          }}
        />

        <div className="p-6 space-y-5">
          {/* Header section */}
          <div className="space-y-2">
            <div className="skeleton h-5 w-40 rounded" />
            <div className="skeleton h-3 w-56 rounded" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>

          <div className="h-px" style={{ background: "var(--border)" }} />

          {/* Experience section */}
          <div className="space-y-3">
            <div className="skeleton h-3 w-24 rounded" />
            {[80, 90, 70, 85].map((w, i) => (
              <div key={i} className="skeleton h-2.5 rounded" style={{ width: `${w}%` }} />
            ))}
          </div>

          <div className="h-px" style={{ background: "var(--border)" }} />

          {/* Skills section */}
          <div className="space-y-2">
            <div className="skeleton h-3 w-16 rounded" />
            <div className="flex flex-wrap gap-2">
              {[60, 80, 50, 70, 90, 45].map((w, i) => (
                <div key={i} className="skeleton h-6 rounded-full" style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>

          <div className="h-px" style={{ background: "var(--border)" }} />

          {/* Education */}
          <div className="space-y-2">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-2.5 w-3/4 rounded" />
            <div className="skeleton h-2.5 w-1/2 rounded" />
          </div>
        </div>

        {/* Analysing overlay text */}
        <div
          className="absolute bottom-0 left-0 right-0 py-3 text-center text-xs font-medium"
          style={{
            background: "linear-gradient(to top, var(--bg-surface), transparent)",
            color: "var(--orange)",
          }}
        >
          ✦ Analysing your resume with AI…
        </div>
      </div>
    </div>
  );
}
