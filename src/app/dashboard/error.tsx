"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

// Dashboard-scoped error boundary — keeps the nav visible (this renders inside the
// dashboard layout) instead of blowing away the whole app shell on one bad request.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto text-center py-16">
      <AlertTriangle className="size-10 text-amber-500 mx-auto mb-4" />
      <h1 className="font-display text-xl font-semibold text-navy-900 mb-2">
        Something went wrong loading this page
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Your data is fine — this was just a hiccup loading it. Try again.
      </p>
      <Button variant="primary" onClick={reset}>Try again</Button>
    </div>
  );
}
