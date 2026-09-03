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
  { slug: "razorpay", name: "Razorpay", tier: "Fintech Tier 1" },
  { slug: "postman", name: "Postman", tier: "Developer Tools" },
  { slug: "groww", name: "Groww", tier: "Fintech Tier 1" },
  { slug: "clevertap", name: "CleverTap", tier: "SaaS / Product" },
  { slug: "bloomreach", name: "Bloomreach", tier: "E-Commerce AI" },
  { slug: "roblox", name: "Roblox", tier: "Metaverse & Gaming" },
  { slug: "swiggy", name: "Swiggy", tier: "Consumer Tech" },
  { slug: "inmobi", name: "InMobi", tier: "AdTech Tier 1" },
  { slug: "smallcase", name: "smallcase", tier: "Fintech" },
  { slug: "juspay", name: "Juspay", tier: "Fintech / Payments" },
  { slug: "urbancompany", name: "Urban Company", tier: "Consumer Tech" },
  { slug: "slice", name: "Slice", tier: "Fintech" },
  { slug: "zepto", name: "Zepto", tier: "Quick Commerce" },
];

export async function fetchAndEnrichLeverJobs(limit = 15): Promise<JobWithCompany[]> {
  const companyJobsMap: Map<string, JobWithCompany[]> = new Map();

  for (const comp of LEVER_INDIA_COMPANIES) {
    try {
      const res = await fetch(`https://api.lever.co/v0/postings/${comp.slug}?mode=json`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
        },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 3600 },
      });

      if (!res.ok) continue;
      const postings: LeverPostingRaw[] = await res.json();
      if (!Array.isArray(postings)) continue;

      const compJobs: JobWithCompany[] = [];

      for (const p of postings) {
        if (compJobs.length >= 3) break;

        const location = p.categories?.location || "India (Remote / Hybrid)";
        if (!isIndianLocation(location)) continue;

        const rawDescription = p.descriptionPlain || p.description || p.text;

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

        compJobs.push({
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
          ctc_range: "₹18L - ₹32L PA",
          tech_stack: aiData.tech_stack,
          interview_types: aiData.interview_types,
          application_url: p.hostedUrl || p.applyUrl || `https://jobs.lever.co/${comp.slug}/${p.id}`,
          last_date: lastDate,
          status: "active",
          created_at: createdDate,
        });
      }

      if (compJobs.length > 0) {
        companyJobsMap.set(comp.slug, compJobs);
      }
    } catch {
      // Continue next company
    }
  }

  const result: JobWithCompany[] = [];
  let addedAny = true;
  let roundIndex = 0;

  while (result.length < limit && addedAny && roundIndex < 2) {
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
