import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET all companies
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, companies: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST create company
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { name, tier, ctcPackage, requiredSkills, logoUrl, careerPageUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Company name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const { data, error } = await (supabase.from("companies") as any)
      .insert({
        name,
        slug,
        logo_url: logoUrl || `https://logo.clearbit.com/${slug}.com`,
        career_page_url: careerPageUrl || null,
        metadata: {
          tier: tier || "Product Enterprise",
          ctc: ctcPackage || "₹30 LPA",
          skills: requiredSkills || ["DSA", "System Design"],
        },
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, company: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT update company
export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { id, name, tier, ctcPackage, requiredSkills, logoUrl } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Company ID is required" }, { status: 400 });
    }

    const { data, error } = await (supabase.from("companies") as any)
      .update({
        name,
        metadata: {
          tier: tier || "Product Enterprise",
          ctc: ctcPackage || "₹30 LPA",
          skills: requiredSkills || ["DSA", "System Design"],
        },
        logo_url: logoUrl || undefined,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, company: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE company
export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Company ID is required" }, { status: 400 });
    }

    const { error } = await (supabase.from("companies") as any)
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
