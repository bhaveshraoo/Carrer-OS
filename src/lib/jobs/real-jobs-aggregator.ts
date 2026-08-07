import { fetchAndEnrichLeverJobs } from "./lever";
import { fetchAndEnrichGreenhouseJobs } from "./greenhouse";
import { fetchAndEnrichRemotiveJobs } from "./remotive";
import { isJobActive, type JobWithCompany } from "./jobs";

/**
 * Cache for 30 real Indian jobs (10 Lever, 10 Greenhouse, 10 Remotive)
 */
let cachedRealJobs: JobWithCompany[] | null = null;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5-minute fresh cache

async function fetchFreshJobs(): Promise<JobWithCompany[]> {
  try {
    const [leverJobs, ghJobs, remotiveJobs] = await Promise.all([
      fetchAndEnrichLeverJobs(10),
      fetchAndEnrichGreenhouseJobs(10),
      fetchAndEnrichRemotiveJobs(10),
    ]);

    let fillJobs: JobWithCompany[] = [];
    const totalCurrent = leverJobs.length + ghJobs.length + remotiveJobs.length;
    if (totalCurrent < 30) {
      const extraNeeded = 30 - totalCurrent;
      const extraLever = await fetchAndEnrichLeverJobs(10 + extraNeeded);
      fillJobs = extraLever.slice(10, 10 + extraNeeded);
    }

    const rawCombined = [...leverJobs, ...ghJobs, ...remotiveJobs, ...fillJobs].slice(0, 30);
    const nowISO = new Date().toISOString();
    const futureISO = new Date(Date.now() + 30 * 86400000).toISOString();

    const sequentialJobs: JobWithCompany[] = rawCombined.map((job, idx) => ({
      ...job,
      id: String(idx + 1),
      created_at: job.created_at || nowISO,
      last_date: job.last_date || futureISO,
      status: "active" as const,
    }));

    cachedRealJobs = sequentialJobs;
    lastFetchTimestamp = Date.now();
    return sequentialJobs;
  } catch (err) {
    console.error("Error aggregating live Indian jobs:", err);
    return cachedRealJobs || [];
  }
}

export async function getReal30IndianJobs(): Promise<JobWithCompany[]> {
  const now = Date.now();

  if (cachedRealJobs && cachedRealJobs.length > 0 && now - lastFetchTimestamp < CACHE_TTL_MS) {
    return cachedRealJobs.filter((j) => isJobActive(j.last_date));
  }

  // Fetch 100% real live jobs from Lever, Greenhouse & Remotive APIs
  const freshJobs = await fetchFreshJobs();
  return freshJobs.filter((j) => isJobActive(j.last_date));
}


