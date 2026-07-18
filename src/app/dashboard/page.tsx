import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { table } from "@/lib/supabase/typed-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Building2, Code2, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await table(supabase, "users").select("*").eq("id", user.id).single()
    : { data: null };

  const firstName = (profile?.full_name || profile?.username || "").split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy-900">
          {firstName ? `Welcome back, ${firstName}` : "Welcome to CareerOS"}
        </h1>
        <p className="text-slate-500 mt-1">
          Upload your resume to get your first score and prep roadmap.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Card>
          <CardHeader>
            <div className="size-10 rounded-full bg-teal-50 flex items-center justify-center mb-2">
              <FileText className="size-5 text-teal-700" />
            </div>
            <CardTitle>Resume</CardTitle>
            <CardDescription>No resume uploaded yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="primary" size="sm">
              <Link href="/dashboard/resume">
                Upload resume <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="size-10 rounded-full bg-teal-50 flex items-center justify-center mb-2">
              <Building2 className="size-5 text-teal-700" />
            </div>
            <CardTitle>Target Companies</CardTitle>
            <CardDescription>Pick 3–5 companies to prep for.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/companies">
                Browse companies <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="size-10 rounded-full bg-teal-50 flex items-center justify-center mb-2">
              <Code2 className="size-5 text-teal-700" />
            </div>
            <CardTitle>DSA Prep</CardTitle>
            <CardDescription>Practice by topic, and target companies right here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/prep">
                Start practicing <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
