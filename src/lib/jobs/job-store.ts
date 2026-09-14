import { FALLBACK_JOBS, type JobWithCompany } from "./jobs";

/**
 * Global In-Memory Job Store:
 * Preserves date-wise ingested jobs, manual job additions, and purged job IDs
 * during the runtime lifecycle.
 */
let customManualJobs: JobWithCompany[] = [];
let purgedJobIds = new Set<string>();
let syncedFreshJobs: JobWithCompany[] = [];

/**
 * Gets all accumulated active jobs merged from fallback, live sync, and manual additions.
 */
export function getAccumulatedStoreJobs(): JobWithCompany[] {
  const allPool = [...customManualJobs, ...syncedFreshJobs, ...FALLBACK_JOBS];
  
  // Deduplicate by ID and filter purged jobs
  const map = new Map<string, JobWithCompany>();
  for (const job of allPool) {
    if (!job || !job.id || purgedJobIds.has(job.id)) continue;
    if (!map.has(job.id)) {
      map.set(job.id, job);
    }
  }

  const jobsList = Array.from(map.values());

  // Interleave by company for maximum visual diversity
  return interleaveByCompany(jobsList);
}

/**
 * Adds a custom manual job.
 */
export function addCustomJobToStore(job: JobWithCompany): JobWithCompany {
  // Ensure created_at is present
  const formattedJob: JobWithCompany = {
    ...job,
    created_at: job.created_at || new Date().toISOString(),
    status: "active",
  };
  customManualJobs.unshift(formattedJob);
  return formattedJob;
}

/**
 * Purges a job from the store by ID.
 */
export function purgeJobFromStore(jobId: string): boolean {
  purgedJobIds.add(jobId);
  customManualJobs = customManualJobs.filter((j) => j.id !== jobId);
  syncedFreshJobs = syncedFreshJobs.filter((j) => j.id !== jobId);
  return true;
}

/**
 * Merges freshly harvested live jobs into the store.
 */
export function mergeFreshHarvestJobs(freshJobs: JobWithCompany[]) {
  const nowISO = new Date().toISOString();
  const formattedFresh = freshJobs.map((j, idx) => ({
    ...j,
    id: j.id || `fresh-job-${idx + 1}-${Date.now()}`,
    created_at: j.created_at || nowISO,
  }));

  // Append new fresh jobs
  syncedFreshJobs = [...formattedFresh, ...syncedFreshJobs];
}

/**
 * Round-robin interleave helper so adjacent job cards alternate company names.
 */
function interleaveByCompany(jobsList: JobWithCompany[]): JobWithCompany[] {
  const companyMap = new Map<string, JobWithCompany[]>();

  for (const j of jobsList) {
    const cName = (j.company_name || j.company_slug || "Company").toLowerCase();
    const list = companyMap.get(cName) || [];
    list.push(j);
    companyMap.set(cName, list);
  }

  const result: JobWithCompany[] = [];
  let added = true;
  let idx = 0;

  while (added) {
    added = false;
    for (const list of companyMap.values()) {
      if (idx < list.length) {
        result.push(list[idx]);
        added = true;
      }
    }
    idx++;
  }

  return result;
}
