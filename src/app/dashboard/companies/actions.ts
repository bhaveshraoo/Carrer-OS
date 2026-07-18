"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";

export async function toggleCompanyTarget(
  companyId: string,
  isCurrentlyTargeted: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  if (isCurrentlyTargeted) {
    const { error } = await table(supabase, "user_company_targets")
      .delete()
      .eq("user_id", user.id)
      .eq("company_id", companyId);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await table(supabase, "user_company_targets").insert({
      user_id: user.id,
      company_id: companyId,
    });
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/companies");
  revalidatePath("/dashboard/prep");
  revalidatePath("/dashboard");
  return { success: true };
}
