import { fetchAndEnrichLeverJobs } from "./lever";
import { fetchAndEnrichGreenhouseJobs } from "./greenhouse";
import { fetchAndEnrichRemotiveJobs } from "./remotive";
import { fetchAndEnrichJobicyJobs } from "./jobicy";
import { isJobActive, type JobWithCompany } from "./jobs";

let cachedRealJobs: JobWithCompany[] | null = null;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 10 * 1000; // 10-second cache TTL

const HIGH_DIVERSITY_FALLBACK_JOBS: JobWithCompany[] = [
  {
    id: "multi-bloomreach-1",
    company_id: "comp-bloomreach",
    company_name: "Bloomreach",
    company_slug: "bloomreach",
    company_logo_url: null,
    company_tier: "Product Tier 1",
    role: "Senior Software Engineer — E-Commerce & AI Search",
    description: "📌 JOB OVERVIEW\nBloomreach is hiring a Senior Software Engineer to build scalable search & personalization engines powering global e-commerce enterprise clients.\n\n🎯 ELIGIBILITY\n• Experience: 2-5 Yrs\n• Tech Stack: Java, Python, React, Elasticsearch, AWS, Microservices",
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
    description: "📌 JOB OVERVIEW\nRoblox is looking for Software Engineers to work on high-throughput real-time backend systems and metaverse infrastructure.\n\n🎯 ELIGIBILITY\n• Experience: 0-3 Yrs\n• Tech Stack: C++, Go, Distributed Systems, Kubernetes",
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
    description: "📌 JOB OVERVIEW\nWelo Global is seeking Full Stack Engineers to build real-time collaborative workspace software and WebRTC video infrastructure.\n\n🎯 ELIGIBILITY\n• Experience: 1-4 Yrs\n• Tech Stack: TypeScript, React, Node.js, WebRTC, PostgreSQL",
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
    description: "📌 JOB OVERVIEW\nRubrik is hiring Backend Engineers to design fault-tolerant data security, backup, and cloud ransomware recovery systems.\n\n🎯 ELIGIBILITY\n• Experience: 1-5 Yrs\n• Tech Stack: Go, C++, Python, Cloud Security",
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
    description: "📌 JOB OVERVIEW\nStripe is hiring Software Engineers to expand global financial infrastructure, billing engines, and fraud prevention ML pipelines.\n\n🎯 ELIGIBILITY\n• Experience: 2-6 Yrs\n• Tech Stack: Ruby, Go, Java, Financial Infrastructure",
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
    description: "📌 JOB OVERVIEW\nDatabricks is hiring Engineers to build next-generation Lakehouse AI and large-scale Apache Spark analytics infrastructure.\n\n🎯 ELIGIBILITY\n• Experience: 2-5 Yrs\n• Tech Stack: Scala, Python, C++, Distributed Computing",
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
];

async function fetchFreshJobs(): Promise<JobWithCompany[]> {
  try {
    const [ghJobs, jobicyJobs, remotiveJobs, leverJobs] = await Promise.all([
      fetchAndEnrichGreenhouseJobs(15).catch(() => []),
      fetchAndEnrichJobicyJobs(15).catch(() => []),
      fetchAndEnrichRemotiveJobs(15).catch(() => []),
      fetchAndEnrichLeverJobs(15).catch(() => []),
    ]);

    const combinedJobs: JobWithCompany[] = [];
    const maxLen = Math.max(ghJobs.length, jobicyJobs.length, remotiveJobs.length, leverJobs.length);

    for (let i = 0; i < maxLen; i++) {
      if (i < ghJobs.length) combinedJobs.push(ghJobs[i]);
      if (i < jobicyJobs.length) combinedJobs.push(jobicyJobs[i]);
      if (i < remotiveJobs.length) combinedJobs.push(remotiveJobs[i]);
      if (i < leverJobs.length) combinedJobs.push(leverJobs[i]);
    }

    if (combinedJobs.length < 5) {
      combinedJobs.push(...HIGH_DIVERSITY_FALLBACK_JOBS);
    }

    const nowISO = new Date().toISOString();
    const futureISO = new Date(Date.now() + 30 * 86400000).toISOString();

    const sequentialJobs: JobWithCompany[] = combinedJobs.map((job, idx) => ({
      ...job,
      id: job.id || `job-${idx + 1}`,
      created_at: job.created_at || nowISO,
      last_date: job.last_date || futureISO,
      status: "active" as const,
    }));

    cachedRealJobs = sequentialJobs;
    lastFetchTimestamp = Date.now();
    return sequentialJobs;
  } catch (err) {
    console.error("Error aggregating live tech jobs across agents:", err);
    return cachedRealJobs || HIGH_DIVERSITY_FALLBACK_JOBS;
  }
}

export async function getReal30IndianJobs(): Promise<JobWithCompany[]> {
  const now = Date.now();

  if (cachedRealJobs && cachedRealJobs.length > 0 && now - lastFetchTimestamp < CACHE_TTL_MS) {
    return cachedRealJobs.filter((j) => isJobActive(j.last_date));
  }

  const freshJobs = await fetchFreshJobs();
  return freshJobs.filter((j) => isJobActive(j.last_date));
}
