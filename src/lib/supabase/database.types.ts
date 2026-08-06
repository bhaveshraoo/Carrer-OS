import type { ResumeAnalysisReport } from "@/lib/resume/types";

/**
 * Hand-written to match supabase/migrations/0001_phase1_schema.sql exactly.
 *
 * Once you have the Supabase CLI linked to your real project, regenerate this
 * automatically instead of hand-editing it further:
 *   supabase gen types typescript --linked > src/lib/supabase/database.types.ts
 * (npx supabase login && npx supabase link --project-ref <your-ref> first)
 *
 * That command produces this same shape (Database.public.Tables.<table>.Row/Insert/Update),
 * so nothing that imports from here needs to change when you switch to codegen —
 * only run it after every migration so this file never silently drifts from the
 * real schema.
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string | null;
          username: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          username?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          username?: string | null;
          created_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          storage_path: string;
          file_name: string;
          file_size: number | null;
          mime_type: string | null;
          raw_text: string | null;
          status: "uploaded" | "parsed" | "analyzed" | "error";
          version: number;
          parsed_at: string | null;
          analyzed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          storage_path: string;
          file_name: string;
          file_size?: number | null;
          mime_type?: string | null;
          raw_text?: string | null;
          status?: "uploaded" | "parsed" | "analyzed" | "error";
          version?: number;
          parsed_at?: string | null;
          analyzed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          storage_path?: string;
          file_name?: string;
          file_size?: number | null;
          mime_type?: string | null;
          raw_text?: string | null;
          status?: "uploaded" | "parsed" | "analyzed" | "error";
          version?: number;
          parsed_at?: string | null;
          analyzed_at?: string | null;
          created_at?: string;
        };
      };
      resume_analyses: {
        Row: {
          id: string;
          resume_id: string;
          resume_score: number | null;
          ats_score: number | null;
          recruiter_score: number | null;
          hr_readability_score: number | null;
          industry_match_score: number | null;
          report: ResumeAnalysisReport | Record<string, never>;
          ai_provider: string | null;
          model_name: string | null;
          processing_time_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          resume_score?: number | null;
          ats_score?: number | null;
          recruiter_score?: number | null;
          hr_readability_score?: number | null;
          industry_match_score?: number | null;
          report?: ResumeAnalysisReport | Record<string, never>;
          ai_provider?: string | null;
          model_name?: string | null;
          processing_time_ms?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          resume_score?: number | null;
          ats_score?: number | null;
          recruiter_score?: number | null;
          hr_readability_score?: number | null;
          industry_match_score?: number | null;
          report?: ResumeAnalysisReport | Record<string, never>;
          ai_provider?: string | null;
          model_name?: string | null;
          processing_time_ms?: number | null;
          created_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          career_page_url: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          career_page_url?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          career_page_url?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
      };
      company_intel: {
        Row: {
          id: string;
          company_id: string;
          overview: string | null;
          hiring_process: { stage: string; description: string }[];
          required_skills: string[];
          prep_roadmap: string | null;
          source_urls: string[];
          embedding: string | null; // pgvector — raw string form via the JS client
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          overview?: string | null;
          hiring_process?: { stage: string; description: string }[];
          required_skills?: string[];
          prep_roadmap?: string | null;
          source_urls?: string[];
          embedding?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          overview?: string | null;
          hiring_process?: { stage: string; description: string }[];
          required_skills?: string[];
          prep_roadmap?: string | null;
          source_urls?: string[];
          embedding?: string | null;
          updated_at?: string;
        };
      };
      dsa_questions: {
        Row: {
          id: string;
          title: string;
          topic: string;
          difficulty: "easy" | "medium" | "hard";
          prompt: string;
          solution_explanation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          topic: string;
          difficulty: "easy" | "medium" | "hard";
          prompt: string;
          solution_explanation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          topic?: string;
          difficulty?: "easy" | "medium" | "hard";
          prompt?: string;
          solution_explanation?: string | null;
          created_at?: string;
        };
      };
      company_dsa_topics: {
        Row: {
          company_id: string;
          topic: string;
          emphasis: number;
        };
        Insert: {
          company_id: string;
          topic: string;
          emphasis?: number;
        };
        Update: {
          company_id?: string;
          topic?: string;
          emphasis?: number;
        };
      };
      user_company_targets: {
        Row: {
          user_id: string;
          company_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          company_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          company_id?: string;
          created_at?: string;
        };
      };
      roadmaps: {
        Row: {
          id: string;
          user_id: string;
          track_id: string;
          title: string;
          is_custom: boolean;
          start_date: string;
          target_end_date: string;
          daily_hours: number;
          status: "active" | "completed" | "abandoned";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          track_id: string;
          title: string;
          is_custom?: boolean;
          start_date: string;
          target_end_date: string;
          daily_hours: number;
          status?: "active" | "completed" | "abandoned";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          track_id?: string;
          title?: string;
          is_custom?: boolean;
          start_date?: string;
          target_end_date?: string;
          daily_hours?: number;
          status?: "active" | "completed" | "abandoned";
          created_at?: string;
        };
      };
      roadmap_tasks: {
        Row: {
          id: string;
          roadmap_id: string;
          user_id: string;
          scheduled_date: string;
          scheduled_time: string | null;
          topic_id: string;
          topic_title: string;
          topic_category: string;
          notes: string | null;
          resources: any;
          estimated_minutes: number;
          task_type: "study" | "manual-event";
          event_subtype: "test" | "class" | "interview" | "deadline" | "note" | null;
          completed: boolean;
          completed_at: string | null;
          is_backlog: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          roadmap_id: string;
          user_id: string;
          scheduled_date: string;
          scheduled_time?: string | null;
          topic_id: string;
          topic_title: string;
          topic_category: string;
          notes?: string | null;
          resources?: any;
          estimated_minutes?: number;
          task_type?: "study" | "manual-event";
          event_subtype?: "test" | "class" | "interview" | "deadline" | "note" | null;
          completed?: boolean;
          completed_at?: string | null;
          is_backlog?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          roadmap_id?: string;
          user_id?: string;
          scheduled_date?: string;
          scheduled_time?: string | null;
          topic_id?: string;
          topic_title?: string;
          topic_category?: string;
          notes?: string | null;
          resources?: any;
          estimated_minutes?: number;
          task_type?: "study" | "manual-event";
          event_subtype?: "test" | "class" | "interview" | "deadline" | "note" | null;
          completed?: boolean;
          completed_at?: string | null;
          is_backlog?: boolean;
          order_index?: number;
          created_at?: string;
        };
      };
      user_streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_active_date: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string | null;
          updated_at?: string;
        };
      };
      roadmap_certificates: {
        Row: {
          id: string;
          roadmap_id: string;
          user_id: string;
          user_name: string;
          track_title: string;
          duration_label: string;
          issued_date: string;
          certificate_slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          roadmap_id: string;
          user_id: string;
          user_name: string;
          track_title: string;
          duration_label: string;
          issued_date: string;
          certificate_slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          roadmap_id?: string;
          user_id?: string;
          user_name?: string;
          track_title?: string;
          duration_label?: string;
          issued_date?: string;
          certificate_slug?: string;
          created_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          company_id: string;
          role: string;
          description: string;
          domain: string;
          location: string;
          ctc_range: string;
          tech_stack: string[];
          interview_types: string[];
          application_url: string;
          last_date: string;
          status: "active" | "expired";
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          role: string;
          description: string;
          domain?: string;
          location?: string;
          ctc_range?: string;
          tech_stack?: string[];
          interview_types?: string[];
          application_url: string;
          last_date: string;
          status?: "active" | "expired";
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          role?: string;
          description?: string;
          domain?: string;
          location?: string;
          ctc_range?: string;
          tech_stack?: string[];
          interview_types?: string[];
          application_url?: string;
          last_date?: string;
          status?: "active" | "expired";
          created_at?: string;
        };
      };
      job_wishlists: {
        Row: {
          user_id: string;
          job_id: string;
          swiped_at: string;
        };
        Insert: {
          user_id: string;
          job_id: string;
          swiped_at?: string;
        };
        Update: {
          user_id?: string;
          job_id?: string;
          swiped_at?: string;
        };
      };
      job_swipes_log: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          direction: "left" | "right";
          swiped_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: string;
          direction: "left" | "right";
          swiped_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: string;
          direction?: "left" | "right";
          swiped_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
