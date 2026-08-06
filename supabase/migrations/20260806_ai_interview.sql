-- Migration for CareerOS AI Interview Module

CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  job_role TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_description TEXT NOT NULL,
  experience TEXT NOT NULL,
  tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  difficulty TEXT NOT NULL,
  interview_type TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  language TEXT NOT NULL DEFAULT 'English',
  personality TEXT NOT NULL,
  blueprint JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'configured',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  expected_aspects JSONB NOT NULL DEFAULT '[]'::jsonb,
  asked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  duration_seconds INT NOT NULL DEFAULT 0,
  speaking_wpm INT NOT NULL DEFAULT 0,
  filler_words_count INT NOT NULL DEFAULT 0,
  response_delay_seconds INT NOT NULL DEFAULT 0,
  evaluation JSONB NOT NULL DEFAULT '{}'::jsonb,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interview_memory (
  session_id UUID PRIMARY KEY REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  strong_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  weak_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  communication_rating TEXT NOT NULL DEFAULT 'Good',
  confidence_score INT NOT NULL DEFAULT 75,
  topics_covered JSONB NOT NULL DEFAULT '[]'::jsonb,
  questions_asked JSONB NOT NULL DEFAULT '[]'::jsonb,
  resume_references JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interview_analytics (
  session_id UUID PRIMARY KEY REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  face_visible BOOLEAN NOT NULL DEFAULT true,
  face_centered BOOLEAN NOT NULL DEFAULT true,
  looking_away BOOLEAN NOT NULL DEFAULT false,
  multiple_faces BOOLEAN NOT NULL DEFAULT false,
  low_noise_pct INT NOT NULL DEFAULT 100,
  medium_noise_pct INT NOT NULL DEFAULT 0,
  high_noise_pct INT NOT NULL DEFAULT 0,
  avg_speaking_speed_wpm INT NOT NULL DEFAULT 130,
  filler_words_total INT NOT NULL DEFAULT 0,
  long_pauses_count INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.interview_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  overall_score INT NOT NULL DEFAULT 0,
  communication_score INT NOT NULL DEFAULT 0,
  technical_score INT NOT NULL DEFAULT 0,
  problem_solving_score INT NOT NULL DEFAULT 0,
  confidence_score INT NOT NULL DEFAULT 0,
  behavior_score INT NOT NULL DEFAULT 0,
  hiring_recommendation TEXT NOT NULL,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  interview_summary TEXT NOT NULL,
  learning_roadmap JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
