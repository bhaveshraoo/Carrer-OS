"use client";

import { useState } from "react";
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
  Building2,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  Download,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Zap,
  X,
  Tag,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";
import { OWNER_EMAIL } from "../users/page";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: "Engineering" | "Product Management" | "Content & DSA" | "Operations" | "Mentorship";
  joiningDate: string;
  salaryMonthly: string;
  assignedProject: string;
  accessStatus: "Active" | "Suspended" | "Onboarding";
  permissions: {
    projectManager: boolean;
    attendanceTL: boolean;
    dsaCreator: boolean;
    companyCurator: boolean;
    offerDispatch: boolean;
    payrollLedger: boolean;
  };
}

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "emp-1",
    name: "Aarav Gupta",
    email: "aarav.gupta@careeros.app",
    phone: "+91 98765 43210",
    role: "Senior Engineering Lead & TL",
    department: "Engineering",
    joiningDate: "2025-11-15",
    salaryMonthly: "₹65,000 / mo",
    assignedProject: "Autonomous Code Refactoring Agent",
    accessStatus: "Active",
    permissions: {
      projectManager: true,
      attendanceTL: true,
      dsaCreator: false,
      companyCurator: false,
      offerDispatch: true,
      payrollLedger: false,
    },
  },
  {
    id: "emp-2",
    name: "Priya Sharma",
    email: "priya.sharma@careeros.app",
    phone: "+91 98123 45678",
    role: "Lead AI Architect & Mentor",
    department: "Mentorship",
    joiningDate: "2025-10-01",
    salaryMonthly: "₹85,000 / mo",
    assignedProject: "AI Voice-Powered Career Assistant",
    accessStatus: "Active",
    permissions: {
      projectManager: true,
      attendanceTL: true,
      dsaCreator: true,
      companyCurator: false,
      offerDispatch: false,
      payrollLedger: false,
    },
  },
  {
    id: "emp-3",
    name: "Karan Mehta",
    email: "karan.mehta@careeros.app",
    phone: "+91 97111 22334",
    role: "DSA Content Manager",
    department: "Content & DSA",
    joiningDate: "2026-01-10",
    salaryMonthly: "₹50,000 / mo",
    assignedProject: "CareerOS DSA Bank Engine",
    accessStatus: "Active",
    permissions: {
      projectManager: false,
      attendanceTL: false,
      dsaCreator: true,
      companyCurator: false,
      offerDispatch: false,
      payrollLedger: false,
    },
  },
  {
    id: "emp-4",
    name: "Sneha Patel",
    email: "sneha.patel@careeros.app",
    phone: "+91 96543 21098",
    role: "Company Intelligence Curator",
    department: "Operations",
    joiningDate: "2026-02-01",
    salaryMonthly: "₹45,000 / mo",
    assignedProject: "Target Companies Hiring Maps",
    accessStatus: "Active",
    permissions: {
      projectManager: false,
      attendanceTL: false,
      dsaCreator: false,
      companyCurator: true,
      offerDispatch: false,
      payrollLedger: false,
    },
  },
];

export default function AdminEmployeesPage() {
  const { notify } = useNotifications();
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmpForAccess, setSelectedEmpForAccess] = useState<Employee | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [role, setRole] = useState("Engineering Lead");
  const [department, setDepartment] = useState<Employee["department"]>("Engineering");
  const [salaryMonthly, setSalaryMonthly] = useState("₹50,000 / mo");
  const [assignedProject, setAssignedProject] = useState("Autonomous Code Refactoring Agent");

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === "All" || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // KPI Calculations
  const totalEmployees = employees.length;
  const activeAccessCount = employees.filter((e) => e.accessStatus === "Active").length;
  const engineeringCount = employees.filter((e) => e.department === "Engineering").length;
  const totalPayroll = "₹245,000 / month";

  function handleCreateEmployee(e: React.FormEvent) {
    e.preventDefault();
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name,
      email,
      phone,
      role,
      department,
      joiningDate: new Date().toISOString().split("T")[0],
      salaryMonthly,
      assignedProject,
      accessStatus: "Active",
      permissions: {
        projectManager: true,
        attendanceTL: true,
        dsaCreator: false,
        companyCurator: false,
        offerDispatch: false,
        payrollLedger: false,
      },
    };

    setEmployees([newEmp, ...employees]);
    setShowAddModal(false);

    notify({
      type: "success",
      icon: "👤",
      title: "Employee Added Successfully!",
      body: `Added ${name} (${role}) to CareerOS staff directory.`,
      autoDismiss: 4000,
    });
  }

  function toggleEmployeeAccessStatus(empId: string) {
    const targetEmp = employees.find((e) => e.id === empId);
    if (!targetEmp) return;
    const newStatus = targetEmp.accessStatus === "Active" ? "Suspended" : "Active";

    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, accessStatus: newStatus } : e))
    );

    notify({
      type: newStatus === "Active" ? "success" : "error",
      icon: newStatus === "Active" ? "🔓" : "🔒",
      title: `Access ${newStatus}`,
      body: `Employee access status updated to ${newStatus}.`,
      autoDismiss: 3000,
    });
  }

  function togglePermission(empId: string, permKey: keyof Employee["permissions"]) {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id !== empId) return e;
        const updatedPerms = { ...e.permissions, [permKey]: !e.permissions[permKey] };
        return { ...e, permissions: updatedPerms };
      })
    );

    notify({
      type: "info",
      icon: "🔑",
      title: "Access Permission Updated",
      body: "Updated permission matrix.",
      autoDismiss: 2000,
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
              <Users className="size-3.5 text-orange-500" /> CareerOS Staff & Employee Directory
            </div>
            <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
              Employee Management & Access Control
            </h1>
            <p className="text-xs text-secondary">
              Manage internal team members, Team Leaders, Mentors, grant system permissions, track payroll, and issue employee access credentials.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20 shrink-0 flex items-center gap-1.5"
          >
            <UserPlus className="size-4" /> Add New Employee
          </button>
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface p-5 rounded-3xl border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Total Staff</span>
            <Users className="size-4 text-orange-500" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">{totalEmployees} <span className="text-xs font-normal text-muted">Employees</span></p>
          <p className="text-[11px] text-teal-400 font-semibold">{engineeringCount} Engineering Leads</p>
        </div>

        <div className="surface p-5 rounded-3xl border border-teal-500/30 space-y-2 shadow-sm bg-teal-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Active System Access</span>
            <Key className="size-4 text-teal-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-teal-400">{activeAccessCount} / {totalEmployees}</p>
          <p className="text-[11px] text-muted">0 Suspended Accounts</p>
        </div>

        <div className="surface p-5 rounded-3xl border border-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Departments</span>
            <Briefcase className="size-4 text-amber-400" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">5 <span className="text-xs font-normal text-muted">Active Units</span></p>
          <p className="text-[11px] text-muted">Eng, PM, DSA, Ops, Mentorship</p>
        </div>

        <div className="surface p-5 rounded-3xl border border-orange-500/30 space-y-2 shadow-sm bg-orange-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Monthly Payroll</span>
            <DollarSign className="size-4 text-orange-500" />
          </div>
          <p className="font-display text-2xl font-extrabold text-primary">{totalPayroll}</p>
          <p className="text-[11px] text-teal-400 font-semibold">100% On-Time Dispatches</p>
        </div>
      </div>

      {/* SEARCH & DEPARTMENT FILTERS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="size-4 text-muted absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee by name, email, or role..."
              className="w-full h-10 pl-10 pr-4 rounded-2xl surface-2 border border-border text-xs text-primary focus:outline-none"
            />
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {["All", "Engineering", "Mentorship", "Content & DSA", "Operations"].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDept(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                  selectedDept === d
                    ? "bg-orange-500 text-white border-orange-500"
                    : "surface-2 text-secondary hover:text-primary border-border"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EMPLOYEES DIRECTORY CARDS */}
      <div className="space-y-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className={`surface rounded-3xl p-6 border space-y-4 shadow-sm transition-all text-xs ${
              emp.accessStatus === "Active" ? "border-border hover:border-orange-500/30" : "border-red-500/30 bg-red-500/5"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-primary">{emp.name}</h3>
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                    {emp.role}
                  </span>
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                    {emp.department}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-muted text-xs">
                  <span className="flex items-center gap-1"><Mail className="size-3 text-orange-500" /> {emp.email}</span>
                  <span className="flex items-center gap-1"><Phone className="size-3 text-teal-400" /> {emp.phone}</span>
                  <span className="flex items-center gap-1"><Calendar className="size-3 text-amber-400" /> Joined {emp.joiningDate}</span>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleEmployeeAccessStatus(emp.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5 ${
                    emp.accessStatus === "Active"
                      ? "bg-teal-500/20 text-teal-400 border-teal-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-teal-500/20 hover:text-teal-400"
                  }`}
                >
                  {emp.accessStatus === "Active" ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                  {emp.accessStatus === "Active" ? "Access Granted" : "Access Suspended"}
                </button>

                <button
                  onClick={() => setSelectedEmpForAccess(emp)}
                  className="px-3.5 py-1.5 rounded-xl font-bold surface-2 text-primary hover:bg-surface border border-border flex items-center gap-1.5"
                >
                  <Key className="size-3.5 text-orange-400" /> Permissions
                </button>
              </div>
            </div>

            {/* Project & Salary Info */}
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="surface-2 p-3.5 rounded-2xl border border-border space-y-1">
                <span className="font-bold text-muted text-[10px] uppercase tracking-wider block">Assigned Project / Unit</span>
                <p className="font-bold text-primary">{emp.assignedProject}</p>
              </div>

              <div className="surface-2 p-3.5 rounded-2xl border border-border space-y-1">
                <span className="font-bold text-muted text-[10px] uppercase tracking-wider block">Monthly Compensation</span>
                <p className="font-mono font-bold text-teal-400">{emp.salaryMonthly}</p>
              </div>
            </div>

            {/* Active Permissions Tags */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-muted">Granted System Modules:</span>
              {emp.permissions.projectManager && <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">Project Manager</span>}
              {emp.permissions.attendanceTL && <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">TL Attendance</span>}
              {emp.permissions.dsaCreator && <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">DSA Creator</span>}
              {emp.permissions.companyCurator && <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">Company Curator</span>}
              {emp.permissions.offerDispatch && <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Offer Dispatch</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ADD NEW EMPLOYEE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <UserPlus className="size-5 text-orange-500" /> Add New Staff Employee
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-primary">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="vikram@careeros.app"
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-primary">Department</label>
                  <select
                    value={department}
                    onChange={(e: any) => setDepartment(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Content & DSA">Content & DSA</option>
                    <option value="Operations">Operations</option>
                    <option value="Mentorship">Mentorship</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-primary">Monthly Compensation</label>
                  <input
                    type="text"
                    value={salaryMonthly}
                    onChange={(e) => setSalaryMonthly(e.target.value)}
                    required
                    className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Job Title & Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  placeholder="e.g. Senior Frontend Lead"
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-primary">Assigned SaaS Project / Unit</label>
                <input
                  type="text"
                  value={assignedProject}
                  onChange={(e) => setAssignedProject(e.target.value)}
                  required
                  className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl font-bold surface-2 border border-border text-secondary">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-md">
                  Add Employee & Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PERMISSIONS MATRIX MODAL */}
      {selectedEmpForAccess && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div className="surface border border-orange-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="space-y-0.5">
                <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                  <Key className="size-5 text-orange-500" /> Manage System Module Access
                </h3>
                <p className="text-xs text-muted">{selectedEmpForAccess.name} ({selectedEmpForAccess.role})</p>
              </div>
              <button onClick={() => setSelectedEmpForAccess(null)} className="text-xs text-muted font-bold px-2 py-1 surface-2 rounded-lg">
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-secondary font-semibold pb-1">Toggle Granted System Modules:</p>
              {[
                { key: "projectManager" as const, label: "🚀 Project Manager (Publish SaaS Projects)" },
                { key: "attendanceTL" as const, label: "🛡️ TL Attendance & Applicant Review" },
                { key: "dsaCreator" as const, label: "💻 DSA Question & PYQ Creator" },
                { key: "companyCurator" as const, label: "🏢 Target Company Intelligence Curator" },
                { key: "offerDispatch" as const, label: "📜 PDF Offer Letter Dispatch" },
              ].map((item) => {
                const isEnabled = selectedEmpForAccess.permissions[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      togglePermission(selectedEmpForAccess.id, item.key);
                      setSelectedEmpForAccess((prev) =>
                        prev
                          ? {
                              ...prev,
                              permissions: {
                                ...prev.permissions,
                                [item.key]: !prev.permissions[item.key],
                              },
                            }
                          : null
                      );
                    }}
                    className={`w-full p-3 rounded-2xl font-bold transition-all border text-left flex items-center justify-between ${
                      isEnabled
                        ? "bg-teal-500/15 text-teal-400 border-teal-500/40 shadow-sm"
                        : "surface-2 text-secondary border-border hover:border-orange-500/30"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isEnabled ? <CheckCircle2 className="size-4 text-teal-400" /> : <Lock className="size-4 text-muted" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setSelectedEmpForAccess(null)} className="px-5 py-2 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-md">
                Save Permission Matrix
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
