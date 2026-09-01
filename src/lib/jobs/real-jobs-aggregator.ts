import { fetchAndEnrichLeverJobs } from "./lever";
import { fetchAndEnrichGreenhouseJobs } from "./greenhouse";
import { fetchAndEnrichRemotiveJobs } from "./remotive";
import { fetchAndEnrichJobicyJobs } from "./jobicy";
import { isJobActive, type JobWithCompany } from "./jobs";

let cachedRealJobs: JobWithCompany[] | null = null;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5-minute fresh cache

/**
 * Multi-Source Multi-Agent Tech Harvester:
 * Runs 4 parallel agent processes (Greenhouse, Jobicy, Remotive, Lever) pulling live jobs
 * across 60+ top tech companies (Stripe, Databricks, Rubrik, MongoDB, Coinbase, Cloudflare, Meesho, etc.)
 * across ALL tech domains (Frontend, Backend, AI/ML, DevOps, Mobile, Security, Systems, Data).
 */
async function fetchFreshJobs(): Promise<JobWithCompany[]> {
  try {
    const [ghJobs, jobicyJobs, remotiveJobs, leverJobs] = await Promise.all([
      fetchAndEnrichGreenhouseJobs(15),
      fetchAndEnrichJobicyJobs(15),
      fetchAndEnrichRemotiveJobs(15),
      fetchAndEnrichLeverJobs(15),
    ]);

    // Interleave all 4 agent streams for maximum company & domain diversity
    const combinedJobs: JobWithCompany[] = [];
    const maxLen = Math.max(ghJobs.length, jobicyJobs.length, remotiveJobs.length, leverJobs.length);

    for (let i = 0; i < maxLen; i++) {
      if (i < ghJobs.length) combinedJobs.push(ghJobs[i]);
      if (i < jobicyJobs.length) combinedJobs.push(jobicyJobs[i]);
      if (i < remotiveJobs.length) combinedJobs.push(remotiveJobs[i]);
      if (i < leverJobs.length) combinedJobs.push(leverJobs[i]);
    }

    const nowISO = new Date().toISOString();
    const futureISO = new Date(Date.now() + 30 * 86400000).toISOString();

    const sequentialJobs: JobWithCompany[] = combinedJobs.map((job, idx) => ({
      ...job,
      id: job.id || String(idx + 1),
      created_at: job.created_at || nowISO,
      last_date: job.last_date || futureISO,
      status: "active" as const,
    }));

    cachedRealJobs = sequentialJobs;
    lastFetchTimestamp = Date.now();
    return sequentialJobs;
  } catch (err) {
    console.error("Error aggregating live tech jobs across agents:", err);
    return cachedRealJobs || [];
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
