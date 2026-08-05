import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { ResumeUploader } from "@/components/resume-uploader";
import { ResumeHistory } from "./resume-history";
import { ResumeIntelligenceTabs } from "@/components/resume/resume-intelligence-tabs";
import { UploadResumeModalButton } from "@/components/resume/upload-resume-modal-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { AlertTriangle, Wand2 } from "lucide-react";
import Link from "next/link";
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

  let analysis: { report: any } | null = null;
  if (latestResume?.status === "analyzed") {
    const { data: allAnalyses } = await table(supabase, "resume_analyses")
      .select("*")
      .eq("resume_id", latestResume.id);
    const latest = allAnalyses
      ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .at(0);
    if (latest) analysis = { report: latest.report };
  }

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

  const preSavedAuditData = analysis?.report?.gemini_ats_audit || null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Resume Intelligence</h1>
          <p className="text-xs text-secondary mt-1 flex items-center gap-2">
            <span className="font-medium text-orange-400">Active File:</span> {latestResume ? latestResume.file_name : "Upload a PDF or DOCX to get your score."}
          </p>
        </div>
        
        {/* ── HEADER ACTION BUTTONS ── */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <UploadResumeModalButton />
          <Link
            href="/dashboard/resume/rewrite"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs bg-orange-500 text-white hover:brightness-110 transition-all shadow-md shadow-orange-500/20 shrink-0"
          >
            <Wand2 className="size-4" /> AI Re-write Resume
          </Link>
        </div>
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

      {/* ── CLEAN TABBED RESUME WORKSPACE ── */}
      {latestResume?.status === "analyzed" && (
        <ResumeIntelligenceTabs
          preSavedAuditData={preSavedAuditData}
          analysisReport={analysis?.report as ResumeAnalysisReport}
        />
      )}

      <ResumeHistory items={historyItems} />
    </div>
  );
}
