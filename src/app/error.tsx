"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

// Catches any unhandled runtime error in the app (outside /dashboard, which has
// its own error.tsx with a "back to dashboard" link instead of "back home").
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center max-w-sm">
        <AlertTriangle className="size-10 text-amber-500 mx-auto mb-4" />
        <h1 className="font-display text-2xl font-semibold text-navy-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          That&apos;s on us, not you. Try again, or head back home if it keeps happening.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="primary" onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
