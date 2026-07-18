import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { checkResumeRateLimit } from "@/lib/resume/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Day 5 (upload) — stores the file in Supabase Storage and creates the `resumes` row.
 * Parsing/scoring happens separately in /api/resume/analyze so upload feels instant
 * and the (slower) AI pipeline can show its own loading state.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rateLimit = await checkResumeRateLimit(supabase, user.id);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: rateLimit.error }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedExt = ["pdf", "docx"];
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  if (!allowedExt.includes(ext)) {
    return NextResponse.json(
      { error: "Please upload a PDF or DOCX file." },
      { status: 400 }
    );
  }

  const MAX_SIZE = 8 * 1024 * 1024; // 8MB — generous for a resume, cheap to enforce
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File is too large. Please upload a file under 8MB." },
      { status: 400 }
    );
  }

  const storagePath = `${user.id}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(storagePath, file, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: resume, error: dbError } = await table(supabase, "resumes")
    .insert({
      user_id: user.id,
      storage_path: storagePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type || null,
      status: "uploaded",
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ resume });
}
