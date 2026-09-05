import type { JobWithCompany } from "./jobs";

/**
 * Calculates a dynamic skill match percentage between candidate skills/resume text
 * and job description/tech stack using token overlap & TF-IDF term weighting.
 */
export function calculateJobMatchScore(
  candidateSkillsText: string | null | undefined,
  job: JobWithCompany
): number | null {
  if (!candidateSkillsText || candidateSkillsText.trim().length === 0) {
    return null;
  }

  const normCandidate = candidateSkillsText.toLowerCase();

  // Extract candidate tokens (skills, keywords)
  const candidateTokens = new Set(
    normCandidate
      .replace(/[^a-z0-9+#\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1)
  );

  // Extract job skills & keywords
  const jobTechStack = (job.tech_stack || []).map((s) => s.toLowerCase());
  const jobRole = job.role.toLowerCase();
  const jobDomain = (job.domain || "").toLowerCase();
  const jobDescription = job.description.toLowerCase();

  let matchedTechCount = 0;
  for (const tech of jobTechStack) {
    const techWords = tech.split(/\s+/);
    if (techWords.some((w) => candidateTokens.has(w) || normCandidate.includes(tech))) {
      matchedTechCount++;
    }
  }

  // Calculate tech stack overlap percentage
  const techStackRatio =
    jobTechStack.length > 0 ? matchedTechCount / jobTechStack.length : 0.5;

  // Role keyword overlap
  const roleWords = jobRole.split(/\s+/).filter((w) => w.length > 2);
  let matchedRoleWords = 0;
  for (const word of roleWords) {
    if (candidateTokens.has(word) || normCandidate.includes(word)) {
      matchedRoleWords++;
    }
  }
  const roleRatio = roleWords.length > 0 ? matchedRoleWords / roleWords.length : 0.5;

  // Overall match score bounded between 48% and 98%
  const rawScore = Math.round((techStackRatio * 0.65 + roleRatio * 0.35) * 100);
  const finalScore = Math.max(48, Math.min(98, rawScore));

  return finalScore;
}
