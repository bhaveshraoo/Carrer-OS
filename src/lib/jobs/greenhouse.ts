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
  { slug: "stripe", name: "Stripe", tier: "Product Tier 1" },
  { slug: "phonepe", name: "PhonePe", tier: "Fintech" },
  { slug: "rubrik", name: "Rubrik", tier: "Product Tier 1" },
  { slug: "databricks", name: "Databricks", tier: "Product Tier 1" },
  { slug: "gitlab", name: "GitLab", tier: "Product Tier 1" },
  { slug: "coinbase", name: "Coinbase", tier: "Fintech" },
  { slug: "roblox", name: "Roblox", tier: "Product Tier 1" },
  { slug: "cloudflare", name: "Cloudflare", tier: "Product Tier 1" },
  { slug: "mongodb", name: "MongoDB", tier: "Product Tier 1" },
  { slug: "elastic", name: "Elastic", tier: "Product Tier 1" },
  { slug: "snowflake", name: "Snowflake", tier: "Product Tier 1" },
  { slug: "nutanix", name: "Nutanix", tier: "Product Tier 1" },
];

export async function fetchAndEnrichGreenhouseJobs(limit = 15): Promise<JobWithCompany[]> {
  const indianJobs: JobWithCompany[] = [];

  for (const comp of GREENHOUSE_INDIA_COMPANIES) {
    if (indianJobs.length >= limit) break;

    try {
      const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${comp.slug}/jobs?content=true`, {
        headers: { "User-Agent": "CareerOS-Greenhouse-Aggregator/1.0" },
        next: { revalidate: 3600 },
      });

      if (!res.ok) continue;
      const data = await res.json();
      const jobs: GreenhouseJobRaw[] = data.jobs || [];

      for (const gJob of jobs) {
        if (indianJobs.length >= limit) break;

        const location = gJob.location?.name || "";
        if (!isIndianLocation(location)) continue;

        const rawContent = gJob.content || gJob.title;

        // Run AI enrichment
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

        indianJobs.push({
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
          ctc_range: "₹24L - ₹38L PA",
          tech_stack: aiData.tech_stack,
          interview_types: aiData.interview_types,
          application_url: gJob.absolute_url,
          last_date: lastDate,
          status: "active",
          created_at: updatedDate,
        });
      }
    } catch (err) {
      console.warn(`Notice fetching Greenhouse company ${comp.name}:`, err);
    }
  }

  return indianJobs.slice(0, limit);
}
