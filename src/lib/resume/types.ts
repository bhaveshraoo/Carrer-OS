export interface ExtractedResume {
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    duration: string;
  }[];
  certifications: string[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
  }[];
  missing_sections: string[];
}

export interface AtsBreakdown {
  contact_info: number;
  skills_match: number;
  experience: number;
  education: number;
  keywords: number;
  formatting: number;
}

export interface ResumeScores {
  resume_score: number;
  ats_score: number;
  ats_breakdown: AtsBreakdown;
  recruiter_score: number;
  hr_readability_score: number;
  industry_match_score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
}

export interface RewriteSuggestions {
  bullet_rewrites: { original: string; improved: string; reason: string }[];
  missing_ats_keywords: string[];
  section_suggestions: string[];
}

export interface ResumeAnalysisReport {
  extracted: ExtractedResume;
  scores: ResumeScores;
  suggestions: RewriteSuggestions;
}
