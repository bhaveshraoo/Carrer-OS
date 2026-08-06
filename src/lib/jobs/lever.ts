import { isIndianLocation } from "./india-filter";
import { enrichJobWithAi } from "./enrich-job";
import type { JobWithCompany } from "./jobs";

export interface LeverPostingRaw {
  id: string;
  text: string;
  hostedUrl: string;
  applyUrl?: string;
  createdAt: number;
  descriptionPlain?: string;
  description?: string;
  categories?: {
    commitment?: string;
    location?: string;
    team?: string;
    department?: string;
  };
}

const LEVER_INDIA_COMPANIES = [
  { slug: "meesho", name: "Meesho", tier: "Product Tier 1" },
  { slug: "groww", name: "Groww", tier: "Product Tier 1" },
  { slug: "clevertap", name: "CleverTap", tier: "Product Tier 1" },
  { slug: "postman", name: "Postman", tier: "Product Tier 1" },
  { slug: "inmobi", name: "InMobi", tier: "Product Tier 1" },
  { slug: "smallcase", name: "smallcase", tier: "Fintech" },
  { slug: "juspay", name: "Juspay", tier: "Fintech" },
  { slug: "urbancompany", name: "Urban Company", tier: "Consumer Tech" },
  { slug: "slice", name: "Slice", tier: "Fintech" },
  { slug: "zepto", name: "Zepto", tier: "Consumer Tech" },
];

export async function fetchAndEnrichLeverJobs(limit = 15): Promise<JobWithCompany[]> {
  const indianJobs: JobWithCompany[] = [];

  for (const comp of LEVER_INDIA_COMPANIES) {
    if (indianJobs.length >= limit) break;

    try {
      const res = await fetch(`https://api.lever.co/v0/postings/${comp.slug}?mode=json`, {
        headers: { "User-Agent": "CareerOS-Lever-Aggregator/1.0" },
        next: { revalidate: 3600 },
      });

      if (!res.ok) continue;
      const postings: LeverPostingRaw[] = await res.json();
      if (!Array.isArray(postings)) continue;

      for (const p of postings) {
        if (indianJobs.length >= limit) break;

        const location = p.categories?.location || "";
        if (!isIndianLocation(location)) continue;

        const rawDescription = p.descriptionPlain || p.description || p.text;

        // Run AI enrichment on description
        const aiData = await enrichJobWithAi({
          title: p.text,
          company_name: comp.name,
          description: rawDescription,
          category: p.categories?.department || p.categories?.team || "Software Engineering",
          tags: [p.categories?.commitment || "Full-time"],
        });

        const formattedDescription = `📌 JOB OVERVIEW
${aiData.summary}

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Seniority Level: ${aiData.seniority}
• Education: ${aiData.education}
• Experience: ${aiData.experience}
• Work Type: ${p.categories?.commitment || "Full-Time"} (${aiData.work_mode})

🚀 KEY RESPONSIBILITIES
${aiData.responsibilities.map((r) => `• ${r}`).join("\n")}

💡 REQUIRED TECHNICAL SKILLS & STACK
${aiData.skills.map((s) => `• ${s}`).join("\n")}

🏆 SELECTION & INTERVIEW PROCESS
${aiData.interview_types.map((type, idx) => `${idx + 1}. ${type}`).join("\n")}

🎁 PERKS & BENEFITS
${aiData.benefits.map((b) => `• ${b}`).join("\n")}`;

        const createdDate = p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString();
        const lastDate = new Date(Date.now() + 30 * 86400000).toISOString();

        indianJobs.push({
          id: `lever-${p.id}`,
          company_id: `comp-${comp.slug}`,
          company_name: comp.name,
          company_slug: comp.slug,
          company_logo_url: null,
          company_tier: comp.tier,
          role: p.text.trim(),
          description: formattedDescription,
          domain: aiData.ai_category || "Software Engineering",
          location: location.trim(),
          ctc_range: "₹18L - ₹28L PA",
          tech_stack: aiData.tech_stack,
          interview_types: aiData.interview_types,
          application_url: p.applyUrl || p.hostedUrl,
          last_date: lastDate,
          status: "active",
          created_at: createdDate,
        });
      }
    } catch (err) {
      console.warn(`Notice fetching Lever company ${comp.name}:`, err);
    }
  }

  return indianJobs.slice(0, limit);
}
