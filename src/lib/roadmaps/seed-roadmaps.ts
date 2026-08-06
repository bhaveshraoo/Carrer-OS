export interface SeedRoadmapItem {
  id: string;
  track_id: string;
  title: string;
  is_custom: boolean;
  start_date: string;
  target_end_date: string;
  daily_hours: number;
  status: "active" | "completed" | "abandoned";
  total_tasks: number;
  completed_tasks: number;
  progress_pct: number;
}

export const SEED_ROADMAPS: SeedRoadmapItem[] = [
  {
    id: "rm_dsa_1",
    track_id: "dsa",
    title: "Data Structures & Algorithms Mastery",
    is_custom: false,
    start_date: "2026-08-01",
    target_end_date: "2026-10-31",
    daily_hours: 2,
    status: "active",
    total_tasks: 45,
    completed_tasks: 32,
    progress_pct: 71,
  },
  {
    id: "rm_sd_2",
    track_id: "system-design",
    title: "High-Scale Distributed System Design",
    is_custom: false,
    start_date: "2026-08-02",
    target_end_date: "2026-11-15",
    daily_hours: 2,
    status: "active",
    total_tasks: 30,
    completed_tasks: 18,
    progress_pct: 60,
  },
  {
    id: "rm_fs_3",
    track_id: "fullstack",
    title: "Full-Stack Web Engineering (React & Node.js)",
    is_custom: false,
    start_date: "2026-07-15",
    target_end_date: "2026-10-15",
    daily_hours: 3,
    status: "active",
    total_tasks: 50,
    completed_tasks: 42,
    progress_pct: 84,
  },
  {
    id: "rm_be_4",
    track_id: "backend",
    title: "Backend Infrastructure & Microservices",
    is_custom: false,
    start_date: "2026-08-03",
    target_end_date: "2026-11-30",
    daily_hours: 2,
    status: "active",
    total_tasks: 40,
    completed_tasks: 20,
    progress_pct: 50,
  },
  {
    id: "rm_ai_5",
    track_id: "ai-ml",
    title: "AI Engineering & LLM Application Development",
    is_custom: true,
    start_date: "2026-08-05",
    target_end_date: "2026-12-05",
    daily_hours: 2,
    status: "active",
    total_tasks: 35,
    completed_tasks: 14,
    progress_pct: 40,
  },
];
