import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  addCustomJobToStore,
  getAccumulatedStoreJobs,
  purgeJobFromStore,
} from "@/lib/jobs/job-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobs = getAccumulatedStoreJobs();
    return NextResponse.json({ success: true, jobs, count: jobs.length });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch admin jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.company_name || !body.role) {
      return NextResponse.json(
        { success: false, error: "Company name and job role are required" },
        { status: 400 }
      );
    }

    const compSlug = (body.company_name || "company")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    const compId = body.company_id || `comp-${compSlug}`;
    const jobId = body.id || `job-manual-${Date.now()}`;
    const nowISO = new Date().toISOString();

    const newJobRecord = {
      id: jobId,
      company_id: compId,
      company_name: body.company_name,
      company_slug: compSlug,
      company_logo_url: body.company_logo_url || null,
      company_tier: body.company_tier || "Product Tier 1",
      role: body.role,
      description:
        body.description ||
        `📌 JOB OVERVIEW\n${body.company_name} is hiring a ${body.role} (${body.domain || "Software Engineering"}) in ${body.location || "India"}.\n\n🎯 LOCATION: ${body.location || "India"}\n💼 CTC PACKAGE: ${body.ctc_range || "₹18L - ₹30L PA"}`,
      domain: body.domain || "Software Engineering",
      location: body.location || "Bangalore, Karnataka",
      ctc_range: body.ctc_range || "₹18L - ₹30L PA",
      tech_stack: Array.isArray(body.tech_stack) ? body.tech_stack : [],
      interview_types: Array.isArray(body.interview_types) ? body.interview_types : [],
      application_url: body.application_url || "https://careers.google.com",
      last_date: body.last_date || new Date(Date.now() + 30 * 86400000).toISOString(),
      status: "active" as const,
      created_at: body.created_at || nowISO,
    };

    // 1. Add to In-Memory Store
    const addedJob = addCustomJobToStore(newJobRecord);

    // 2. Best-effort Supabase DB sync
    try {
      const supabase = await createClient();
      await (supabase as any).from("companies").upsert(
        {
          id: compId,
          name: body.company_name,
          slug: compSlug,
          metadata: { tier: "Product Tier 1", verified: true, manual_added: true },
        },
        { onConflict: "slug" }
      );

      await (supabase as any).from("jobs").insert({
        id: jobId,
        company_id: compId,
        role: body.role,
        description: addedJob.description,
        domain: addedJob.domain,
        location: addedJob.location,
        ctc_range: addedJob.ctc_range,
        tech_stack: addedJob.tech_stack,
        interview_types: addedJob.interview_types,
        application_url: addedJob.application_url,
        last_date: addedJob.last_date,
        status: "active",
        created_at: addedJob.created_at,
      });
    } catch (dbErr) {
      console.warn("Best-effort Supabase insert warning (falling back to store):", dbErr);
    }

    return NextResponse.json({ success: true, job: addedJob });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to add job" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("id");

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Missing job id parameter" },
        { status: 400 }
      );
    }

    // 1. Purge from store
    purgeJobFromStore(jobId);

    // 2. Best-effort Supabase DB purge
    try {
      const supabase = await createClient();
      await supabase.from("jobs").delete().eq("id", jobId);
    } catch (dbErr) {
      console.warn("Best-effort Supabase delete warning:", dbErr);
    }

    return NextResponse.json({ success: true, id: jobId });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to purge job" },
      { status: 500 }
    );
  }
}
