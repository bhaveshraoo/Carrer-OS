export interface InterviewSession {
  id: string;
  user_id: string;
  job_role: string;
  company_name: string;
  job_description: string;
  experience: string;
  tech_stack: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  interview_type: "HR" | "Technical" | "DSA" | "System Design" | "Mixed";
  duration_minutes: number;
  language: string;
  personality: "Friendly Recruiter" | "Professional HR" | "Strict Engineering Manager" | "Startup Founder" | "Senior FAANG Engineer";
  blueprint: {
    sections: Array<{ name: string; duration_minutes: number; goal: string }>;
    core_questions: string[];
  };
  status: "configured" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  started_at?: string;
  ended_at?: string;
  resume_id?: string | null;
  resume_ats_score?: number | null;
  resume_file_name?: string | null;
}

export interface InterviewQuestion {
  id: string;
  session_id: string;
  section: string;
  question_number: number;
  question_text: string;
  expected_aspects: string[];
  asked_at: string;
}

export interface InterviewAnswer {
  id: string;
  session_id: string;
  question_id: string;
  transcript: string;
  duration_seconds: number;
  speaking_wpm: number;
  filler_words_count: number;
  response_delay_seconds: number;
  evaluation: {
    clarity_score: number;
    relevance_score: number;
    technical_depth_score: number;
    feedback: string;
    key_points_covered: string[];
    missing_aspects: string[];
  };
  answered_at: string;
}

export interface InterviewMemory {
  session_id: string;
  strong_skills: string[];
  weak_skills: string[];
  communication_rating: string;
  confidence_score: number;
  topics_covered: string[];
  questions_asked: string[];
  resume_references: string[];
  updated_at: string;
}

export interface InterviewAnalytics {
  session_id: string;
  face_visible: boolean;
  face_centered: boolean;
  looking_away: boolean;
  multiple_faces: boolean;
  low_noise_pct: number;
  medium_noise_pct: number;
  high_noise_pct: number;
  avg_speaking_speed_wpm: number;
  filler_words_total: number;
  long_pauses_count: number;
}

export interface InterviewReport {
  id: string;
  session_id: string;
  overall_score: number; // 0 - 100
  communication_score: number; // 0 - 100
  technical_score: number; // 0 - 100
  problem_solving_score: number; // 0 - 100
  confidence_score: number; // 0 - 100
  behavior_score: number; // 0 - 100
  hiring_recommendation: "Strong Hire" | "Hire" | "Leaning Hire" | "No Hire";
  candidate_verdict_reason?: string;
  strengths: string[];
  weaknesses: string[];
  red_flags?: string[];
  missing_critical_concepts?: string[];
  interview_summary: string;
  question_evaluations?: Array<{
    question_number: number;
    question_text: string;
    answer_text: string;
    score: number;
    feedback: string;
    key_points_covered: string[];
    missing_aspects: string[];
  }>;
  learning_roadmap: Array<{
    step: number;
    topic: string;
    action: string;
    resources: string;
  }>;
  created_at: string;
}

