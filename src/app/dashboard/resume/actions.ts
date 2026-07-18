"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";

export async function deleteResume(
  resumeId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: resume, error: fetchError } = await table(supabase, "resumes")
    .select("*")
    .eq("id", resumeId)
    .eq("user_id", user.id) // belt-and-suspenders alongside RLS
    .single();

  if (fetchError || !resume) {
    return { success: false, error: "Resume not found" };
  }

  // Storage file first — if this fails we still remove the DB row rather than
  // leave an undeletable entry stuck in the list.
  await supabase.storage.from("resumes").remove([resume.storage_path]);

  // resume_analyses rows cascade-delete automatically (FK ON DELETE CASCADE).
  const { error: deleteError } = await table(supabase, "resumes").delete().eq("id", resumeId);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  revalidatePath("/dashboard/resume");
  return { success: true };
}
