import { table } from "@/lib/supabase/typed-table";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface JobWithCompany {
  id: string;
  company_id: string;
  company_name: string;
  company_slug: string;
  company_logo_url: string | null;
  company_tier: string;
  role: string;
  description: string;
  domain: string;
  location: string;
  ctc_range: string;
  tech_stack: string[];
  interview_types: string[];
  application_url: string;
  last_date: string;
  status: "active" | "expired";
  created_at: string;
  is_wishlisted?: boolean;
  is_company_targeted?: boolean;
}

export function isJobActive(lastDateStr: string): boolean {
  if (!lastDateStr) return false;
  const trimmed = lastDateStr.trim();
  const lastTime = new Date(trimmed).getTime();
  if (isNaN(lastTime)) return false;

  let deadlineMs = lastTime;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const endOfDay = new Date(trimmed);
    endOfDay.setHours(23, 59, 59, 999);
    deadlineMs = endOfDay.getTime();
  }

  return deadlineMs >= Date.now();
}

export const FALLBACK_JOBS: JobWithCompany[] = [
  {
    id: "multi-bloomreach-1",
    company_id: "comp-bloomreach",
    company_name: "Bloomreach",
    company_slug: "bloomreach",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "Senior Software Engineer — E-Commerce & AI Search",
    description: `📌 JOB OVERVIEW
Bloomreach is hiring a Senior Software Engineer to build scalable search & personalization engines powering global e-commerce enterprise clients.

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Experience: 2-5 Yrs
• Tech Stack: Java, Python, React, Elasticsearch, AWS, Microservices`,
    domain: "Software Engineering",
    location: "Bangalore, Karnataka (Remote)",
    ctc_range: "₹25L - ₹40L PA",
    tech_stack: ["Java", "Python", "React", "Elasticsearch", "AWS"],
    interview_types: ["Online Assessment", "System Design", "Coding Round", "HR Round"],
    application_url: "https://bloomreach.com/careers",
    last_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "multi-roblox-1",
    company_id: "comp-roblox",
    company_name: "Roblox",
    company_slug: "roblox",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "Software Engineer — Real-Time Systems & Game Engine",
    description: `📌 JOB OVERVIEW
Roblox is looking for Software Engineers to work on high-throughput real-time backend systems and metaverse infrastructure.

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Experience: 0-3 Yrs
• Tech Stack: C++, Go, Distributed Systems, Kubernetes`,
    domain: "Systems & Infrastructure",
    location: "Remote / India",
    ctc_range: "₹30L - ₹50L PA",
    tech_stack: ["C++", "Go", "Distributed Systems", "Kubernetes"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "HR Round"],
    application_url: "https://roblox.com/careers",
    last_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "multi-welo-1",
    company_id: "comp-welo",
    company_name: "Welo Global",
    company_slug: "welo",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "Full Stack Engineer — AI Virtual Workspaces",
    description: `📌 JOB OVERVIEW
Welo Global is seeking Full Stack Engineers to build real-time collaborative workspace software and WebRTC video infrastructure.

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Experience: 1-4 Yrs
• Tech Stack: TypeScript, React, Node.js, WebRTC, PostgreSQL`,
    domain: "Full Stack Development",
    location: "Bangalore, Karnataka (Hybrid)",
    ctc_range: "₹20L - ₹32L PA",
    tech_stack: ["TypeScript", "React", "Node.js", "WebRTC", "PostgreSQL"],
    interview_types: ["Screening Call", "Coding Assessment", "System Architecture", "Culture Fit"],
    application_url: "https://welo.space/careers",
    last_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "multi-rubrik-1",
    company_id: "comp-rubrik",
    company_name: "Rubrik",
    company_slug: "rubrik",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "Backend Engineer — Zero Trust Data Security Platform",
    description: `📌 JOB OVERVIEW
Rubrik is hiring Backend Engineers to design fault-tolerant data security, backup, and cloud ransomware recovery systems.

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Experience: 1-5 Yrs
• Tech Stack: Go, C++, Python, Cloud Security`,
    domain: "Backend & Cloud",
    location: "Bangalore, Karnataka",
    ctc_range: "₹28L - ₹45L PA",
    tech_stack: ["Go", "C++", "Python", "Cloud Security", "Distributed Storage"],
    interview_types: ["Coding Assessment", "DSA Round 1", "System Design", "HR Round"],
    application_url: "https://rubrik.com/careers",
    last_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "multi-stripe-1",
    company_id: "comp-stripe",
    company_name: "Stripe",
    company_slug: "stripe",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "Software Engineer — Global Payments & Financial Infrastructure",
    description: `📌 JOB OVERVIEW
Stripe is hiring Software Engineers to expand global financial infrastructure, billing engines, and fraud prevention ML pipelines.

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Experience: 2-6 Yrs
• Tech Stack: Ruby, Go, Java, Financial Infrastructure`,
    domain: "FinTech & Payments",
    location: "Bengaluru, Karnataka",
    ctc_range: "₹35L - ₹60L PA",
    tech_stack: ["Ruby", "Go", "Java", "PostgreSQL", "Kafka"],
    interview_types: ["Screening", "Live Coding", "System Architecture", "Leadership"],
    application_url: "https://stripe.com/jobs",
    last_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "multi-databricks-1",
    company_id: "comp-databricks",
    company_name: "Databricks",
    company_slug: "databricks",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "Data & AI Platform Engineer — Apache Spark Infrastructure",
    description: `📌 JOB OVERVIEW
Databricks is hiring Engineers to build next-generation Lakehouse AI and large-scale Apache Spark analytics infrastructure.

🎯 ELIGIBILITY & BATCH REQUIREMENTS
• Experience: 2-5 Yrs
• Tech Stack: Scala, Python, C++, Distributed Computing`,
    domain: "AI & Big Data",
    location: "Bangalore, Karnataka",
    ctc_range: "₹32L - ₹55L PA",
    tech_stack: ["Scala", "Python", "C++", "Apache Spark", "Kubernetes"],
    interview_types: ["OA", "Data Structures", "Distributed Systems", "HR"],
    application_url: "https://databricks.com/careers",
    last_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "job-fallback-1",
    company_id: "comp-tcs",
    company_name: "TCS",
    company_slug: "tcs",
    company_logo_url: null,
    company_tier: "IT Services",
    role: "Systems Engineer — Ninja & Digital Hiring 2026",
    description: `📌 JOB OVERVIEW
Tata Consultancy Services (TCS) is inviting applications for the TCS National Qualifier Test (NQT) 2026 batch. This hiring drive aims to select premier engineering talent for TCS Ninja and TCS Digital roles across India.`,
    domain: "Software Engineering",
    location: "Pan India (Multiple Locations)",
    ctc_range: "₹7L - ₹11.5L PA",
    tech_stack: ["Java", "Python", "SQL", "HTML/CSS", "Git"],
    interview_types: ["Online Assessment", "Technical Round 1", "HR Round"],
    application_url: "https://www.tcs.com/careers",
    last_date: new Date(Date.now() + 25 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "job-fallback-2",
    company_id: "comp-infosys",
    company_name: "Infosys",
    company_slug: "infosys",
    company_logo_url: null,
    company_tier: "IT Services",
    role: "Specialist Programmer (SP) & DSE",
    description: `📌 JOB OVERVIEW
Infosys is recruiting high-caliber coders for Specialist Programmer (SP) and Digital Systems Engineer (DSE) tracks through HackWithInfy & InfyTQ direct entry pipelines.`,
    domain: "Software Engineering",
    location: "Bengaluru / Mysuru / Pune",
    ctc_range: "₹9.5L - ₹14L PA",
    tech_stack: ["Python", "Java", "DSA", "SQL", "Spring Boot"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "HR Round"],
    application_url: "https://www.infosys.com/careers.html",
    last_date: new Date(Date.now() + 20 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    company_id: "comp-google",
    id: "job-fallback-3",
    company_name: "Google",
    company_slug: "google",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "Software Engineer (SDE-1) — Campus 2026",
    description: `📌 JOB OVERVIEW
Google India is seeking world-class Software Development Engineers for our 2026 University Graduate cohort.`,
    domain: "Software Engineering",
    location: "Bengaluru / Hyderabad (Hybrid)",
    ctc_range: "₹24L - ₹32L PA",
    tech_stack: ["C++", "Python", "Data Structures", "Algorithms", "System Design"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "System Design", "HR Round"],
    application_url: "https://careers.google.com/jobs/results/",
    last_date: new Date(Date.now() + 18 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    company_id: "comp-amazon",
    id: "job-fallback-4",
    company_name: "Amazon",
    company_slug: "amazon",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "AI / ML Engineer — AWS Science",
    description: `📌 JOB OVERVIEW
The Amazon Web Services (AWS) AI Science team is building next-generation Generative AI models.`,
    domain: "AI/ML",
    location: "Bengaluru, Karnataka",
    ctc_range: "₹26L - ₹36L PA",
    tech_stack: ["Python", "PyTorch", "Transformers", "LLMs", "RAG", "AWS SageMaker"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "System Design", "Managerial Round"],
    application_url: "https://www.amazon.jobs/en/",
    last_date: new Date(Date.now() + 15 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    company_id: "comp-microsoft",
    id: "job-fallback-5",
    company_name: "Microsoft",
    company_slug: "microsoft",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "Full Stack Engineer — Azure Cloud",
    description: `📌 JOB OVERVIEW
Microsoft India Developer Center (IDC) is seeking Full Stack Engineers to design and scale Azure Cloud management web portals.`,
    domain: "Full Stack",
    location: "Hyderabad, Telangana",
    ctc_range: "₹22L - ₹28L PA",
    tech_stack: ["React", "Node.js", "TypeScript", "C#", "Azure", "PostgreSQL"],
    interview_types: ["Online Assessment", "Technical Round 1", "Technical Round 2", "Managerial Round"],
    application_url: "https://careers.microsoft.com/us/en",
    last_date: new Date(Date.now() + 22 * 86400000).toISOString(),
    status: "active",
    created_at: new Date().toISOString(),
  },
];

export async function autoExpireJobs(supabase: SupabaseClient) {
  const nowStr = new Date().toISOString();
  try {
    const { data: expiredJobs } = await table(supabase, "jobs")
      .select("id")
      .eq("status", "active");

    if (expiredJobs && expiredJobs.length > 0) {
      await (supabase as any)
        .from("jobs")
        .update({ status: "expired" })
        .eq("status", "active")
        .lt("last_date", nowStr);
    }
  } catch {
    // Ignore error
  }
}

export async function fetchActiveJobsWithDetails(
  supabase: SupabaseClient,
  userId?: string
): Promise<JobWithCompany[]> {
  const { syncAndFetchSupabaseJobs } = await import("./sync-engine");
  return syncAndFetchSupabaseJobs(supabase, userId);
}
