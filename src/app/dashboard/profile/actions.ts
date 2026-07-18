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

  if (username && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return {
      success: false,
      error: "Username must be 3-20 characters: letters, numbers, underscores only.",
    };
  }

  const { error } = await table(supabase, "users")
    .update({ full_name: fullName || null, username: username || null })
    .eq("id", user.id);

  if (error) {
    if (error.message.toLowerCase().includes("duplicate")) {
      return { success: false, error: "That username is already taken — try another one." };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard"); // nav shows displayName, derived from this data
  return { success: true };
}
