"use client";

import { useTheme } from "@/components/theme-provider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`relative size-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${className}`}
      style={{
        background: theme === "dark" ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.10)",
        border: "1px solid rgba(249,115,22,0.25)",
      }}
    >
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: theme === "dark" ? 1 : 0,
          transform: theme === "dark" ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
        }}
      >
        <Moon className="size-4" style={{ color: "var(--orange)" }} />
      </span>
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: theme === "light" ? 1 : 0,
          transform: theme === "light" ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0)",
        }}
      >
        <Sun className="size-4" style={{ color: "var(--orange)" }} />
      </span>
    </button>
  );
}
