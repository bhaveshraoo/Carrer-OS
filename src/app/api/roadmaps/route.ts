import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { PREDEFINED_TRACKS, TopicDefinition } from "@/lib/roadmaps/tracks-data";
import { distributeTopicsAcrossDays, toYmd, addDays } from "@/lib/roadmaps/planner";
import { generateJson } from "@/lib/ai";
import { getLocalRoadmaps, getLocalTasks, saveLocalRoadmap } from "@/lib/roadmaps/store";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || DEMO_USER_ID;

    let roadmapsList: any[] = [];

    // Try Supabase first
    try {
      const { data, error } = await (supabase.from("roadmaps") as any)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        roadmapsList = data;
      } else {
        roadmapsList = getLocalRoadmaps(userId);
      }
    } catch (e) {
      roadmapsList = getLocalRoadmaps(userId);
    }

    // Attach task completion counts
    const roadmapsWithStats = await Promise.all(
      roadmapsList.map(async (rm: any) => {
        let tasks: any[] = [];
        try {
          const { data } = await (supabase.from("roadmap_tasks") as any)
            .select("id, completed, task_type")
            .eq("roadmap_id", rm.id);
          if (data && data.length > 0) tasks = data;
          else tasks = getLocalTasks(rm.id);
        } catch (e) {
          tasks = getLocalTasks(rm.id);
        }

        const studyTasks = (tasks || []).filter((t: any) => t.task_type === "study");
        const completedStudyTasks = studyTasks.filter((t: any) => t.completed);

        return {
          ...rm,
          total_tasks: studyTasks.length,
          completed_tasks: completedStudyTasks.length,
          progress_pct: studyTasks.length > 0 ? Math.round((completedStudyTasks.length / studyTasks.length) * 100) : 0,
        };
      })
    );

    return NextResponse.json({ success: true, roadmaps: roadmapsWithStats });
  } catch (err: any) {
    console.error("GET /api/roadmaps error:", err);
    return NextResponse.json({ success: true, roadmaps: [] });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || DEMO_USER_ID;

    const body = await req.json();
    const { trackId, customTopic, durationMonths = 3, dailyHours = 2, startDateStr } = body;

    // 1. Rate limiting check (max 2 per rolling 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    let recentCount = 0;
    try {
      const { data } = await (supabase.from("roadmaps") as any)
        .select("id")
        .eq("user_id", userId)
        .gte("created_at", sevenDaysAgo);
      recentCount = data ? data.length : 0;
    } catch (e) {
      const localRms = getLocalRoadmaps(userId);
      recentCount = localRms.filter((r) => r.created_at >= sevenDaysAgo).length;
    }

    if (recentCount >= 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Free Tier Limit Reached: You can create a maximum of 2 new roadmaps per rolling 7-day window.",
        },
        { status: 429 }
      );
    }

    let trackTitle = "";
    let isCustom = false;
    let topicsToSchedule: TopicDefinition[] = [];

    const startYmd = startDateStr || toYmd(new Date());
    const targetDays = durationMonths * 30;
    const targetEndYmd = addDays(startYmd, targetDays);

    // 2. Handle Predefined Track vs Custom Gemini Track
    if (trackId && trackId !== "custom") {
      const predefined = PREDEFINED_TRACKS.find((t) => t.id === trackId);
      if (!predefined) {
        return NextResponse.json({ success: false, error: `Invalid track ID: ${trackId}` }, { status: 400 });
      }
      trackTitle = predefined.title;
      topicsToSchedule = predefined.topics;
    } else if (customTopic && customTopic.trim()) {
      isCustom = true;
      trackTitle = `Custom Roadmap: ${customTopic.trim()}`;

      // Call Gemini 3.1 Flash-Lite
      const systemPrompt = `You are a Senior Curriculum Architect at CareerOS. Generate a comprehensive, highly structured education roadmap and skill-tree for the topic requested by the student. Return ONLY valid JSON containing an array of topics.
Each topic object MUST follow this schema with 3 to 4 subTopics:
{
  "id": "topic-1",
  "title": "Topic Name",
  "category": "Domain Category",
  "estimatedMinutes": 180,
  "prerequisiteIds": [],
  "subTopics": [
    {
      "id": "sub-1-1",
      "title": "Granular Sub-Topic Title",
      "estimatedMinutes": 45,
      "objectives": ["Objective 1", "Objective 2"],
      "guideNotes": "Detailed educational study guide and conceptual breakdown.",
      "practiceTask": "Concrete hands-on code exercise or homework problem.",
      "codeSnippet": "// Code sample to study\\nfunction example() {}",
      "resources": [
        { "title": "Resource Title", "url": "https://example.com", "type": "doc" }
      ]
    }
  ]
}`;

      const userPrompt = `Create a complete student education roadmap for: "${customTopic.trim()}". Break down into 4 to 8 sequential modules, and for EACH module provide 3 to 4 distinct subTopics (35-45 minutes each). Ensure each subTopic has clear objectives, study notes, a code snippet, a practice homework task, and resource links.`;

      try {
        const aiResponse = await generateJson<{ topics: TopicDefinition[] }>({
          system: systemPrompt,
          prompt: userPrompt,
        });

        if (aiResponse && Array.isArray(aiResponse.topics) && aiResponse.topics.length > 0) {
          topicsToSchedule = aiResponse.topics.map((t, idx) => ({
            id: t.id || `custom-topic-${idx + 1}`,
            title: t.title || `Module ${idx + 1}`,
            category: t.category || customTopic.trim(),
            estimatedMinutes: t.estimatedMinutes || 180,
            prerequisiteIds: Array.isArray(t.prerequisiteIds) ? t.prerequisiteIds : [],
            subTopics: Array.isArray(t.subTopics) && t.subTopics.length > 0
              ? t.subTopics
              : [
                  {
                    id: `cust-${idx}-1`,
                    title: `${t.title} - Foundations`,
                    estimatedMinutes: 45,
                    objectives: [`Understand core concepts of ${t.title}`],
                    guideNotes: t.notes || `Study guide for ${t.title}.`,
                    practiceTask: `Review concepts for ${t.title}.`,
                    resources: t.resources || [],
                  },
                ],
          }));
        } else {
          throw new Error("Invalid structure returned from AI");
        }
      } catch (aiErr) {
        console.warn("Gemini generation fallback:", aiErr);
        topicsToSchedule = [
          {
            id: "cust-1",
            title: `Foundations of ${customTopic.trim()}`,
            category: "Foundations",
            estimatedMinutes: 180,
            prerequisiteIds: [],
            subTopics: [
              {
                id: "cust-1-1",
                title: `Core Principles of ${customTopic.trim()}`,
                estimatedMinutes: 45,
                objectives: ["Master core definitions and background context"],
                guideNotes: `Comprehensive educational overview of ${customTopic.trim()}.`,
                practiceTask: `Summarize top 3 core principles of ${customTopic.trim()}.`,
                resources: [{ title: "Official Documentation", url: "https://developer.mozilla.org", type: "doc" }],
              },
            ],
          },
          {
            id: "cust-2",
            title: `Core Mechanics & Architecture of ${customTopic.trim()}`,
            category: "Core Topics",
            estimatedMinutes: 240,
            prerequisiteIds: ["cust-1"],
            subTopics: [
              {
                id: "cust-2-1",
                title: `Architecture Deep Dive in ${customTopic.trim()}`,
                estimatedMinutes: 45,
                objectives: ["Analyze execution pipeline and data structures"],
                guideNotes: `In-depth analysis of core components in ${customTopic.trim()}.`,
                practiceTask: `Implement sample code for ${customTopic.trim()}.`,
                resources: [{ title: "Deep Dive Guide", url: "https://geeksforgeeks.org", type: "article" }],
              },
            ],
          },
        ];
      }
    } else {
      return NextResponse.json({ success: false, error: "Please select a track or provide a custom topic." }, { status: 400 });
    }

    // 3. Pacing Engine
    const { tasks: scheduledTasksPayload, calculatedEndDate } = distributeTopicsAcrossDays({
      topics: topicsToSchedule,
      startDateStr: startYmd,
      dailyHours: Number(dailyHours),
      durationMonths: Number(durationMonths),
    });

    const roadmapId = `rm-${Date.now()}`;

    const roadmapObj = {
      id: roadmapId,
      user_id: userId,
      track_id: trackId || "custom",
      title: trackTitle,
      is_custom: isCustom,
      start_date: startYmd,
      target_end_date: calculatedEndDate || targetEndYmd,
      daily_hours: Number(dailyHours),
      status: "active" as const,
      created_at: new Date().toISOString(),
    };

    const tasksToInsert = scheduledTasksPayload.map((t, idx) => ({
      id: `task-${Date.now()}-${idx}`,
      roadmap_id: roadmapId,
      user_id: userId,
      scheduled_date: t.scheduled_date,
      scheduled_time: null,
      topic_id: t.topic_id,
      topic_title: t.topic_title,
      topic_category: t.topic_category,
      // ── Grouping fields (Topic → Sub-topics structure) ──
      parent_topic_id: t.parent_topic_id,
      parent_topic_title: t.parent_topic_title,
      // ── Study content ──
      notes: t.notes,
      objectives: t.objectives || [],
      practice_task: t.practice_task || null,
      code_snippet: t.code_snippet || null,
      resources: t.resources,
      estimated_minutes: t.estimated_minutes,
      task_type: t.task_type,
      event_subtype: t.event_subtype,
      completed: false,
      completed_at: null,
      is_backlog: false,
      order_index: t.order_index,
      created_at: new Date().toISOString(),
    }));

    // Save to Supabase AND local store fallback
    try {
      await table(supabase, "roadmaps").insert(roadmapObj);
      for (const taskItem of tasksToInsert) {
        await table(supabase, "roadmap_tasks").insert(taskItem);
      }
    } catch (e) {
      console.warn("Supabase insert fallback to local store:", e);
    }

    // Always ensure local store copy exists for self-healing
    saveLocalRoadmap(roadmapObj, tasksToInsert);

    return NextResponse.json({
      success: true,
      roadmapId,
      title: trackTitle,
      totalTasks: tasksToInsert.length,
      targetEndDate: calculatedEndDate || targetEndYmd,
    });
  } catch (err: any) {
    console.error("POST /api/roadmaps error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
