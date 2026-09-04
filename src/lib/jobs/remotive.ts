import { isIndianLocation } from "./india-filter";
import { enrichJobWithAi } from "./enrich-job";
import type { JobWithCompany } from "./jobs";

export interface RemotiveJobRaw {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

export async function fetchAndEnrichRemotiveJobs(limit = 15): Promise<JobWithCompany[]> {
  try {
    const res = await fetch("https://remotive.com/api/remote-jobs?category=software-dev", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Remotive API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const rawJobs: RemotiveJobRaw[] = (data.jobs || []).slice(0, limit);

    // Parallel AI Enrichment for 10x faster execution
    const enrichedList = await Promise.all(
      rawJobs.map(async (raw) => {
        try {
          const location = raw.candidate_required_location || "Worldwide (Remote)";

          if (!isIndianLocation(location)) return null;

          const companySlug = raw.company_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          const aiData = await enrichJobWithAi({
            title: raw.title,
            company_name: raw.company_name,
            description: raw.description,
            category: raw.category,
            tags: raw.tags,
          });

          const formattedDescription = `📌 JOB OVERVIEW
${aiData.summary}

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Seniority Level: ${aiData.seniority}
• Education: ${aiData.education}
• Experience: ${aiData.experience}
• Work Type: ${aiData.employment_type} (${aiData.work_mode})

🚀 KEY RESPONSIBILITIES
${aiData.responsibilities.map((r) => `• ${r}`).join("\n")}

💡 REQUIRED TECHNICAL SKILLS & STACK
${aiData.skills.map((s) => `• ${s}`).join("\n")}

🏆 SELECTION & INTERVIEW PROCESS
${aiData.interview_types.map((type, idx) => `${idx + 1}. ${type}`).join("\n")}

🎁 PERKS & BENEFITS
${aiData.benefits.map((b) => `• ${b}`).join("\n")}`;

          const ctcRange = raw.salary && raw.salary.trim() ? raw.salary : "$70,000 - $130,000 PA";
          const pubDate = new Date(raw.publication_date);
          const lastDate = new Date(pubDate.getTime() + 30 * 86400000).toISOString();

          return {
            id: `remotive-${raw.id}`,
            company_id: `comp-${companySlug}`,
            company_name: raw.company_name.trim(),
            company_slug: companySlug,
            company_logo_url: raw.company_logo || null,
            company_tier: "Product Tier 1",
            role: raw.title.trim(),
            description: formattedDescription,
            domain: aiData.ai_category || "Software Engineering",
            location: location.trim(),
            ctc_range: ctcRange,
            tech_stack: aiData.tech_stack.length > 0 ? aiData.tech_stack : (raw.tags || ["TypeScript", "React", "Node.js"]),
            interview_types: aiData.interview_types,
            application_url: raw.url,
            last_date: lastDate,
            status: "active" as const,
            created_at: pubDate.toISOString(),
          };
        } catch {
          return null;
        }
      })
    );

    return enrichedList.filter(Boolean) as JobWithCompany[];
  } catch (err) {
    console.error("Error fetching Remotive live jobs:", err);
    return [];
  }
}
