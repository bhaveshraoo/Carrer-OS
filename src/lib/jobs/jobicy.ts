import { isIndianLocation } from "./india-filter";
import { enrichJobWithAi } from "./enrich-job";
import type { JobWithCompany } from "./jobs";

export interface JobicyPostRaw {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  jobCategory?: string;
  jobType?: string;
  pubDate: string;
  jobGeo?: string;
  annualSalaryMin?: string;
  annualSalaryMax?: string;
  jobExcerpt?: string;
}

export async function fetchAndEnrichJobicyJobs(limit = 15): Promise<JobWithCompany[]> {
  try {
    const res = await fetch("https://jobicy.com/api/v2/remote-jobs?count=25", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Jobicy API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const rawJobs: JobicyPostRaw[] = data.jobs || [];
    const enrichedList: JobWithCompany[] = [];

    for (const raw of rawJobs) {
      if (enrichedList.length >= limit) break;

      const location = raw.jobGeo || "Worldwide (Remote)";

      const companySlug = raw.companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const aiData = await enrichJobWithAi({
        title: raw.jobTitle,
        company_name: raw.companyName,
        description: raw.jobExcerpt || raw.jobTitle,
        category: raw.jobCategory || "Software Development",
      });

      const formattedDescription = `📌 JOB OVERVIEW
${aiData.summary}

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Seniority Level: ${aiData.seniority}
• Education: ${aiData.education}
• Experience: ${aiData.experience}
• Work Type: ${raw.jobType || "Full-Time"} (${aiData.work_mode})

🚀 KEY RESPONSIBILITIES
${aiData.responsibilities.map((r) => `• ${r}`).join("\n")}

💡 REQUIRED TECHNICAL SKILLS & STACK
${aiData.skills.map((s) => `• ${s}`).join("\n")}

🏆 SELECTION & INTERVIEW PROCESS
${aiData.interview_types.map((type, idx) => `${idx + 1}. ${type}`).join("\n")}

🎁 PERKS & BENEFITS
${aiData.benefits.map((b) => `• ${b}`).join("\n")}`;

      const ctcRange =
        raw.annualSalaryMin && raw.annualSalaryMax
          ? `$${raw.annualSalaryMin} - $${raw.annualSalaryMax} PA`
          : "₹18L - ₹35L PA";

      const pubDate = raw.pubDate ? new Date(raw.pubDate) : new Date();
      const lastDate = new Date(pubDate.getTime() + 30 * 86400000).toISOString();

      enrichedList.push({
        id: `jobicy-${raw.id}`,
        company_id: `comp-${companySlug}`,
        company_name: raw.companyName.trim(),
        company_slug: companySlug,
        company_logo_url: raw.companyLogo || null,
        company_tier: "Product Tier 1",
        role: raw.jobTitle.trim(),
        description: formattedDescription,
        domain: aiData.ai_category || "Software Engineering",
        location: location.trim(),
        ctc_range: ctcRange,
        tech_stack: aiData.tech_stack,
        interview_types: aiData.interview_types,
        application_url: raw.url,
        last_date: lastDate,
        status: "active",
        created_at: pubDate.toISOString(),
      });
    }

    return enrichedList;
  } catch (err) {
    console.error("Error fetching Jobicy live tech jobs:", err);
    return [];
  }
}
