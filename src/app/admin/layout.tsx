"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Rocket,
  FileCheck,
  Award,
  DollarSign,
  Users,
  ArrowLeft,
  Crown,
  Code2,
  Building2,
  BarChart3,
  Bell,
  Calendar,
  Tag,
  Lock,
  UserCheck,
  GraduationCap,
  ChevronRight,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Admin Overview", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "System Analytics Hub", icon: BarChart3 },
  { href: "/admin/interns", label: "Active Interns Roster", icon: GraduationCap },
  { href: "/admin/employees", label: "Employee Directory & Access", icon: Users },
  { href: "/admin/projects", label: "Project Manager", icon: Rocket },
  { href: "/admin/applications", label: "Applications & Offers", icon: FileCheck },
  { href: "/admin/sprints", label: "Sprint Evaluator", icon: Calendar },
  { href: "/admin/dsa", label: "DSA Questions Manager", icon: Code2 },
  { href: "/admin/companies", label: "Company Info Curator", icon: Building2 },
  { href: "/admin/certificates", label: "Certificates & LORs", icon: Award },
  { href: "/admin/revenue", label: "Revenue Ledger (5%)", icon: DollarSign },
  { href: "/admin/broadcast", label: "Cohort Broadcasts", icon: Bell },
  { href: "/admin/coupons", label: "Promo Coupons", icon: Tag },
  { href: "/admin/users", label: "Owner Tag Manager", icon: Crown },
  { href: "/admin/audit", label: "Security Audit Trail", icon: Lock },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* ── ADMIN TOP HEADER BAR ── */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Left Logo & Admin Badge */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="font-display text-xl font-bold flex items-center gap-1.5">
              Career<span className="text-orange-500">OS</span>
            </Link>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
              <Crown className="size-3.5 text-amber-400" /> Owner Control Center
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-bold surface-2 px-3.5 py-1.5 rounded-xl border border-border hover:border-orange-500/40 transition-colors flex items-center gap-1 text-secondary"
            >
              <ArrowLeft className="size-3.5" /> Back to Dashboard
            </Link>

            <ThemeToggle />

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-border text-xs">
              <div className="size-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                👑
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-bold text-primary leading-none">Bhavesh Rao</p>
                <p className="text-[10px] text-amber-400 font-mono pt-0.5">bhaveshy9654@gmail.com (Owner)</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ADMIN BODY ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid md:grid-cols-12 gap-6">

        {/* Left Admin Sidebar Navigation */}
        <aside className="md:col-span-3 space-y-4">
          <div className="surface border border-border rounded-3xl p-4 space-y-1 shadow-md">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider px-3 py-2">
              Management Suite
            </p>
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "text-secondary hover:text-primary hover:bg-surface-2"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="size-3.5" />}
                </Link>
              );
            })}
          </div>

          {/* System Status */}
          <div className="surface-2 border border-border rounded-3xl p-4 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-teal-400 font-bold">
              <span className="flex items-center gap-1"><Zap className="size-3.5" /> Active Interns</span>
              <span>24 Interns</span>
            </div>
            <p className="text-[11px] text-muted font-mono">96% Avg Attendance Rate</p>
          </div>
        </aside>

        {/* Main Admin Page Content */}
        <main className="md:col-span-9 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
