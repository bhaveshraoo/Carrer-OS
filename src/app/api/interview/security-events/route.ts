import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { sessionId, events } = body;

    if (!sessionId || !Array.isArray(events)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (events.length === 0) {
      return NextResponse.json({ success: true, processed: 0 });
    }

    // Prepare rows for Supabase database table `interview_security_events`
    const rows = events.map((ev: any) => ({
      session_id: sessionId,
      event_type: ev.type,
      started_at: new Date(ev.startedAt).toISOString(),
      duration_ms: ev.durationMs,
      confidence: ev.confidence || 0.9,
      metadata: ev.metadata || {},
    }));

    try {
      await (supabase.from("interview_security_events") as any).insert(rows);
    } catch (err) {
      // Fallback: log to server console if table doesn't exist
      console.log(`[SECURITY LOG - Session ${sessionId}] Processed ${rows.length} security events.`);
    }

    return NextResponse.json({ success: true, processed: rows.length });
  } catch (err: any) {
    console.error("POST /api/interview/security-events Error:", err);
    return NextResponse.json({ error: err.message || "Failed to log events" }, { status: 500 });
  }
}
