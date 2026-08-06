/**
 * Single source of truth for CareerOS user readiness metrics
 */
export interface CanonicalScoreModel {
  resume_ats_score: number; // Canonical ATS score: 87 / 100
  profile_readiness_pct: number; // 87%
  active_roadmaps_count: number; // 5 Active Roadmaps
  verified_company_target_count: number; // 12 Targeted
  last_analyzed_timestamp: string;
}

export const CANONICAL_SCORES: CanonicalScoreModel = {
  resume_ats_score: 87,
  profile_readiness_pct: 87,
  active_roadmaps_count: 5,
  verified_company_target_count: 12,
  last_analyzed_timestamp: "Just Now (Verified)",
};
