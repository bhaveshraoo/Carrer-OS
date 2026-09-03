import { isIndianLocation } from "./india-filter";
import { enrichJobWithAi } from "./enrich-job";
import type { JobWithCompany } from "./jobs";

export interface GreenhouseJobRaw {
  id: number;
  title: string;
  absolute_url: string;
  updated_at: string;
  location?: {
    name?: string;
  };
  content?: string;
}

const GREENHOUSE_INDIA_COMPANIES = [
  { slug: "phonepe", name: "PhonePe", tier: "Fintech Tier 1" },
  { slug: "atlassian", name: "Atlassian", tier: "Product Tech Giant" },
  { slug: "rubrik", name: "Rubrik", tier: "Cloud Data Tier 1" },
  { slug: "databricks", name: "Databricks", tier: "AI & Data Tier 1" },
  { slug: "uber", name: "Uber", tier: "Tech Giant" },
  { slug: "adobe", name: "Adobe", tier: "Tech Giant" },
  { slug: "intuit", name: "Intuit", tier: "Fintech Tier 1" },
  { slug: "stripe", name: "Stripe", tier: "Fintech Tier 1" },
  { slug: "freshworks", name: "Freshworks", tier: "SaaS Unicorn" },
  { slug: "chargebee", name: "Chargebee", tier: "Fintech SaaS" },
  { slug: "nutanix", name: "Nutanix", tier: "Cloud Infrastructure" },
  { slug: "mongodb", name: "MongoDB", tier: "Database Systems" },
  { slug: "cloudflare", name: "Cloudflare", tier: "Security & Cloud" },
  { slug: "coinbase", name: "Coinbase", tier: "Fintech Web3" },
  { slug: "roblox", name: "Roblox", tier: "Gaming & AI" },
  { slug: "elastic", name: "Elastic", tier: "Search Systems" },
  { slug: "snowflake", name: "Snowflake", tier: "Data Cloud" },
  { slug: "gitlab", name: "GitLab", tier: "DevTools Tier 1" },
];

export async function fetchAndEnrichGreenhouseJobs(limit = 15): Promise<JobWithCompany[]> {
  const companyJobsMap: Map<string, JobWithCompany[]> = new Map();

  // Parallel fetch across all Greenhouse companies with 2s timeout
  await Promise.all(
    GREENHOUSE_INDIA_COMPANIES.map(async (comp) => {
      try {
        const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${comp.slug}/jobs?content=true`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
          },
          signal: AbortSignal.timeout(2000),
          cache: "no-store",
        });

        if (!res.ok) return;
        const data = await res.json();
        const jobs: GreenhouseJobRaw[] = data.jobs || [];

        const compJobs: JobWithCompany[] = [];

        for (const gJob of jobs) {
          if (compJobs.length >= 2) break;

          const location = gJob.location?.name || "India (Remote / Hybrid)";
          if (!isIndianLocation(location)) continue;

          const rawContent = gJob.content || gJob.title;

          const aiData = await enrichJobWithAi({
            title: gJob.title,
            company_name: comp.name,
            description: rawContent,
            category: "Software Engineering",
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

          const updatedDate = gJob.updated_at ? new Date(gJob.updated_at).toISOString() : new Date().toISOString();
          const lastDate = new Date(Date.now() + 30 * 86400000).toISOString();

          compJobs.push({
            id: `greenhouse-${gJob.id}`,
            company_id: `comp-${comp.slug}`,
            company_name: comp.name,
            company_slug: comp.slug,
            company_logo_url: null,
            company_tier: comp.tier,
            role: gJob.title.trim(),
            description: formattedDescription,
            domain: aiData.ai_category || "Software Engineering",
            location: location.trim(),
            ctc_range: "₹24L - ₹42L PA",
            tech_stack: aiData.tech_stack,
            interview_types: aiData.interview_types,
            application_url: gJob.absolute_url || `https://boards.greenhouse.io/${comp.slug}/jobs/${gJob.id}`,
            last_date: lastDate,
            status: "active",
            created_at: updatedDate,
          });
        }

        if (compJobs.length > 0) {
          companyJobsMap.set(comp.slug, compJobs);
        }
      } catch {
        // Skip on fetch error/timeout
      }
    })
  );

  const result: JobWithCompany[] = [];
  let addedAny = true;
  let roundIndex = 0;

  while (result.length < limit && addedAny) {
    addedAny = false;
    for (const [_, jobsList] of companyJobsMap) {
      if (roundIndex < jobsList.length && result.length < limit) {
        result.push(jobsList[roundIndex]);
        addedAny = true;
      }
    }
    roundIndex++;
  }

  return result;
}
