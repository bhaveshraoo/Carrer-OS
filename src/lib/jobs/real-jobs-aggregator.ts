import { fetchAndEnrichLeverJobs } from "./lever";
import { fetchAndEnrichGreenhouseJobs } from "./greenhouse";
import { fetchAndEnrichRemotiveJobs } from "./remotive";
import { isJobActive, type JobWithCompany } from "./jobs";

/**
 * Cache for 30 real Indian jobs (10 Lever, 10 Greenhouse, 10 Remotive)
 */
let cachedRealJobs: JobWithCompany[] | null = null;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache

export async function getReal30IndianJobs(): Promise<JobWithCompany[]> {
  const now = Date.now();

  if (cachedRealJobs && now - lastFetchTimestamp < CACHE_TTL_MS) {
    return cachedRealJobs.filter((j) => isJobActive(j.last_date));
  }

  console.log("🚀 Fetching 30 real Indian tech jobs (10 Lever + 10 Greenhouse + 10 Remotive)...");

  try {
    const [leverJobs, ghJobs, remotiveJobs] = await Promise.all([
      fetchAndEnrichLeverJobs(10),
      fetchAndEnrichGreenhouseJobs(10),
      fetchAndEnrichRemotiveJobs(10),
    ]);

    // Fill any missing slots from Lever if Greenhouse or Remotive return fewer than 10
    let fillJobs: JobWithCompany[] = [];
    const totalCurrent = leverJobs.length + ghJobs.length + remotiveJobs.length;
    if (totalCurrent < 30) {
      const extraNeeded = 30 - totalCurrent;
      const extraLever = await fetchAndEnrichLeverJobs(10 + extraNeeded);
      fillJobs = extraLever.slice(10, 10 + extraNeeded);
    }

    const rawCombined = [...leverJobs, ...ghJobs, ...remotiveJobs, ...fillJobs].slice(0, 30);

    // Assign sequential numeric tracking IDs starting from 1
    const sequentialJobs: JobWithCompany[] = rawCombined.map((job, idx) => {
      const seqId = String(idx + 1);
      return {
        ...job,
        id: seqId, // Sequential ID: "1", "2", "3" ... "30"
      };
    });

    cachedRealJobs = sequentialJobs;
    lastFetchTimestamp = now;

    return sequentialJobs.filter((j) => isJobActive(j.last_date));
  } catch (err) {
    console.error("Error aggregating 30 real Indian jobs:", err);
    if (cachedRealJobs) {
      return cachedRealJobs.filter((j) => isJobActive(j.last_date));
    }
    return [];
  }
}
