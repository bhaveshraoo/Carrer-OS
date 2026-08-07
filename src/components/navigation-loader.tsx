"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Turn off loading on route change completion
  useEffect(() => {
    setIsLoading(false);
    setProgress(100);
    const timer = setTimeout(() => setProgress(0), 300);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Intercept click on <a> links to show instant YouTube-style loader
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("#") &&
        target.target !== "_blank" &&
        href !== pathname
      ) {
        setIsLoading(true);
        setProgress(30);

        // Animate progress smoothly
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 85) {
              clearInterval(interval);
              return 85;
            }
            return prev + Math.random() * 15;
          });
        }, 150);

        setTimeout(() => clearInterval(interval), 3000);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [pathname]);

  if (!isLoading && progress === 0) return null;

  return (
    <>
      {/* YouTube-style Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[999999] h-1 bg-transparent overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-teal-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(249,115,22,0.8)]"
          style={{
            width: `${progress}%`,
            opacity: progress === 100 ? 0 : 1,
          }}
        />
      </div>

      {/* Top Right Floating Spinner Indicator */}
      {isLoading && (
        <div className="fixed top-3 right-3 z-[999999] flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/40 text-orange-400 text-xs font-bold shadow-2xl backdrop-blur-md animate-fade-in">
          <Loader2 className="size-4 animate-spin text-orange-500" />
          <span>Loading page…</span>
        </div>
      )}
    </>
  );
}
