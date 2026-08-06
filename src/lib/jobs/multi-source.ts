import { fetchAndEnrichLeverJobs } from "./lever";
import { fetchAndEnrichGreenhouseJobs } from "./greenhouse";
import { fetchAndEnrichRemotiveJobs } from "./remotive";
import type { JobWithCompany } from "./jobs";

export async function fetchAllIndianJobs(): Promise<{
  jobs: JobWithCompany[];
  sources: {
    leverCount: number;
    greenhouseCount: number;
    remotiveCount: number;
    total: number;
  };
}> {
  console.log("🇮🇳 Fetching 15 Indian tech jobs from Lever, 15 from Greenhouse, and 15 from Remotive...");

  const [leverJobs, ghJobs, remotiveJobs] = await Promise.all([
    fetchAndEnrichLeverJobs(15),
    fetchAndEnrichGreenhouseJobs(15),
    fetchAndEnrichRemotiveJobs(15),
  ]);

  // If Remotive has fewer than 15 explicit India jobs, fetch extra from Lever / Greenhouse to maintain 45 Indian jobs
  let additionalJobs: JobWithCompany[] = [];
  if (remotiveJobs.length < 15) {
    const extraNeeded = 15 - remotiveJobs.length;
    const extraLever = await fetchAndEnrichLeverJobs(15 + extraNeeded);
    additionalJobs = extraLever.slice(15, 15 + extraNeeded);
  }

  const combinedJobs = [...leverJobs, ...ghJobs, ...remotiveJobs, ...additionalJobs].slice(0, 45);

  return {
    jobs: combinedJobs,
    sources: {
      leverCount: leverJobs.length + (additionalJobs.length > 0 ? additionalJobs.length : 0),
      greenhouseCount: ghJobs.length,
      remotiveCount: remotiveJobs.length,
      total: combinedJobs.length,
    },
  };
}
