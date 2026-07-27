"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";

export interface UpdateProfileResult {
  success: boolean;
  error?: string;
}

export async function updateProfile(formData: FormData): Promise<UpdateProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const fullName = (formData.get("fullName") as string)?.trim();
  const username = (formData.get("username") as string)?.trim();

  if (username) {
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return {
        success: false,
        error: "Username must be 3-20 characters: letters, numbers, underscores only.",
      };
    }

    // Explicit case-insensitive uniqueness check against all registered users
    const { data: existingUsers } = await table(supabase, "users").select("id, username");
    const isTaken = existingUsers?.some(
      (u) => u.id !== user.id && u.username && u.username.toLowerCase() === username.toLowerCase()
    );

    if (isTaken) {
      return {
        success: false,
        error: `Username "@${username}" is already taken by another user. Please choose a unique username.`,
      };
    }
  }

  const { error } = await table(supabase, "users")
    .update({ full_name: fullName || null, username: username || null })
    .eq("id", user.id);

  if (error) {
    if (error.message.toLowerCase().includes("duplicate") || error.message.toLowerCase().includes("unique")) {
      return { success: false, error: "That username is already taken — try another one." };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
