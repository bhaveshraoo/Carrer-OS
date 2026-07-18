import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { ResumeReport } from "@/components/resume-report";
import { formatDate } from "@/lib/format";
import { ArrowLeft } from "lucide-react";
import type { ResumeAnalysisReport } from "@/lib/resume/types";

export default async function PastResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: resume } = await table(supabase, "resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id) // RLS also enforces this — belt-and-suspenders
    .single();

  if (!resume) {
    notFound();
  }

  const { data: allAnalyses } = await table(supabase, "resume_analyses")
    .select("*")
    .eq("resume_id", id);
  const analysis = allAnalyses
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .at(0);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/resume"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900 mb-3"
        >
          <ArrowLeft className="size-4" /> Back to current resume
        </Link>
        <h1 className="font-display text-3xl font-semibold text-navy-900">{resume.file_name}</h1>
        <p className="text-slate-500 mt-1">
          Uploaded {formatDate(resume.created_at)}
        </p>
      </div>

      {analysis ? (
        <ResumeReport report={analysis.report as ResumeAnalysisReport} />
      ) : (
        <p className="text-sm text-slate-500">
          This upload doesn&apos;t have a completed analysis (status: {resume.status}).
        </p>
      )}
    </div>
  );
}
