import {
  LayoutDashboard,
  BarChart3,
  GraduationCap,
  Users,
  Rocket,
  FileCheck,
  Calendar,
  Code2,
  Building2,
  Award,
  DollarSign,
  Bell,
  Tag,
  Crown,
  Lock,
} from "lucide-react";

export interface AdminSectionItem {
  id: string;
  href: string;
  label: string;
  icon: any;
  bossOnly?: boolean;
}

export const ALL_ADMIN_SECTIONS: AdminSectionItem[] = [
  { id: "overview", href: "/admin", label: "Admin Overview", icon: LayoutDashboard },
  { id: "analytics", href: "/admin/analytics", label: "System Analytics Hub", icon: BarChart3 },
  { id: "interns", href: "/admin/interns", label: "Active Interns Roster", icon: GraduationCap },
  { id: "employees", href: "/admin/employees", label: "Employee Directory & Access", icon: Users, bossOnly: true },
  { id: "projects", href: "/admin/projects", label: "Project Manager", icon: Rocket },
  { id: "applications", href: "/admin/applications", label: "Applications & Offers", icon: FileCheck },
  { id: "sprints", href: "/admin/sprints", label: "Sprint Evaluator", icon: Calendar },
  { id: "dsa", href: "/admin/dsa", label: "DSA Questions Manager", icon: Code2 },
  { id: "companies", href: "/admin/companies", label: "Company Info Curator", icon: Building2 },
  { id: "certificates", href: "/admin/certificates", label: "Certificates & LORs", icon: Award },
  { id: "revenue", href: "/admin/revenue", label: "Revenue Ledger (5%)", icon: DollarSign, bossOnly: true },
  { id: "broadcast", href: "/admin/broadcast", label: "Cohort Broadcasts", icon: Bell },
  { id: "coupons", href: "/admin/coupons", label: "Promo Coupons", icon: Tag },
  { id: "users", href: "/admin/users", label: "Owner Tag Manager", icon: Crown, bossOnly: true },
  { id: "audit", href: "/admin/audit", label: "Security Audit Trail", icon: Lock },
];

export interface AdminUserAccount {
  id: string;
  name: string;
  email: string;
  passcode: string;
  isBoss: boolean;
  role: string;
  department: string;
  allowedSectionIds: string[];
  createdAt: string;
}

export const BOSS_EMAIL = "bhaveshy9654@gmail.com";
export const BOSS_PASSCODE = "raobhaw@5678";

export const BOSS_ACCOUNT: AdminUserAccount = {
  id: "boss-001",
  name: "Bhavesh Rao (Boss)",
  email: BOSS_EMAIL,
  passcode: BOSS_PASSCODE,
  isBoss: true,
  role: "Boss / Platform Owner",
  department: "Executive",
  allowedSectionIds: ALL_ADMIN_SECTIONS.map((s) => s.id),
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const DEFAULT_DEMO_EMPLOYEES: AdminUserAccount[] = [
  {
    id: "emp-demo-1",
    name: "Aarav Gupta",
    email: "aarav@careeros.app",
    passcode: "aarav123",
    isBoss: false,
    role: "Senior Engineering Lead",
    department: "Engineering",
    allowedSectionIds: ["overview", "dsa", "projects", "sprints", "applications"],
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "emp-demo-2",
    name: "Priya Sharma",
    email: "priya@careeros.app",
    passcode: "priya123",
    isBoss: false,
    role: "DSA Content Manager",
    department: "Content & DSA",
    allowedSectionIds: ["overview", "dsa", "companies", "certificates"],
    createdAt: "2026-01-15T00:00:00.000Z",
  },
];

/** Get all registered admin users, cross-browser resilient */
export function getStoredAdminUsers(): AdminUserAccount[] {
  if (typeof window === "undefined") return [BOSS_ACCOUNT, ...DEFAULT_DEMO_EMPLOYEES];
  try {
    const saved = localStorage.getItem("careeros_admin_users");
    let usersList: AdminUserAccount[] = saved ? JSON.parse(saved) : [];

    // Ensure Boss account is always present
    if (!usersList.some((u) => u.email.trim().toLowerCase() === BOSS_EMAIL.toLowerCase())) {
      usersList.unshift(BOSS_ACCOUNT);
    }

    // Ensure Demo accounts are present
    DEFAULT_DEMO_EMPLOYEES.forEach((demo) => {
      if (!usersList.some((u) => u.email.trim().toLowerCase() === demo.email.toLowerCase())) {
        usersList.push(demo);
      }
    });

    return usersList;
  } catch (e) {
    return [BOSS_ACCOUNT, ...DEFAULT_DEMO_EMPLOYEES];
  }
}

/** Save updated admin users list */
export function saveAdminUsers(users: AdminUserAccount[]): void {
  if (typeof window === "undefined") return;
  let cleanUsers = [...users];
  if (!cleanUsers.some((u) => u.email.trim().toLowerCase() === BOSS_EMAIL.toLowerCase())) {
    cleanUsers.unshift(BOSS_ACCOUNT);
  }
  localStorage.setItem("careeros_admin_users", JSON.stringify(cleanUsers));
  window.dispatchEvent(new Event("careeros_admin_users_updated"));
}

/** Async server-synced authentication across Chrome, Safari, Firefox, Edge, & Mobile */
export async function authenticateAdminCredentialsAsync(
  emailInput: string,
  passcodeInput: string
): Promise<AdminUserAccount | null> {
  const cleanEmail = (emailInput || "").trim().toLowerCase();
  const cleanPasscode = (passcodeInput || "").trim();

  if (!cleanEmail || !cleanPasscode) return null;

  // 1. Direct Boss match
  if (cleanEmail === BOSS_EMAIL.toLowerCase() && cleanPasscode === BOSS_PASSCODE) {
    return BOSS_ACCOUNT;
  }

  // 2. Direct Demo Employees match
  const demoMatch = DEFAULT_DEMO_EMPLOYEES.find(
    (u) =>
      u.email.trim().toLowerCase() === cleanEmail &&
      u.passcode.trim() === cleanPasscode
  );
  if (demoMatch) return demoMatch;

  // 3. Server API check (cross-browser persistent)
  try {
    const res = await fetch("/api/admin/employees");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        saveAdminUsers(data.users);
        const serverMatch = data.users.find(
          (u: AdminUserAccount) =>
            u.email.trim().toLowerCase() === cleanEmail &&
            u.passcode.trim() === cleanPasscode
        );
        if (serverMatch) return serverMatch;
      }
    }
  } catch (e) {
    console.error("Server auth check fallback error", e);
  }

  // 4. Local storage fallback
  const users = getStoredAdminUsers();
  const found = users.find(
    (u) =>
      u.email.trim().toLowerCase() === cleanEmail &&
      u.passcode.trim() === cleanPasscode
  );

  return found || null;
}

export function authenticateAdminCredentials(
  emailInput: string,
  passcodeInput: string
): AdminUserAccount | null {
  const cleanEmail = (emailInput || "").trim().toLowerCase();
  const cleanPasscode = (passcodeInput || "").trim();

  if (!cleanEmail || !cleanPasscode) return null;

  if (cleanEmail === BOSS_EMAIL.toLowerCase() && cleanPasscode === BOSS_PASSCODE) {
    return BOSS_ACCOUNT;
  }

  const users = getStoredAdminUsers();
  const found = users.find(
    (u) =>
      u.email.trim().toLowerCase() === cleanEmail &&
      u.passcode.trim() === cleanPasscode
  );

  return found || null;
}
