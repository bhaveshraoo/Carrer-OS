import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const direction = body.direction as "left" | "right";
    const companyId = body.companyId as string | undefined;

    if (!direction || !["left", "right"].includes(direction)) {
      return NextResponse.json({ success: false, error: "Invalid direction" }, { status: 400 });
    }

    // 1. Log swipe silently in database
    try {
      await table(supabase, "job_swipes_log").insert({
        user_id: user.id,
        job_id: jobId,
        direction,
      });
    } catch (err) {
      console.warn("Notice: job_swipes_log table error:", err);
    }

    // 2. If right swipe, persist directly into user's database account
    if (direction === "right") {
      // 2a. Insert into job_wishlists table in Supabase DB
      try {
        await table(supabase, "job_wishlists").upsert({
          user_id: user.id,
          job_id: jobId,
        });
      } catch (err) {
        console.warn("Notice: job_wishlists table error:", err);
      }

      // 2b. Insert into user_company_targets table in Supabase DB
      if (companyId) {
        try {
          await table(supabase, "user_company_targets").upsert({
            user_id: user.id,
            company_id: companyId,
          });
        } catch (err) {
          console.warn("Notice: user_company_targets table error:", err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: direction === "right" ? "Saved to user account in database" : "Swiped left",
    });
  } catch (error) {
    console.error("POST /api/jobs/[id]/swipe error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record swipe" },
      { status: 500 }
    );
  }
}
