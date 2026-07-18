import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center max-w-sm">
        <p className="font-display text-5xl font-semibold text-navy-900 mb-3">404</p>
        <h1 className="font-medium text-navy-900 mb-2">Page not found</h1>
        <p className="text-slate-500 text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist or moved.
        </p>
        <Button variant="primary" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
