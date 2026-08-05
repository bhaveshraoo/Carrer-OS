import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import { AdminUserAccount, BOSS_ACCOUNT, DEFAULT_DEMO_EMPLOYEES } from "@/lib/admin-auth";

const DB_FILE_PATH = path.join(process.cwd(), ".gemini", "admin_users_db.json");

// Local File Backup Helper
function readAdminUsersFromFile(): AdminUserAccount[] {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE_PATH)) {
      const initial = [BOSS_ACCOUNT, ...DEFAULT_DEMO_EMPLOYEES];
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }

    const data = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const parsed: AdminUserAccount[] = JSON.parse(data);

    if (!parsed.some((u) => u.email.trim().toLowerCase() === BOSS_ACCOUNT.email.toLowerCase())) {
      parsed.unshift(BOSS_ACCOUNT);
    }
    return parsed;
  } catch (err) {
    return [BOSS_ACCOUNT, ...DEFAULT_DEMO_EMPLOYEES];
  }
}

function writeAdminUsersToFile(users: AdminUserAccount[]) {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let cleanUsers = [...users];
    if (!cleanUsers.some((u) => u.email.trim().toLowerCase() === BOSS_ACCOUNT.email.toLowerCase())) {
      cleanUsers.unshift(BOSS_ACCOUNT);
    }

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(cleanUsers, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing admin_users_db.json:", err);
  }
}

// GET /api/admin/employees -> Sync from Supabase table `admin_accounts`
export async function GET() {
  let users: AdminUserAccount[] = readAdminUsersFromFile();

  try {
    const supabase = await createClient();
    // Try fetching from Supabase table admin_accounts
    const { data, error } = await (supabase.from("admin_accounts") as any).select("*");
    if (!error && data && data.length > 0) {
      const supabaseUsers: AdminUserAccount[] = data.map((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        passcode: row.passcode,
        isBoss: row.is_boss || row.email.toLowerCase() === BOSS_ACCOUNT.email.toLowerCase(),
        role: row.role || "Staff Member",
        department: row.department || "Operations",
        allowedSectionIds: row.allowed_section_ids || ["overview", "dsa"],
        createdAt: row.created_at || new Date().toISOString(),
      }));

      if (!supabaseUsers.some((u) => u.email.toLowerCase() === BOSS_ACCOUNT.email.toLowerCase())) {
        supabaseUsers.unshift(BOSS_ACCOUNT);
      }

      users = supabaseUsers;
      writeAdminUsersToFile(users);
    }
  } catch (err) {
    console.warn("Supabase admin_accounts fetch notice:", err);
  }

  return NextResponse.json({ success: true, users });
}

// POST /api/admin/employees -> Sync create/delete/update to Supabase Database
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, employee, empId, sectionId } = body;

    let users = readAdminUsersFromFile();

    if (action === "create") {
      const cleanEmail = (employee.email || "").trim().toLowerCase();
      const cleanPasscode = (employee.passcode || "").trim();

      if (!cleanEmail || !cleanPasscode) {
        return NextResponse.json({ success: false, error: "Email and Passcode required" }, { status: 400 });
      }

      const newEmpRecord: AdminUserAccount = {
        ...employee,
        id: employee.id || `emp-${Date.now()}`,
        email: cleanEmail,
        passcode: cleanPasscode,
        createdAt: new Date().toISOString(),
      };

      const existingIndex = users.findIndex((u) => u.email.trim().toLowerCase() === cleanEmail);
      if (existingIndex >= 0) {
        users[existingIndex] = newEmpRecord;
      } else {
        users.unshift(newEmpRecord);
      }

      writeAdminUsersToFile(users);

      // Upsert into Supabase admin_accounts table
      try {
        const supabase = await createClient();
        await (supabase.from("admin_accounts") as any).upsert({
          id: newEmpRecord.id,
          name: newEmpRecord.name,
          email: cleanEmail,
          passcode: cleanPasscode,
          is_boss: newEmpRecord.isBoss,
          role: newEmpRecord.role,
          department: newEmpRecord.department,
          allowed_section_ids: newEmpRecord.allowedSectionIds,
          created_at: newEmpRecord.createdAt,
        });
      } catch (sbErr) {
        console.warn("Supabase admin_accounts upsert notice:", sbErr);
      }

      return NextResponse.json({ success: true, users });
    }

    if (action === "delete") {
      if (empId) {
        users = users.filter((u) => u.id !== empId && !u.isBoss);
        writeAdminUsersToFile(users);

        try {
          const supabase = await createClient();
          await (supabase.from("admin_accounts") as any).delete().eq("id", empId);
        } catch (sbErr) {
          console.warn("Supabase admin_accounts delete notice:", sbErr);
        }
      }
      return NextResponse.json({ success: true, users });
    }

    if (action === "toggle_permission") {
      users = users.map((u) => {
        if (u.id !== empId || u.isBoss) return u;
        const isAllowed = u.allowedSectionIds.includes(sectionId);
        const newSections = isAllowed
          ? u.allowedSectionIds.filter((id) => id !== sectionId)
          : [...u.allowedSectionIds, sectionId];
        return { ...u, allowedSectionIds: newSections };
      });

      writeAdminUsersToFile(users);

      const target = users.find((u) => u.id === empId);
      if (target) {
        try {
          const supabase = await createClient();
          await (supabase.from("admin_accounts") as any)
            .update({ allowed_section_ids: target.allowedSectionIds })
            .eq("id", empId);
        } catch (sbErr) {
          console.warn("Supabase admin_accounts update notice:", sbErr);
        }
      }

      return NextResponse.json({ success: true, users });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("API /admin/employees error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
