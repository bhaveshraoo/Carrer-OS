"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Code2,
  User,
  LogOut,
  Rocket,
  Compass,
  Briefcase,
  Video,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { BrandLogo } from "@/components/brand-logo";

const navLinks = [
  { href: "/dashboard",          label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/jobs",     label: "Job Portal",icon: Briefcase },
  { href: "/dashboard/roadmaps", label: "Roadmaps",  icon: Compass },
  { href: "/dashboard/resume",   label: "Resume",    icon: FileText },
  { href: "/dashboard/interview",label: "AI Interview", icon: Video },
  { href: "/dashboard/companies",label: "Companies", icon: Building2 },
  { href: "/dashboard/prep",     label: "DSA Prep",  icon: Code2 },
  { href: "/dashboard/projects", label: "Projects & Internships", icon: Rocket },
];

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function DashboardNav({
  displayName,
  email,
}: {
  displayName: string;
  email: string;
}) {
  const pathname = usePathname();
  const router   = useRouter();

  // 🚀 Auto-prefetch Job Portal & Companies routes on Dashboard load for 0ms instant tab navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      router.prefetch("/dashboard/jobs");
      router.prefetch("/dashboard/companies");
      try {
        fetch("/api/jobs", { cache: "force-cache" }).catch(() => {});
      } catch {
        // Ignore background prefetch errors
      }
    }
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* ── Desktop / Top nav ── */}
      <header
        className="sticky top-0 z-40 glass"
        style={{
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto max-w-[1550px] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo + Nav links */}
          <div className="flex items-center gap-4 lg:gap-6">
            <BrandLogo href="/dashboard" size="md" className="-ml-1 shrink-0" />

            <nav className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar">
              {navLinks.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      isActive ? "font-semibold" : "hover:opacity-80"
                    }`}
                    style={
                      isActive
                        ? {
                            background: "var(--orange-glow)",
                            color: "var(--orange)",
                            border: "1px solid rgba(249,115,22,0.2)",
                          }
                        : {
                            color: "var(--text-secondary)",
                            background: "transparent",
                            border: "1px solid transparent",
                          }
                    }
                  >
                    <link.icon className="size-4 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 ml-1"
                  style={{ "--tw-ring-color": "var(--orange)" } as React.CSSProperties}
                >
                  <span
                    className="size-9 rounded-full text-xs font-bold flex items-center justify-center transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, var(--orange) 0%, #fb923c 100%)",
                      color: "#fff",
                      boxShadow: "0 2px 8px rgba(249,115,22,0.35)",
                    }}
                  >
                    {initials(displayName || email)}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {displayName}
                  </p>
                  <p className="font-normal truncate text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="size-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/projects/leaderboard">
                    <Rocket className="size-4" /> Leaderboard & Badges
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} style={{ color: "var(--red)" }}>
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bottom-nav-safe"
        style={{
          background: "var(--glass-bg)",
          borderTop: "1px solid var(--border)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          paddingBottom: "env(safe-area-inset-bottom, 4px)",
        }}
      >
        {navLinks.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-0.5 px-2 pt-2 pb-1 min-w-[48px] transition-all duration-200"
              style={{ color: isActive ? "var(--orange)" : "var(--text-muted)" }}
            >
              <span
                className="relative flex items-center justify-center size-9 rounded-xl transition-all duration-200"
                style={
                  isActive
                    ? { background: "var(--orange-glow)", transform: "scale(1.05)" }
                    : {}
                }
              >
                <link.icon className="size-4" />
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full"
                    style={{ background: "var(--orange)" }}
                  />
                )}
              </span>
              <span className="text-[9px] font-medium truncate max-w-[64px]">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile bottom spacer so content doesn't hide behind tab bar */}
      <div className="md:hidden h-20" />
    </>
  );
}
