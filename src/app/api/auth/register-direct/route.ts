import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/register-direct
 * Creates or auto-confirms user with email_confirm: true bypassing confirmation emails completely.
 */
export async function POST(request: Request) {
  try {
    const { email, password, fullName, username } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const adminSupabase = createAdminClient();

    // List users to check if user already exists
    const { data: listData } = await adminSupabase.auth.admin.listUsers();
    const existingUser = (listData?.users ?? []).find(
      (u) => u.email?.toLowerCase() === cleanEmail
    );

    if (existingUser) {
      // Auto-confirm existing user so they can log in without email verification
      await adminSupabase.auth.admin.updateUserById(existingUser.id, {
        email_confirm: true,
        user_metadata: {
          ...existingUser.user_metadata,
          full_name: fullName || existingUser.user_metadata?.full_name,
          username: username || existingUser.user_metadata?.username,
        },
      });
      
      // Update password if provided
      if (password) {
        await adminSupabase.auth.admin.updateUserById(existingUser.id, {
          password,
        });
      }
    } else {
      // Create user pre-confirmed (email_confirm: true) with ZERO email sent
      const { error: createErr } = await adminSupabase.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName || cleanEmail.split("@")[0],
          username: username || cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_"),
        },
      });

      if (createErr) {
        return NextResponse.json({ success: false, error: createErr.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Account created and pre-confirmed successfully with zero email required.",
    });
  } catch (err: any) {
    console.error("POST /api/auth/register-direct error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process direct registration" },
      { status: 500 }
    );
  }
}
