import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { ResumeUploader } from "@/components/resume-uploader";
import { ResumeReport } from "@/components/resume-report";
import { ResumeHistory } from "./resume-history";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import type { ResumeAnalysisReport } from "@/lib/resume/types";

export default async function ResumePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // All resumes for this user, newest first
  const { data: allResumes } = await table(supabase, "resumes")
    .select("*")
    .eq("user_id", user.id);
  const sortedResumes =
    allResumes?.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ) ?? [];
  const latestResume = sortedResumes.at(0);
  const olderResumes = sortedResumes.slice(1);

  let analysis: { report: ResumeAnalysisReport } | null = null;
  if (latestResume?.status === "analyzed") {
    const { data: allAnalyses } = await table(supabase, "resume_analyses")
      .select("*")
      .eq("resume_id", latestResume.id);
    const latest = allAnalyses
      ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .at(0);
    if (latest) analysis = { report: latest.report as ResumeAnalysisReport };
  }

  // Scores for the history list — one query per older resume would be N+1; fine at
  // this scale (a handful of resumes per user), revisit with a join if that changes.
  const historyItems = await Promise.all(
    olderResumes.map(async (r) => {
      let resumeScore: number | null = null;
      if (r.status === "analyzed") {
        const { data: analyses } = await table(supabase, "resume_analyses")
          .select("*")
          .eq("resume_id", r.id);
        resumeScore =
          analyses?.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0]?.resume_score ?? null;
      }
      return {
        id: r.id,
        file_name: r.file_name,
        created_at: r.created_at,
        status: r.status,
        resume_score: resumeScore,
      };
    })
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy-900">Resume</h1>
        <p className="text-slate-500 mt-1">
          {latestResume ? latestResume.file_name : "Upload a PDF or DOCX to get your score."}
        </p>
      </div>

      {!latestResume && <ResumeUploader />}

      {latestResume?.status === "error" && (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center gap-3 py-6">
            <AlertTriangle className="size-8 text-amber-500" />
            <p className="font-medium text-navy-900">We couldn&apos;t analyze that file</p>
            <p className="text-sm text-slate-500 max-w-sm">
              This usually means the file was a scanned image rather than text-based, or the
              upload was interrupted. Try exporting it directly as a PDF and upload again.
            </p>
            <div className="pt-2 w-full">
              <ResumeUploader />
            </div>
          </CardContent>
        </Card>
      )}

      {(latestResume?.status === "uploaded" || latestResume?.status === "parsed") && (
        <Card>
          <CardContent className="pt-6 text-center py-10 text-slate-500 text-sm">
            Still processing — refresh in a few seconds if this doesn&apos;t update on its own.
          </CardContent>
        </Card>
      )}

      {analysis && (
        <>
          <ResumeReport report={analysis.report} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload a new version</CardTitle>
              <CardDescription>Replaces your current score with a fresh analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeUploader />
            </CardContent>
          </Card>
        </>
      )}

      <ResumeHistory items={historyItems} />
    </div>
  );
}
