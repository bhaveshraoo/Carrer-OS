"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Lock,
  Key,
  Crown,
  Briefcase,
  DollarSign,
  Plus,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Zap,
  X,
  Sliders,
  Check,
  ShieldAlert,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";
import {
  ALL_ADMIN_SECTIONS,
  AdminUserAccount,
  BOSS_EMAIL,
  getStoredAdminUsers,
  saveAdminUsers,
} from "@/lib/admin-auth";

export default function AdminEmployeesPage() {
  const { notify } = useNotifications();
  const [employees, setEmployees] = useState<AdminUserAccount[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [isBossUser, setIsBossUser] = useState<boolean>(false);

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmpForAccess, setSelectedEmpForAccess] = useState<AdminUserAccount | null>(null);

  // Add Employee Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [role, setRole] = useState("DSA Content Manager");
  const [department, setDepartment] = useState("Content & DSA");
  const [allowedSections, setAllowedSections] = useState<string[]>(["dsa", "overview"]);

  // Sync users list on mount & when updated
  useEffect(() => {
    const loadUsers = async () => {
      const localUsers = getStoredAdminUsers();
      setEmployees(localUsers);

      try {
        const res = await fetch("/api/admin/employees");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.users)) {
            setEmployees(data.users);
            saveAdminUsers(data.users);
          }
        }
      } catch (e) {
        console.error("Error loading server employees", e);
      }

      const savedEmail = sessionStorage.getItem("careeros_admin_email") || localStorage.getItem("careeros_admin_email");
      if (savedEmail) {
        setCurrentUserEmail(savedEmail);
        setIsBossUser(savedEmail.toLowerCase() === BOSS_EMAIL.toLowerCase());
      }
    };

    loadUsers();
    window.addEventListener("careeros_admin_users_updated", loadUsers);
    return () => window.removeEventListener("careeros_admin_users_updated", loadUsers);
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    return (
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isBossUser) {
      notify({
        type: "error",
        icon: "⛔",
        title: "Permission Denied",
        body: "Only Boss (bhaveshy9654@gmail.com) can create new employee accounts.",
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPasscode = passcode.trim();

    if (!cleanEmail || !cleanPasscode) {
      notify({
        type: "warning",
        icon: "⚠️",
        title: "Missing Fields",
        body: "Employee Email and Admin Passcode are required.",
      });
      return;
    }

    if (employees.some((e) => e.email.toLowerCase() === cleanEmail)) {
      notify({
        type: "error",
        icon: "⚠️",
        title: "Email Already Registered",
        body: "An admin account with this email already exists.",
      });
      return;
    }

    const newEmp: AdminUserAccount = {
      id: `emp-${Date.now()}`,
      name: name || "Staff Employee",
      email: cleanEmail,
      passcode: cleanPasscode,
      isBoss: false,
      role: role || "Staff Member",
      department: department || "Operations",
      allowedSectionIds: allowedSections,
      createdAt: new Date().toISOString(),
    };

    const currentUsers = getStoredAdminUsers();
    const updated = [newEmp, ...currentUsers.filter((u) => u.email.toLowerCase() !== cleanEmail)];
    saveAdminUsers(updated);
    setEmployees(updated);

    // Sync to Server API so Chrome & all browsers receive this new employee
    try {
      await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", employee: newEmp }),
      });
    } catch (err) {
      console.error("Error syncing employee to server", err);
    }

    setShowAddModal(false);
    resetForm();

    notify({
      type: "success",
      icon: "👤",
      title: "Employee Account Created & Synced!",
      body: `Created admin login for ${cleanEmail} (Passcode: ${cleanPasscode}) with ${allowedSections.length} granted sections. Available on all browsers!`,
      autoDismiss: 5000,
    });
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPasscode("");
    setRole("DSA Content Manager");
    setDepartment("Content & DSA");
    setAllowedSections(["dsa", "overview"]);
  };

  const handleDeleteEmployee = async (empId: string) => {
    if (!isBossUser) return;
    const target = employees.find((e) => e.id === empId);
    if (target?.isBoss) {
      notify({
        type: "error",
        icon: "⛔",
        title: "Action Denied",
        body: "Boss account cannot be deleted.",
      });
      return;
    }

    const updated = employees.filter((e) => e.id !== empId);
    saveAdminUsers(updated);
    setEmployees(updated);

    try {
      await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", empId }),
      });
    } catch (err) {
      console.error("Error deleting employee from server", err);
    }

    notify({
      type: "info",
      icon: "🗑️",
      title: "Employee Removed",
      body: "Employee admin login and permissions revoked.",
    });
  };

  const toggleSectionPermission = async (empId: string, sectionId: string) => {
    if (!isBossUser) return;
    const updated = employees.map((emp) => {
      if (emp.id !== empId) return emp;
      const isAllowed = emp.allowedSectionIds.includes(sectionId);
      const newSections = isAllowed
        ? emp.allowedSectionIds.filter((id) => id !== sectionId)
        : [...emp.allowedSectionIds, sectionId];
      return { ...emp, allowedSectionIds: newSections };
    });

    saveAdminUsers(updated);
    setEmployees(updated);

    try {
      await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_permission", empId, sectionId }),
      });
    } catch (err) {
      console.error("Error toggling permission on server", err);
    }

    if (selectedEmpForAccess && selectedEmpForAccess.id === empId) {
      const isAllowed = selectedEmpForAccess.allowedSectionIds.includes(sectionId);
      const newSections = isAllowed
        ? selectedEmpForAccess.allowedSectionIds.filter((id) => id !== sectionId)
        : [...selectedEmpForAccess.allowedSectionIds, sectionId];
      setSelectedEmpForAccess({ ...selectedEmpForAccess, allowedSectionIds: newSections });
    }
  };

  const toggleFormSection = (sectionId: string) => {
    if (allowedSections.includes(sectionId)) {
      setAllowedSections(allowedSections.filter((id) => id !== sectionId));
    } else {
      setAllowedSections([...allowedSections, sectionId]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
              <Crown className="size-3.5 text-amber-400" /> Boss Control Panel — Staff Access Management
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              Employee Directory &amp; Section Access Control
            </h1>
            <p className="text-xs text-secondary max-w-2xl">
              Only Boss (<strong className="text-amber-400 font-bold">bhaveshy9654@gmail.com</strong>) can create new Employee Admin IDs and select which specific sections of the Admin Page each employee is permitted to open.
            </p>
          </div>

          {isBossUser && (
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="px-6 py-3.5 rounded-2xl font-extrabold text-xs bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 shrink-0 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <UserPlus className="size-4" /> Add New Employee
            </button>
          )}
        </div>
      </div>

      {!isBossUser && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="size-5 text-amber-400 shrink-0" />
          <span>Note: You are logged in as a Staff Member. Only Boss (bhaveshy9654@gmail.com) can create new employee accounts and alter section permissions.</span>
        </div>
      )}

      {/* SEARCH & METRICS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="size-4 text-muted absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees by name, email, or role..."
            className="w-full h-10 pl-10 pr-4 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none"
          />
        </div>

        <span className="text-xs font-mono font-bold px-3.5 py-2 rounded-2xl surface-2 border border-border text-muted">
          {employees.length} Registered Admin Users
        </span>
      </div>

      {/* EMPLOYEES LIST CARDS */}
      <div className="space-y-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className={`surface rounded-3xl p-6 border space-y-4 shadow-sm transition-all text-xs ${
              emp.isBoss ? "border-amber-500/50 bg-amber-500/5" : "border-border hover:border-orange-500/30"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-base text-primary flex items-center gap-1.5">
                    {emp.name}
                    {emp.isBoss && <Crown className="size-4 text-amber-400 fill-amber-400/20" />}
                  </h3>

                  {emp.isBoss ? (
                    <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      👑 BOSS / OWNER (FULL ACCESS)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                      Staff Member ({emp.department})
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-muted text-xs">
                  <span className="flex items-center gap-1"><Mail className="size-3 text-orange-500" /> {emp.email}</span>
                  <span className="flex items-center gap-1"><Key className="size-3 text-amber-400" /> Passcode: {emp.isBoss ? "••••••••" : emp.passcode}</span>
                  <span className="flex items-center gap-1"><Calendar className="size-3 text-teal-400" /> Created {new Date(emp.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedEmpForAccess(emp)}
                  className="px-4 py-2 rounded-xl font-extrabold surface-2 text-primary hover:border-orange-500/40 border border-border flex items-center gap-1.5 transition-all"
                >
                  <Sliders className="size-3.5 text-orange-400" /> {emp.isBoss ? "View Sections" : "Manage Section Permissions"}
                </button>

                {isBossUser && !emp.isBoss && (
                  <button
                    onClick={() => handleDeleteEmployee(emp.id)}
                    className="p-2.5 rounded-xl surface text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all"
                    title="Revoke & Delete Employee Account"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Allowed Sections Badges */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                Allowed Admin Sections ({emp.isBoss ? "All 15 Sections" : `${emp.allowedSectionIds.length} Sections`}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ALL_ADMIN_SECTIONS.map((sec) => {
                  const isAllowed = emp.isBoss || emp.allowedSectionIds.includes(sec.id);
                  if (!isAllowed) return null;
                  return (
                    <span
                      key={sec.id}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                        emp.isBoss
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                          : "bg-teal-500/10 text-teal-300 border-teal-500/20"
                      }`}
                    >
                      <Check className="size-3" /> {sec.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREATE EMPLOYEE MODAL (BOSS ONLY) ── */}
      {showAddModal && isBossUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-up">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Boss Action
                </span>
                <h3 className="font-display text-xl font-extrabold text-primary flex items-center gap-2">
                  <UserPlus className="size-5 text-orange-500" /> Create New Employee Admin ID
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="size-8 rounded-xl surface-2 border border-border text-muted flex items-center justify-center">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Employee Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Aarav Gupta"
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  >
                    <option value="Content & DSA">Content &amp; DSA</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Operations">Operations</option>
                    <option value="Mentorship">Mentorship</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Admin Email ID (Separate from Website ID) *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="aarav@careeros.app"
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Employee Admin Passcode *</label>
                  <div className="relative">
                    <input
                      type={showPasscode ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      required
                      placeholder="Assign passcode..."
                      className="w-full h-10 pl-3.5 pr-9 rounded-xl surface-2 border border-border text-xs font-mono text-amber-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
                    >
                      {showPasscode ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Role / Job Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. DSA Content Manager"
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              {/* Allowed Admin Sections Checklist */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="font-extrabold text-orange-400 uppercase tracking-wider block">
                  Select Allowed Admin Sections (Check which sections employee can open):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {ALL_ADMIN_SECTIONS.map((sec) => {
                    const isChecked = allowedSections.includes(sec.id);
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => toggleFormSection(sec.id)}
                        className={`p-2.5 rounded-xl font-bold transition-all border text-left flex items-center justify-between ${
                          isChecked
                            ? "bg-teal-500/15 text-teal-300 border-teal-500/40"
                            : "surface-2 text-muted border-border hover:text-secondary"
                        }`}
                      >
                        <span className="truncate">{sec.label}</span>
                        {isChecked ? <CheckCircle2 className="size-4 text-teal-400 shrink-0" /> : <Lock className="size-3.5 text-muted shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl font-extrabold bg-orange-500 text-white hover:brightness-110 shadow-md">
                  Create Employee &amp; Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SECTION PERMISSIONS MATRIX MODAL ── */}
      {selectedEmpForAccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-up">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="space-y-0.5">
                <h3 className="font-display text-lg font-extrabold text-primary flex items-center gap-2">
                  <Sliders className="size-5 text-orange-500" /> Section Access Permissions
                </h3>
                <p className="text-xs text-muted">{selectedEmpForAccess.name} ({selectedEmpForAccess.email})</p>
              </div>
              <button onClick={() => setSelectedEmpForAccess(null)} className="size-8 rounded-xl surface-2 border border-border text-muted flex items-center justify-center">
                <X className="size-4" />
              </button>
            </div>

            {selectedEmpForAccess.isBoss ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                <p className="font-extrabold flex items-center gap-1.5"><Crown className="size-4 text-amber-400" /> Boss / Owner Account</p>
                <p className="text-secondary">Boss account has unrestricted access to all 15 Admin Sections.</p>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <p className="text-secondary font-extrabold pb-1">
                  {isBossUser ? "Click any section to grant or revoke employee access:" : "View Granted Admin Sections:"}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {ALL_ADMIN_SECTIONS.map((sec) => {
                    const isAllowed = selectedEmpForAccess.allowedSectionIds.includes(sec.id);
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        disabled={!isBossUser}
                        onClick={() => toggleSectionPermission(selectedEmpForAccess.id, sec.id)}
                        className={`p-3 rounded-xl font-bold transition-all border text-left flex items-center justify-between ${
                          isAllowed
                            ? "bg-teal-500/15 text-teal-300 border-teal-500/40 shadow-sm"
                            : "surface-2 text-muted border-border hover:border-orange-500/30"
                        }`}
                      >
                        <span className="truncate">{sec.label}</span>
                        {isAllowed ? <CheckCircle2 className="size-4 text-teal-400 shrink-0" /> : <Lock className="size-3.5 text-muted shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end border-t border-border">
              <button onClick={() => setSelectedEmpForAccess(null)} className="px-6 py-2.5 rounded-xl font-extrabold bg-orange-500 text-white hover:brightness-110 shadow-md">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
